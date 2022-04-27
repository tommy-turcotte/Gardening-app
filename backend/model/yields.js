/*
Data retrieval and manipulation for the Locations_Crops table (in other words, yield data). 

Author: Liam Turcotte
*/

const data = require('./init.js');


function calculateYieldLabel(thresholds, yield) {
    // Returns the yield label based on yield value 
    // labels values: (1, 2, 3, 4, 5) = (minimal, low, average, high, excellent)
    switch (true) {
        case (yield < thresholds.threshold_1):
            return 1; 
        case (yield >= thresholds.threshold_1 && yield < thresholds.threshold_2):
            return 2; 
        case (yield >= thresholds.threshold_2 && yield < thresholds.threshold_3):
            return 3; 
        case (yield >= thresholds.threshold_3 && yield < thresholds.threshold_4):
            return 4;
        case (yield >= thresholds.threshold_4):
            return 5; 
        default:
            return -1; 
    }
}


function fetchYield(fields, send) {
    // returns a location's yield for a particular crop 
    data.db.get(`
        SELECT yield, label 
        FROM Locations_Crops 
        WHERE longitude = ? AND latitude = ? AND crop = ?`, 
        [fields.longitude, fields.latitude, fields.crop], 
        (error, yield) => {
            if (!error) {
                send(yield); 
            } else {
                console.error('Error querying the database (fetchYield): ', error);
            }
        }
    ); 
}


function fetchYields(fields, send) {
    // returns all crop/yield combinations for a particular location 
    data.db.all(`
        SELECT crop, yield, label 
        FROM Locations_Crops 
        WHERE longitude = ? AND latitude = ?`, 
        [fields.longitude, fields.latitude], 
        (error, yields) => {
            if (!error) {
                send(yields); 
            } else {
                console.error('Error querying the database (fetchYields): ', error);
            }
        }
    ); 
}


function setYield(fields, value) {
    // set a yield value for a particular location/crop combination
    data.db.run(`
        UPDATE Locations_Crops 
        SET yield = ? 
        WHERE longitude = ? AND latitude = ? AND crop = ?`, 
        [value, fields.longitude, fields.latitude, fields.crop], 
        (error) => {
            if (error) {
                console.error('Error updating a yield info in the database (setYield): ', error);  
            } 
        }
    ); 
}


function insertYield(fields) {
    // Insert a yield entry for a location 
    data.db.run(
        `INSERT INTO Locations_Crops (crop, longitude, latitude, yield, label) VALUES(?, ?, ?, ?, ?)`, 
        [fields.crop, fields.longitude, fields.latitude, fields.yield, fields.label],  
        (error) => {
            if (error) {
                console.error('Error inserting yield info into the database (insertYield): ', error); 
                return -1; 
            } 
        }
    ); 
}


module.exports.calculateYieldLabel = calculateYieldLabel; 
module.exports.fetchYield = fetchYield;
module.exports.fetchYields = fetchYields; 
module.exports.setYield = setYield; 
module.exports.insertYield = insertYield; 
