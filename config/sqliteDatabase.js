import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import DatabaseInterface from './databaseInterface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class SqliteDatabase extends DatabaseInterface {
    constructor() {
        super();
        this.db = null;
    }

    async connect() {
        this.db = await open({
            filename: join(__dirname, './my_database.db'),
            driver: sqlite3.Database
        });

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS Votos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idvotante TEXT,
                candidato_Id INTEGER,
                region TEXT,
                data_inclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    getConnection() {
        return this.db;
    }
}

export default SqliteDatabase;
