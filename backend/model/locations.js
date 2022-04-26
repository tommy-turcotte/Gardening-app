/*
Data retrieval and manipulation for the Locations table. 

Authors: Liam Turcotte, Samuel Bazinet
*/

const data = require('./init.js'); 


function insertLocations(locations) {
    // Insert all locations within the locations array 
    for (const location of locations) {
        data.db.run(
            `INSERT INTO Locations(longitude, latitude, k_lvl, n_lvl, p_lvl, ph, temperature, humidity, rainfall, 
                recommended_crop, name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [location.longitude, location.latitude, location.K, location.N, location.P, location.ph, 
                location.temperature, location.humidity, location.rainfall, location.label, null], 
            (error) => {
                if (error) {
                    console.error('Error inserting a Location into the database (insertLocations): ', error);  
                    return -1; 
                } 
            }
        ); 
    }
}


function insertLocation(location) {
    // Insert a single location 
    data.db.run(
        `INSERT INTO Locations(longitude, latitude, k_lvl, n_lvl, p_lvl, ph, temperature, humidity, rainfall, 
            recommended_crop, name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [location.longitude, location.latitude, location.k_lvl, location.n_lvl, location.p_lvl, location.ph, 
            location.temperature, location.humidity, location.rainfall, location.recommended_crop, location.name],  
        (error) => {
            if (error) {
                console.error('Error inserting a Location into the database (insertLocation): ', error); 
                return -1; 
            } 
        }
    ); 
}


function getAllLocations(send) {
    // Get all locations in the database 
    data.db.all('SELECT * FROM Locations', (error, locations) => {
        if (!error) {
            send(locations); 
        } else {
            console.error('Error querying the database (getAllLocations): ', error);
        }
    }); 
}


function getLocation(longitude, latitude, send) {
    // Retrieve the data for a single location
    data.db.get('SELECT * FROM Locations WHERE longitude = ? AND latitude = ?', [longitude, latitude], 
        (error, location) => {
            if (!error) {
                send(location); 
            } else {
                console.error('Error querying the database (getLocation): ', error);
            }
        }
    ); 
}


function getSearchLocations(query, send) {
    // Retreive the locations matching the search query
    data.db.all("SELECT * FROM Locations WHERE " + query,
        (error, locations) => {
            if (!error) {
                send(locations);
            } else {
                console.error("Error querying the database (getSearchLocations: ", error);
            }
        }
    );
}


function getField(longitude, latitude, field, send) {
    // retrieve the value for a certain attribute (field) for a particular location
    data.db.get(`SELECT ${field} FROM Locations WHERE longitude = ? AND latitude = ?`, [longitude, latitude], 
        (error, val) => {
            if (!error) {
                send(val); 
            } else {
                console.error('Error querying the database (getField): ', error);
            }
        }
    ); 
}


function setField(longitude, latitude, field, value) {
    // TODO: write endpoint and biz function for this 
    // set a certain attribute (field) to value for a particular location 
    data.db.run(
        `UPDATE Locations SET ${field} = ? WHERE longitude = ? AND latitude = ?`, [value, longitude, latitude], 
        (error) => {
            if (error) {
                console.error('Error updating a Location in the database (setField): ', error);  
            } 
        }
    ); 
}


module.exports.insertLocations = insertLocations; 
module.exports.insertLocation = insertLocation; 
module.exports.getAllLocations = getAllLocations; 
module.exports.getLocation = getLocation; 
module.exports.getSearchLocations = getSearchLocations;
module.exports.getField = getField; 
module.exports.setField = setField; 
