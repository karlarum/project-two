// const dotenv = require('dotenv');
// dotenv.config();
// const MongoClient = require('mongodb').MongoClient;

// let _db;

// const initDb = (callback) => {
//     if (_db) {
//         console.log('Db is already initialized!');
//         return callback(null, _db);
//     }

//     MongoClient.connect(process.env.MONGODB_URI)
//         .then((client) => {
//             _db = client;
//             callback(null, _db);
//         })
//         .catch((err) => {
//             callback(err);
//         });
// };

// const getDb = () => {
//     if (!_db) {
//         throw Error('Db not initialized');
//     }
//     return _db;
// };

// module.exports = {
//     initDb,
//     getDb
// };

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

const initDb = callback => {
    if (_db) {
        console.log('Database is already initialized!');
        return callback(null, _db);
    }

    client.connect()
        .then(client => {
            _db = client.db();
            console.log('Database connected!');
            callback(null, _db);
        })
        .catch(err => {
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw Error('Database not initialized');
    }
    return _db;
};

module.exports = { initDb, getDb };
