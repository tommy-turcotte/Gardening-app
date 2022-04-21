/*
Data retrieval and manipulation for the Watchers table. 

Author: Liam Turcotte
*/

const data = require('./init.js');


function insertWatcher(fields) {
    // Insert a single watcher entry 
    data.db.run(
        `INSERT INTO Watchers(username, longitude, latitude) VALUES(?, ?, ?)`, 
        [fields.username, fields.longitude, fields.latitude],  
        (error) => {
            if (error) {
                console.error('Error inserting a Watcher into the database (insertWatcher): ', error); 
                return -1; 
            } 
        }
    ); 
}


function fetchWatchedLocations(user, send) {
    // retrieve all watched locations for a single user 
    data.db.all(`
        SELECT longitude, latitude, k_lvl, n_lvl, p_lvl, ph, temperature, humidity, rainfall, recommended_crop, name 
        FROM Locations
        NATURAL JOIN Watchers 
        WHERE username = ?`, 
        [user], 
        (error, locations) => {
            if (!error) {
                send(locations); 
            } else {
                console.error('Error querying the database (fetchWatchedLocations): ', error);
            }
        }
    ); 
}


function fetchWatchedAttr(user, attr, send) {
    // fetch aggregate data for a single attr from a user's watchlist 
    data.db.get(`
        SELECT MIN(${attr}) AS min, MAX(${attr}) AS max, AVG(${attr}) AS avg
        FROM Locations
        NATURAL JOIN Watchers 
        WHERE username = ?`, 
        [user], 
        (error, data) => {
            if (!error) {
                send(data);  
            } else {
                console.error('Error querying the database (fetchWatchedAttr): ', error);
            }
        }
    ); 
}


module.exports.insertWatcher = insertWatcher; 
module.exports.fetchWatchedLocations = fetchWatchedLocations; 
module.exports.fetchWatchedAttr = fetchWatchedAttr; 
