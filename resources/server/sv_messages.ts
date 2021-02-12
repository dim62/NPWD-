import md5 from 'md5';

import events from '../utils/events';
import {
  Message,
  MessageGroup,
  CreateMessageGroupResult,
} from '../../phone/src/common/typings/messages';
import { pool, withTransaction } from './db';
import { getSource, useIdentifier } from './functions';
import { mainLogger } from './sv_logger';

const messageLogger = mainLogger.child({ module: 'messages' });

/**
 * Used for the raw npwd_messages_groups row responses
 */
interface UnformattedMessageGroup {
  group_id: string;
  user_identifier: string;
  participant_identifier: string;
  phone_number: string;
  label?: string;
  avatar?: string;
  display?: string;
  updatedAt: string;
}

/**
 * Used to help consolidate raw npwd_messages_groups rows into
 * a mapping of a single message group
 */
interface MessageGroupMapping {
  [groupId: string]: {
    user_identifier: string;
    participants: string[];
    label?: string;
    avatar?: string;
    updatedAt: string;
  };
}

/**
 * Create a message in the database
 * @param userIdentifier - identifier of the user creating this message
 * @param groupId - the message group ID to attach this message to
 * @param message - content of the message
 */
async function createMessage(
  userIdentifier: string,
  groupId: string,
  message: string
): Promise<any> {
  const query = `
  INSERT INTO npwd_messages
  (user_identifier, message, group_id)
  VALUES (?, ?, ?)
  `;
  const [results] = await pool.query(query, [userIdentifier, message, groupId]);
  return results;
}

/**
 * Retrieve all message groups associated with a user. This will
 * populate the list of message groups on the UI
 * @param userIdentifier - identifier of the user to get message groups for
 */
async function getMessageGroups(
  userIdentifier: string
): Promise<UnformattedMessageGroup[]> {
  const query = `
  SELECT
    npwd_messages_groups.group_id,
    npwd_messages_groups.participant_identifier,
    npwd_messages_groups.user_identifier,
    npwd_messages_labels.label,
    users.phone_number,
    npwd_phone_contacts.avatar,
    npwd_phone_contacts.display
  FROM (
	  SELECT group_id
    FROM npwd_messages_groups
    WHERE npwd_messages_groups.participant_identifier = ?
  ) as t
  LEFT OUTER JOIN npwd_messages_groups on npwd_messages_groups.group_id = t.group_id
  LEFT OUTER JOIN users on users.identifier = npwd_messages_groups.participant_identifier
  LEFT OUTER JOIN npwd_messages_labels on npwd_messages_labels.group_id = npwd_messages_groups.group_id
  LEFT OUTER JOIN npwd_phone_contacts on REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') = REGEXP_REPLACE(users.phone_number, '[^0-9]', '') AND npwd_phone_contacts.identifier = ?
  WHERE npwd_messages_groups.participant_identifier != ?
  ORDER BY npwd_messages_groups.createdAt DESC
  `;
  const [results] = await pool.query(query, [
    userIdentifier,
    userIdentifier,
    userIdentifier,
  ]);
  return <UnformattedMessageGroup[]>results;
}

/**
 * Retrieve all messages associated with a group and add a field
 * "isMine" which determines if the message belongs to the user
 * making the request
 * @param userIdentifier - user to get messages for
 * @param groupId - the group to get messages from
 */
async function getMessages(
  userIdentifier: string,
  groupId: string
): Promise<Message[]> {
  const query = `
  SELECT
	  npwd_messages.id,
    npwd_messages.message,
    npwd_messages.user_identifier,
    npwd_messages.isRead,
    npwd_messages.updatedAt,
    users.phone_number,
    npwd_phone_contacts.display,
    npwd_phone_contacts.avatar
  FROM npwd_messages
  LEFT OUTER JOIN users on users.identifier = npwd_messages.user_identifier
  LEFT OUTER JOIN npwd_phone_contacts on REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') = REGEXP_REPLACE(users.phone_number, '[^0-9]', '') AND npwd_phone_contacts.identifier = ?
  WHERE npwd_messages.group_id = ?
  ORDER BY createdAt ASC;
  `;
  const [results] = await pool.query(query, [userIdentifier, groupId]);
  const messages = <Message[]>results;
  return messages.map((message) => ({
    ...message,
    isMine: message.user_identifier === userIdentifier,
    updatedAt: message.updatedAt.toString(),
  }));
}

/**
 * Create a message group label
 * @param userIdentifier - user who is creating the message group
 * @param groupId - groupId this label is attached to
 * @param label - the label itself
 */
async function createLabel(
  userIdentifier: string,
  groupId: string,
  label: string
): Promise<any> {
  const query = `
  INSERT INTO npwd_messages_labels
  (user_identifier, group_id, label)
  VALUES (?, ?, ?)
  `;
  await pool.query(query, [userIdentifier, groupId, label]);
}

/**
 * Create a message group
 * @param userIdentifier - the user creating the message group
 * @param groupId - the unique group ID this corresponds to
 * @param participantIdentifier - the participant user identifier. This identifier is what attaches
 * other players to the message group
 */
async function createMessageGroup(
  userIdentifier: string,
  groupId: string,
  participantIdentifier: string
): Promise<any> {
  const query = `
  INSERT INTO npwd_messages_groups
  (user_identifier, group_id, participant_identifier)
  VALUES (?, ?, ?)
  `;
  const [results] = await pool.query(query, [
    userIdentifier,
    groupId,
    participantIdentifier,
  ]);
}

/**
 * Find a players identifier from their phone number
 * @param phoneNumber - the phone number to search for
 */
async function getIdentifierFromPhoneNumber(
  phoneNumber: string
): Promise<string> {
  const query = `
    SELECT identifier
    FROM users
    WHERE REGEXP_REPLACE(phone_number, '[^0-9]', '') = ?
    LIMIT 1
  `;
  const [results] = await pool.query(query, [phoneNumber]);
  const identifiers = <any>results;
  return identifiers[0]['identifier'];
}

/**
 * This method checks if the input groupId already exists in
 * the database. As long as the groupId is derived from the input
 * identifiers this means that the user is trying to create a
 * duplicate!
 * @param groupId - group Id to check that it exists
 */
async function checkIfMessageGroupExists(groupId: string): Promise<boolean> {
  const query = `
    SELECT COUNT(*) as count
    FROM npwd_messages_groups
    WHERE group_id = ?;
  `;
  const [results] = await pool.query(query, [groupId]);
  const result = <any>results;
  const count = result[0].count;
  return count > 0;
}

async function getMessageCountByGroup(groupId: string): Promise<number> {
  const query = `
    SELECT COUNT(*) as count
    FROM npwd_messages
    WHERE group_id = ?;
  `;
  const [results] = await pool.query(query, [groupId]);
  const result = <any>results;
  return result[0].count;
}

/**
 * Consolidate raw message groups into a mapping that groups participants
 * by the message group. The goal of this is to reduce the rows of message
 * groups into a single MessageGroup object.
 * @param userIdentifier - the user identifier to get message groups for
 */
async function getConsolidatedMessageGroups(
  userIdentifier: string
): Promise<MessageGroupMapping> {
  const messageGroups = await getMessageGroups(userIdentifier);
  return messageGroups.reduce(
    (mapping: MessageGroupMapping, messageGroup: UnformattedMessageGroup) => {
      const groupId = messageGroup.group_id;
      const displayTerm =
        messageGroup.display || messageGroup.phone_number || '???';

      if (groupId in mapping) {
        mapping[groupId].participants = mapping[groupId].participants.concat(
          displayTerm
        );
      } else {
        mapping[groupId] = {
          user_identifier: messageGroup.user_identifier,
          avatar: messageGroup.avatar,
          label: messageGroup.label,
          participants: [displayTerm],
          updatedAt: messageGroup.updatedAt
            ? messageGroup.updatedAt.toString()
            : null,
        };
      }
      return mapping;
    },
    {}
  );
}

async function getGroupIds(
  userIdentifier: string,
  groupMapping: MessageGroupMapping
): Promise<string[]> {
  const groupIds: string[] = [];
  for (const groupId of Object.keys(groupMapping)) {
    const isMine = groupMapping[groupId].user_identifier === userIdentifier;
    if (isMine || (await getMessageCountByGroup(groupId)) > 0) {
      groupIds.push(groupId);
    }
  }
  return groupIds;
}

/**
 * Given the mapping of groupId: fields contents reduce it into a list
 * of MessageGroup objects ready for the UI to consume
 * @param userIdentifier - user to generate the MessageGroups for
 */
async function getFormattedMessageGroups(
  userIdentifier: string
): Promise<MessageGroup[]> {
  const groupMapping = await getConsolidatedMessageGroups(userIdentifier);
  const groupIds = await getGroupIds(userIdentifier, groupMapping);

  return groupIds.map((groupId) => {
    const group = groupMapping[groupId];
    return {
      ...group,
      groupId,
      groupDisplay: group.participants.join(', '),
      // note that 1 here references how many participants besides the user
      isGroupChat: group.participants.length > 1,
    };
  });
}

/**
 * Main method to handle creation of new message groups. First
 * we retrieve identifiers for each submitted phone number and
 * then rows in npwd_messages_groups are created for each of them
 * bound to a unique groupId. The groupId is any unique string - we
 * use hashes here.
 *
 * These queries are batched with a transaction so that if any of
 * them fail the queries are not committed to the database. This helps
 * avoid situations where some participants get added to the group but
 * one fails resulting in a partial group which would be very confusing
 * to the player.
 * @param userIdentifier - user who is creating the group
 * @param phoneNumbers - list of phone numbers to add to the grup
 * @param groupLabel - optional group label to give the group
 */
async function createMessageGroupsFromPhoneNumbers(
  userIdentifier: string,
  phoneNumbers: string[],
  groupLabel: string
): Promise<CreateMessageGroupResult> {
  // we check that each phoneNumber exists before we create the group
  const identifiers: string[] = [];
  for (const phoneNumber of phoneNumbers) {
    try {
      const identifier = await getIdentifierFromPhoneNumber(phoneNumber);
      identifiers.push(identifier);
    } catch (err) {
      return { error: true, phoneNumber };
    }
  }

  // don't allow explicitly adding yourself
  if (identifiers.some((identifier) => identifier === userIdentifier)) {
    return { error: true, mine: true };
  }

  // make sure we are always in a consistent order. It is very important
  // that this not change! Changing this order can result in the ability
  // of duplicate message groups being created.
  identifiers.sort();
  const mergedIdentifiers = identifiers.join('-');
  // we don't need this to be secure. Its purpose is to create a unique
  // string derived from the identifiers. In this way we can check
  // that this groupId isn't used before. If it has then it means
  // we are trying to create a duplicate message group!
  const groupId = md5(mergedIdentifiers);
  if (await checkIfMessageGroupExists(groupId)) {
    return { error: true, duplicate: true };
  }

  const queryPromises = [
    // create a row that contains ourselves so reverse accessing from
    // other players works as expected
    createMessageGroup(userIdentifier, groupId, userIdentifier),
    ...identifiers.map((identifier) =>
      createMessageGroup(userIdentifier, groupId, identifier)
    ),
  ];

  // we allow users to attach labels to name their group chats
  if (groupLabel) {
    queryPromises.push(createLabel(userIdentifier, groupId, groupLabel));
  }

  // wrap this in a transaction to make sure ALL of these INSERTs succeed
  // so we are not left in a situation where only some of the member of the
  // group exist while other are left off.
  try {
    await withTransaction(queryPromises);
  } catch (err) {
    return { error: true };
  }

  return { error: false, groupId };
}

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS, async () => {
  try {
    const _identifier = await useIdentifier();
    const messageGroups = await getFormattedMessageGroups(_identifier);
    emitNet(
      events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS,
      getSource(),
      messageGroups
    );
  } catch (e) {
    emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED, getSource());
    messageLogger.error(`Failed to fetch messages groups, ${e.message}`);
  }
});

onNet(
  events.MESSAGES_CREATE_MESSAGE_GROUP,
  async (phoneNumbers: string[], label: string = null) => {
    try {
      const _identifier = await useIdentifier();
      const result = await createMessageGroupsFromPhoneNumbers(
        _identifier,
        phoneNumbers,
        label
      );

      if (result.error) {
        emitNet(
          events.MESSAGES_CREATE_MESSAGE_GROUP_FAILED,
          getSource(),
          result
        );
      } else {
        emitNet(
          events.MESSAGES_CREATE_MESSAGE_GROUP_SUCCESS,
          getSource(),
          result
        );
      }
    } catch (e) {
      emitNet(events.MESSAGES_CREATE_MESSAGE_GROUP_FAILED, getSource());
      messageLogger.error(`Failed to create message group, ${e.message}`);
    }
  }
);

onNet(events.MESSAGES_FETCH_MESSAGES, async (groupId: string) => {
  try {
    const _identifier = await useIdentifier();
    const messages = await getMessages(_identifier, groupId);
    emitNet(events.MESSAGES_FETCH_MESSAGES_SUCCESS, getSource(), messages);
  } catch (e) {
    emitNet(events.MESSAGES_FETCH_MESSAGES_FAILED, getSource());
    messageLogger.error(`Failed to fetch messages, ${e.message}`);
  }
});

onNet(
  events.MESSAGES_SEND_MESSAGE,
  async (groupId: string, message: string) => {
    try {
      const _identifier = await useIdentifier();
      await createMessage(_identifier, groupId, message);
      emitNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, getSource(), groupId);
    } catch (e) {
      emitNet(events.MESSAGES_SEND_MESSAGE_FAILED, getSource());
      messageLogger.error(`Failed to send message, ${e.message}`);
    }
  }
);
