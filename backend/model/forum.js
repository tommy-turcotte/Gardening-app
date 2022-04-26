/*
Data retrieval and manipulation for the Threads and Comments tables. 

Author: Liam Turcotte
*/

const data = require('./init.js'); 


function insertThread(fields) {
    // insert a single thread 
    data.db.run(`
        INSERT INTO Threads(ID, creator, title, creation_datetime, last_updated_datetime, description) 
        VALUES(?, ?, ?, ?, ?, ?)`, 
        [fields.id, fields.username, fields.title, fields.creation_dt, fields.last_updated_dt, fields.description],  
        (error) => {
            if (error) {
                console.error('Error inserting a thread into the database (insertThread): ', error); 
                return -1; 
            } 
        }
    ); 
}


function getThread(fields, send) {
    // Retrieve the data for a single thread 
    data.db.get('SELECT * FROM Threads WHERE ID = ? AND creator = ?', [fields.ID, fields.creator], 
        (error, thread) => {
            if (!error) {
                send(thread); 
            } else {
                console.error('Error querying the database (getThread): ', error);
            }
        }
    ); 
}


function getAllThreads(send) {
    // Get all threads in the database 
    data.db.all('SELECT * FROM Threads', (error, threads) => {
        if (!error) {
            send(threads); 
        } else {
            console.error('Error querying the database (getAllThreads): ', error);
        }
    }); 
}


function addComment(fields) {
    // Adds a single comment to an existing thread
    data.db.run(`
        INSERT INTO Comments(ID, writer, thread_id, thread_creator, text, creation_datetime, last_updated_datetime) 
        VALUES(?, ?, ?, ?, ?, ?, ?)`, 
        [fields.id, fields.username, fields.t_id, fields.t_creator, fields.text, fields.c_dt, fields.last_updated_dt],  
        (error) => {
            if (error) {
                console.error('Error inserting a comment into the database (addComment): ', error); 
                return -1; 
            } 
        }
    ); 
}


function threadUpdate(fields) {
    // modify a thread's last_updated_datetime value 
    data.db.run(
        `UPDATE Threads SET last_updated_datetime = ? WHERE ID = ? AND creator = ?`, 
        [fields.last_updated_dt, fields.ID, fields.creator], 
        (error) => {
            if (error) {
                console.error('Error updating a thread in the database (threadUpdate): ', error);  
                return -1; 
            } 
        }
    ); 
}


function updateComment(fields) {
    // update a comment's text value and its last_updated_datetime value 
    data.db.run(`
        UPDATE Comments 
        SET text = ?, last_updated_datetime = ? 
        WHERE ID = ? AND writer = ? AND thread_id = ? AND thread_creator = ?`, 
        [fields.text, fields.last_updated_dt, fields.id, fields.username, fields.t_id, fields.t_creator], 
        (error) => {
            if (error) {
                console.error('Error updating a comment in the database (updateComment): ', error);  
                return -1; 
            } 
        }
    ); 
}


function getComment(fields, send) {
    // Retrieve the data for a single comment
    data.db.get(`
        SELECT * FROM Comments WHERE ID = ? AND writer = ? AND thread_id = ? AND thread_creator = ?`, 
        [fields.id, fields.username, fields.t_id, fields.t_creator], 
        (error, comment) => {
            if (!error) {
                send(comment); 
            } else {
                console.error('Error querying the database (getComment): ', error);
            }
        }
    ); 
}


function getAllThreadComments(fields, send) {
    // Retrieve all comments for a single thread 
    data.db.all(`
        SELECT writer, text, creation_datetime, last_updated_datetime
        FROM Comments
        WHERE thread_id = ? AND thread_creator = ?`, 
        [fields.ID, fields.creator], 
        (error, comments) => {
            if (!error) {
                send(comments); 
            } else {
                console.error('Error querying the database (getAllThreadComments): ', error);
            }
        }
    ); 
}


module.exports.insertThread = insertThread; 
module.exports.getThread = getThread;
module.exports.getAllThreads = getAllThreads; 
module.exports.addComment = addComment; 
module.exports.threadUpdate = threadUpdate; 
module.exports.updateComment = updateComment; 
module.exports.getComment = getComment; 
module.exports.getAllThreadComments = getAllThreadComments; 
