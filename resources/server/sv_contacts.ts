import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { mainLogger } from './sv_logger';
import { ContactEvents } from '../../typings/contact';

const contactsLogger = mainLogger.child({ module: 'contact' });

interface Contacts {
  id?: number;
  display: string;
  number: string;
  avatar: string;
}

interface ContactId {
  id: number;
}

async function fetchAllContacts(identifier: string): Promise<Contacts[]> {
  const query = 'SELECT * FROM npwd_phone_contacts WHERE identifier = ? ORDER BY display ASC';
  const [results] = await pool.query(query, [identifier]);
  const contacts = <Contacts[]>results;
  return contacts;
}

async function addContact(
  identifier: string,
  number: string,
  display: string,
  avatar: string,
): Promise<any> {
  const query =
    'INSERT INTO npwd_phone_contacts (identifier, number, display, avatar) VALUES (?, ?, ?, ?)';

  const [result] = await pool.query(query, [identifier, number, display, avatar]);
}

async function updateContact(contact: Contacts, identifier: string): Promise<any> {
  const query =
    'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND identifier = ?';
  await pool.query(query, [
    contact.number,
    contact.display,
    contact.avatar,
    contact.id,
    identifier,
  ]);
}

async function deleteContact(contact: ContactId, identifier: string): Promise<any> {
  const query = 'DELETE FROM npwd_phone_contacts WHERE id = ? AND identifier = ?';
  await pool.query(query, [contact.id, identifier]);
}

onNet(ContactEvents.GET_CONTACTS, async () => {
  const _source = getSource();
  try {
    const _identifier = getIdentifier(_source);

    const contacts = await fetchAllContacts(_identifier);
    emitNet(ContactEvents.SEND_CONTACTS, _source, contacts);
  } catch (e) {
    contactsLogger.error(`Failed to fetch contacts, ${e.message}`);
  }
});

onNet(ContactEvents.ADD_CONTACT, async (number: string, display: string, avatar: string) => {
  const _source = getSource();
  try {
    const _identifier = getIdentifier(_source);
    await addContact(_identifier, number, display, avatar);
    emitNet(ContactEvents.ADD_CONTACT_SUCCESS, _source);
    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_ADD_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_ADD_FAILED',
      type: 'error',
    });
    contactsLogger.error(`Failed to add contact, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(ContactEvents.UPDATE_CONTACT, async (contact: Contacts) => {
  const _source = getSource();
  try {
    const _identifier = getIdentifier(_source);
    await updateContact(contact, _identifier);

    emitNet(ContactEvents.UPDATE_CONTACT_SUCCESS, _source);

    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_UPDATE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    const _source = (global as any).source;
    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_UPDATE_FAILED',
      type: 'error',
    });
    contactsLogger.error(`Failed to update contact, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(ContactEvents.DELETE_CONTACT, async (contact: ContactId) => {
  const _source = getSource();
  try {
    const _identifier = getIdentifier(_source);
    await deleteContact(contact, _identifier);
    emitNet(ContactEvents.DELETE_CONTACT_SUCCESS, _source);
    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_DELETE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    contactsLogger.error(`Failed to delete contact, ${e.message}`, {
      source: _source,
    });
    emitNet(ContactEvents.ACTION_RESULT, _source, {
      message: 'CONTACT_DELETE_FAILED',
      type: 'error',
    });
  }
});
