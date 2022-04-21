/*
Initializes, fills, clears, or empties the database instance used by other model files. 

Author: Liam Turcotte 
*/

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs'); 
const crypto = require('crypto');

// necessary to have access to Users, Auth, and Locations insertion functions for fill 
const users = require('./users.js'); 
const auth = require('./auth.js'); 
const locations = require('./locations.js'); 
const watchers = require('./watchlist.js'); 

// Connect to the database 
const db = new sqlite3.Database('./data/database.db', (error) => {
    if (!error) {
        console.log('Connected to the database.'); 
    } else {
        console.error('Error connecting to the database: ', error); 
    }
});


function initializeDB() {
    // Create all tables in the database 
    // Run instructions sequentially to ensure there are no problems 
    db.serialize(() => {
        db.run(`
            CREATE TABLE Users
            (
            username character varying(15) NOT NULL,
            email character varying(255) NOT NULL,
            name character varying(100) NOT NULL,
            CONSTRAINT PK_Users PRIMARY KEY (username),
            CONSTRAINT email UNIQUE (email)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Users table: ', error); 
            }
        }).run(`
            CREATE TABLE Auth
            (
            username character varying(15) NOT NULL,
            hashed_pw character varying(200) NOT NULL,
            salt character(128) NOT NULL,
            iterations int NOT NULL,
            hash_length int NOT NULL,
            algorithm character varying(20) NOT NULL,
            CONSTRAINT PK_Auth PRIMARY KEY (username),
            CONSTRAINT hashed_pw UNIQUE (hashed_pw),
            CONSTRAINT salt UNIQUE (salt),
            CONSTRAINT authenticates
                FOREIGN KEY (username)
                REFERENCES Users (username)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Auth table: ', error); 
            }
        }).run(`
            CREATE TABLE Locations
            (
            longitude double precision NOT NULL,
            latitude double precision NOT NULL,
            k_lvl int NOT NULL,
            n_lvl int NOT NULL,
            p_lvl int NOT NULL,
            ph double precision NOT NULL,
            temperature double precision NOT NULL,
            humidity double precision NOT NULL,
            rainfall double precision NOT NULL,
            recommended_crop character varying(30) NOT NULL,
            name character varying(100),
            CONSTRAINT PK_Locations PRIMARY KEY (longitude,latitude)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Locations table: ', error); 
            }
        }).run(`
            CREATE TABLE Crops
            (
            name character varying(30) NOT NULL,
            threshold_1 double precision NOT NULL,
            threshold_2 double precision NOT NULL,
            threshold_3 double precision NOT NULL,
            threshold_4 double precision NOT NULL,
            CONSTRAINT PK_Crops PRIMARY KEY (name)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Crops table: ', error); 
            }
        }).run(`
            CREATE TABLE Watchers
            (
                username character varying(15) NOT NULL,
                longitude double precision NOT NULL,
                latitude double precision NOT NULL,
                CONSTRAINT PK_Watchers PRIMARY KEY (username,longitude,latitude),
                CONSTRAINT tracks
                FOREIGN KEY (username)
                REFERENCES Users (username),
                CONSTRAINT tracked
                FOREIGN KEY (longitude, latitude)
                REFERENCES Locations (longitude, latitude)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Watchers table: ', error); 
            }
        }).run(`
            CREATE TABLE Locations_Crops
            (
                crop character varying(30) NOT NULL,
                longitude double precision NOT NULL,
                latitude double precision NOT NULL,
                yield double precision NOT NULL,
                label int NOT NULL,
                CONSTRAINT PK_Locations_Crops PRIMARY KEY (crop,longitude,latitude),
                CONSTRAINT growing
                FOREIGN KEY (longitude, latitude)
                REFERENCES Locations (longitude, latitude),
                CONSTRAINT grown
                FOREIGN KEY (crop)
                REFERENCES Crops (name)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Locations_Crops table: ', error); 
            }
        }).run(`
            CREATE TABLE Threads
            (
            ID character(36) NOT NULL,
            creator character varying(15) NOT NULL,
            title character varying(150) NOT NULL,
            creation_datetime datetime NOT NULL,
            last_updated_datetime datetime NOT NULL,
            description character varying(1000),
            CONSTRAINT PK_Threads PRIMARY KEY (ID,creator),
            CONSTRAINT creates
                FOREIGN KEY (creator)
                REFERENCES Users (username)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Threads table: ', error); 
            }
        }).run(`
            CREATE TABLE Comments
            (
            ID character(36) NOT NULL,
            writer character varying(15) NOT NULL,
            thread_id character(36) NOT NULL,
            thread_creator character varying(15) NOT NULL,
            text character varying(2000) NOT NULL,
            creation_datetime datetime NOT NULL,
            last_updated_datetime datetime NOT NULL,
            CONSTRAINT PK_Comments PRIMARY KEY (ID,writer,thread_id,thread_creator),
            CONSTRAINT writes
                FOREIGN KEY (writer)
                REFERENCES Users (username),
            CONSTRAINT contains
                FOREIGN KEY (thread_id, thread_creator)
                REFERENCES Threads (ID, creator)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Comments table: ', error); 
            }
        }).run(`
            CREATE TABLE Notifications
            (
            ID character(36) NOT NULL,
            username character varying(15) NOT NULL,
            longitude double precision NOT NULL,
            latitude double precision NOT NULL,
            text character varying(500) NOT NULL,
            date_time datetime NOT NULL,
            new boolean NOT NULL,
            CONSTRAINT PK_Notifications PRIMARY KEY (ID,username,longitude,latitude),
            CONSTRAINT generate
                FOREIGN KEY (username, longitude, latitude)
                REFERENCES Watchers (username, longitude, latitude)
            )
        `, (error) => {
            if (error) {
                console.error('Issue creating the Notifications table: ', error); 
            }
        }); 
    }); 
}


function deletionScript(operation, errorType) {
    // Run a deletion script to either clear or empty the database 
    db.serialize(() => {
        db.run(`${operation} Notifications`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Notifications table: `, error); 
            }
        }).run(`${operation} Comments`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Comments table: `, error); 
            }
        }).run(`${operation} Threads`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Threads table: `, error); 
            }
        }).run(`${operation} Locations_Crops`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Locations_Crops table: `, error); 
            }
        }).run(`${operation} Watchers`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Watchers table: `, error); 
            }
        }).run(`${operation} Crops`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Crops table: `, error); 
            }
        }).run(`${operation} Locations`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Locations table: `, error); 
            }
        }).run(`${operation} Auth`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Auth table: `, error); 
            }
        }).run(`${operation} Users`, (error) => {
            if (error) {
                console.error(`Issue ${errorType} the Users table: `, error); 
            }
        }); 
    }); 
}


function emptyDB() {
    // Drop all tables (and corresponding data) from the database 
    deletionScript("DROP TABLE", "dropping"); 
}


function clearDB() {
    // Delete all data from the database (but keep the tables)
    deletionScript("DELETE FROM", "deleting data from"); 
}


function getRandomCoordinate(range) {
    // Generates a random floating point value in (-range, range) 
    return (Math.random() * range) * (Math.round(Math.random()) ? 1 : -1); 
}


function fillDB() {
    // fills the database with two users (including auth info) and locations in location_recs.json 
    // add users 
    let username1 = 'user1'; 
    let username2 = 'user2'; 
    users.insertUser(username1, 'user1@gmail.com', 'User 1');
    users.insertUser(username2, 'user2@gmail.com', 'User 2');

    // add auth info 
    let iterations = 20;
    let hashLength = 64; 
    let algo = 'sha512'; 
    let salt1 = crypto.randomBytes(128).toString('base64');
    let salt2 = crypto.randomBytes(128).toString('base64');
    let pw1 = 'user1pw';
    let pw2 = 'user2pw'; 

    // generate hashed passwords, insert into auth table 
    crypto.pbkdf2(pw1, salt1, iterations, hashLength, algo, (error, hashedPw) => {
        if (error) {
            console.error('Issue hashing user 1 password: ', error); 
        } else {
            auth.insertSingleAuth(username1, hashedPw.toString('hex'), salt1, iterations, hashLength, algo); 
        }
    }); 

    crypto.pbkdf2(pw2, salt2, iterations, hashLength, algo, (error, hashedPw) => {
        if (error) {
            console.error('Issue hashing user 2 password: ', error); 
        } else {
            auth.insertSingleAuth(username2, hashedPw.toString('hex'), salt2, iterations, hashLength, algo); 
        }
    }); 

    // add locations from JSON file 
    let locations_ = JSON.parse(fs.readFileSync('./data/location_recs.json', 'utf8'));
    for (i = 0; i < 2200; i++) {
        locations_[i]['longitude'] = getRandomCoordinate(180);
        locations_[i]['latitude'] = getRandomCoordinate(90);
    }
    locations.insertLocations(locations_); 

    // add two new locations to user1's watchlist 
    let location1 = {
        "longitude": 21.11111,
        "latitude": -12.34324,
        "k_lvl": 33,
        "n_lvl": 89,
        "p_lvl": 24,
        "ph": 6.9,
        "temperature": 25.2,
        "humidity": 62.4,
        "rainfall": 170.4,
        "recommended_crop": "coffee",
        "name": null
    };
    locations.insertLocation(location1); 
    watchers.insertWatcher({'username': username1, 'longitude': location1.longitude, 'latitude': location1.latitude});

    let location2 = {
        "longitude": 43.3443,
        "latitude": -76.553232,
        "k_lvl": 45,
        "n_lvl": 73,
        "p_lvl": 32,
        "ph": 7.3,
        "temperature": 43,
        "humidity": 68.9,
        "rainfall": 140.2,
        "recommended_crop": "coffee",
        "name": null
    };
    locations.insertLocation(location2);
    watchers.insertWatcher({'username': username1, 'longitude': location2.longitude, 'latitude': location2.latitude});
}


// make the db variable and db modification functions exportable so it can be used in other modules 
module.exports.db = db; 
module.exports.initializeDB = initializeDB; 
module.exports.fillDB = fillDB; 
module.exports.clearDB = clearDB; 
module.exports.emptyDB = emptyDB; 
