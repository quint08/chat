const pg = require('pg');
const process_db = require('dotenv').config();
const db_url = process.env.DATABASE_URL || process_db.parsed.DB_URL;
const client = new pg.Client({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
});
client.connect();

const getChats = new Promise((resolve, reject) => {
    client.query('SELECT * FROM chats')
    .then(result => {
        resolve(result.rows);
    })
    .catch(e => console.error(e.stack))
});

const insertChats = (request) => {
    const data = request;

    client.query('INSERT INTO chats (user_name, room, chat_text, data_time) VALUES ($1, $2, $3, NOW())',
    [data.name, data.room, data.text], (error, results) =>{
        if (error) {
            throw error
        }
        console.log(`Chat added to room: ${data.room}`);
    })
};

module.exports = {
    getChats,
    insertChats
};

// CREATE TABLE chats (
//     user_id SERIAL PRIMARY KEY,
//     user_name VARCHAR(255),
//     room VARCHAR(255),
//     chat_text TEXT,
//     data_time TIMESTAMP
// );