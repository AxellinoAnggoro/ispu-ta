import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL);

export { pool };
