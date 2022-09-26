export interface Message {
  id: number;
  message: string;
  conversation_id?: number;
  author: string;
  is_embed?: boolean;
  embed?: any;
  is_system?: boolean;
  system_type?: 'leave' | 'remove' | 'add';
  system_number?: string;
  createdAt: number;
}

export interface PreDBMessage {
  conversationId: number;
  conversationList: string;
  tgtPhoneNumber: string;
  sourcePhoneNumber?: string;
  message?: string;
  is_embed?: boolean;
  embed?: any;
  is_system?: boolean;
  system_type?: 'leave' | 'remove' | 'add';
  system_number?: string;
}

export interface CreateMessageDTO {
  userIdentifier: string;
  authorPhoneNumber: string;
  conversationId: number;
  message: string;
  is_embed: boolean;
  embed: any;
  is_system?: boolean;
  system_type?: 'leave' | 'remove' | 'add';
  system_number?: string;
}

export interface MessageConversation {
  id: number;
  conversationList: string;
  label: string;
  participant?: string;
  isGroupChat: boolean;
  unread?: number;
  unreadCount?: number;
  updatedAt?: number;
  owner?: string;
  avatar?: string;
}

export interface PreDBConversation {
  participants: string[];
  conversationLabel: string;
  isGroupChat: boolean;
}

export interface MessagesRequest {
  conversationId: string;
  page: number;
}

export interface DeleteConversationRequest {
  conversationsId: number[];
}
export interface RemoveGroupMemberRequest {
  conversationList: string;
  conversationId: number;
  phoneNumber: string;
  leaveGroup: boolean;
}

export interface AddGroupMemberRequest {
  phoneNumbers: string[];
  conversationId: number;
  conversationList: string;
}

export interface MakeGroupOwner {
  conversationId: number;
  phoneNumber: string;
}

export interface ConversationListResponse {
  conversationList: string;
}

export interface AddGroupMemberResponse {
  conversationId: number;
  conversationList: string;
}

/**
 * Used for the raw npwd_messages_groups row responses
 */
export interface UnformattedMessageConversation {
  conversation_id: string;
  user_identifier: string;
  participant_identifier: string;
  phone_number: string;
  avatar?: string;
  display?: string;
  updatedAt?: string;
  unread: number;
}

/**
 * Used to help consolidate raw npwd_messages_groups rows into
 * a mapping of a single message group
 */
export interface MessageGroupMapping {
  [groupId: string]: {
    user_identifier: string;
    // Participant displays
    participants: string[];
    phoneNumbers: string[];
    label?: string;
    avatar?: string;
    updatedAt: string;
    unreadCount: number;
  };
}

export interface CreateMessageGroupResult {
  error?: boolean;
  phoneNumber?: string;
  duplicate?: boolean;
  conversationId?: string;
  mine?: boolean;
  participant: string;
  identifiers: string[];
  doesExist: UnformattedMessageConversation | null;
}

export interface CreateMessageBroadcast {
  message: string;
  groupName: string;
  groupId: string;
}

export interface SetMessageRead {
  groupId: string;
}

export interface MessageConversationResponse {
  conversation_id: number;
  phoneNumber: string;
  updatedAt: number;
  conversationList: string;
  label: string;
  owner?: string;
}

export interface RemoveGroupMemberResponse {
  conversationId: number;
  phoneNumber: string;
}

export interface OnMessageExportCtx {
  /**
   * The incoming message object
   */
  data: PreDBMessage;

  source: number;
}

export interface EmitMessageExportCtx {
  senderNumber: string;
  targetNumber: string;
  message: string;
  embed?: any;
}

export enum MessageEvents {
  FETCH_MESSAGE_CONVERSATIONS = 'npwd:fetchMessageGroups',
  FETCH_MESSAGE_GROUPS_SUCCESS = 'npwd:fetchMessageGroupsSuccess',
  FETCH_MESSAGE_GROUPS_FAILED = 'npwd:fetchMessageGroupsFailed',
  CREATE_MESSAGE_CONVERSATION = 'npwd:createMessageGroup',
  CREATE_MESSAGE_CONVERSATION_SUCCESS = 'npwd:createMessageConversationSuccess',
  CREATE_MESSAGE_GROUP_SUCCESS = 'npwd:createMessageGroupSuccess',
  CREATE_MESSAGE_GROUP_FAILED = 'npwd:createMessageGroupFailed',
  SEND_MESSAGE = 'npwd:sendMessage',
  SEND_EMBED_MESSAGE = 'npwd:sendEmbedMessage',
  SEND_MESSAGE_SUCCESS = 'npwd:sendMessageSuccess',
  SEND_MESSAGE_FAILED = 'npwd:sendMessageFailed',
  DELETE_MESSAGE = 'npwd:deleteMessage',
  FETCH_MESSAGES = 'npwd:fetchMessages',
  FETCH_MESSAGES_SUCCESS = 'npwd:fetchMessagesSuccess',
  FETCH_MESSAGES_FAILED = 'npwd:fetchMessagesFailed',
  FETCH_INITIAL_MESSAGES = 'npwd:fetchInitialMessages',
  ACTION_RESULT = 'npwd:setMessagesAlert',
  CREATE_MESSAGE_BROADCAST = 'npwd:createMessagesBroadcast',
  SET_MESSAGE_READ = 'npwd:setReadMessages',
  DELETE_CONVERSATION = 'nwpd:deleteConversation',
  GET_MESSAGE_LOCATION = 'npwd:getMessageLocation',
  MESSAGES_SET_WAYPOINT = 'npwd:setWaypoint',
  DELETE_GROUP_MEMBER = 'nwpd:deleteGroupMember',
  DELETE_GROUP_MEMBER_CONVERSATION = 'nwpd:deleteGroupMemberChat',
  DELETE_GROUP_MEMBER_LIST = 'nwpd:deleteGroupMemberList',
  ADD_GROUP_MEMBER = 'nwpd:addGroupMember',
  MAKE_GROUP_OWNER = 'npwd:makeGroupOwner',
  UPDATE_GROUP_OWNER = 'npwd:makeGroupOwnerSuccess',
  UPDATE_PARTICIPANT_LIST = 'npwd:updateParticipantList',
}

export interface Location {
  phoneNumber: string;
  coords: number[];
}
