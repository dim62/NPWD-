import { config } from '../server';
import { pool } from '../db';

export class PlayerRepo {
  async fetchIdentifierFromPhoneNumber(phoneNumber: string): Promise<string | null> {
    const query = `SELECT ${config.database.identifierColumn} FROM ${config.database.playerTable} WHERE phone_number = ?`;
    const [results] = await pool.query(query, [phoneNumber]);
    // Get identifier from results
    return (results as any[])[0][config.database.identifierColumn] || null;
  }
}

export default new PlayerRepo();
