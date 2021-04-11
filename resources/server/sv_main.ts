import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { mainLogger } from './sv_logger';
import { PhoneEvents } from '../../typings/phone';

interface Credentials {
  phone_number: string;
}

async function getCredentials(identifier: string): Promise<string> {
  const query = 'SELECT phone_number FROM users WHERE identifier = ?';
  const [result] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return '###-####';
  return number[0].phone_number;
}

onNet('phone:getCredentials', async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const number = await getCredentials(identifier);
    emitNet(PhoneEvents.SEND_CREDENTIALS, _source, number);
  } catch (e) {
    mainLogger.error(`Failed to get a number, ${e.message}`, {
      source: _source,
    });
  }
});
