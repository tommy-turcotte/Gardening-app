/*
Business layer logic for forum-related endpoints. 

Author: Liam Turcotte
*/

const crypto = require('crypto');

const dbForum = require('../model/forum.js');


function insertThread(isLoggedIn, userLoggedIn, dbFilled, fields, sendResponse) {
    // Inserts a new thread into the db 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No user data."); 
    } else if (fields.title == null) {
        sendResponse(401, "Thread title not passed."); 
    } else {
        // build thread information by taking in query params and generating a unique ID 
        // also set creation and last updated datetime to be current day and time/insertion datetime 
        let currentDateTime = (new Date()).toISOString(); 
        let threadInfo = {
            'id': crypto.randomUUID(),
            'username': userLoggedIn,
            'title': fields.title, 
            'creation_dt': currentDateTime,
            'last_updated_dt': currentDateTime,
            'description': fields.description
        }; 

        if (dbForum.insertThread(threadInfo) == -1) {
            sendResponse(500, "Issue adding thread to db.");
        } else {
            sendResponse(201, "Operation successful.");
        }
    }
}


function getThread(dbFilled, fields, sendResponse) {
    // Retrieve the data for a single thread 
    if (!dbFilled) {
        sendResponse(403, "No thread data."); 
    } else if (fields.ID == null || fields.creator == null) {
        sendResponse(401, "Thread ID and/or creator not passed.");
    } else {
        dbForum.getThread(fields, function(thread) {
            if (thread == null) {
                sendResponse(403, "Thread does not exist."); 
            } else {
                sendResponse(200, thread); 
            }
        }); 
    }
}


function getAllThreads(dbFilled, sendResponse) {
    // Retrieve all threads in the database 
    if (!dbFilled) {
        sendResponse(403, "No thread data."); 
    } else {
        dbForum.getAllThreads(function(threads) {
            if (threads.length == 0) {
                sendResponse(403, "No thread data."); 
            } else {
                sendResponse(200, threads); 
            }
        }); 
    }   
}


function addComment(isLoggedIn, userLoggedIn, dbFilled, fields, sendResponse) {
    // Adds a single comment to an existing thread
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No thread data."); 
    } else if (fields.ID == null || fields.creator == null) {
        sendResponse(401, "Thread ID and/or creator not passed."); 
    } else if (fields.text == null) {
        sendResponse(401, "No comment content passed."); 
    } else {
        // first verify that the thread exists 
        dbForum.getThread(fields, function(thread) {
            if (thread == null) {
                sendResponse(403, "thread does not exist."); 
                return; 
            } 

            // add comment to the database 
            let currentDateTime = (new Date()).toISOString(); 
            let commentFields = {
                'id': crypto.randomUUID(),
                'username': userLoggedIn,
                't_id': fields.ID, 
                't_creator': fields.creator, 
                'text': fields.text, 
                'c_dt': currentDateTime,
                'last_updated_dt': currentDateTime
            }; 

            if (dbForum.addComment(commentFields) == -1) {
                sendResponse(500, "Issue adding comment to db.");
            } else {
                // update thread's last updated datetime 
                let threadFields = {
                    'ID': fields.ID, 
                    'creator': fields.creator, 
                    'last_updated_dt': currentDateTime
                };

                if (dbForum.threadUpdate(threadFields) == -1) {
                    sendResponse(500, "Issue updating thread in db.");
                } else {
                    sendResponse(201, "Operation successful.");
                }
            }
        }); 
    }
}


function updateComment(isLoggedIn, userLoggedIn, dbFilled, fields, sendResponse) {
    // Updates the text of an existing comment 
    if (!isLoggedIn) {
        sendResponse(401, "Not authenticated; cannot perform operation."); 
    } else if (!dbFilled) {
        sendResponse(403, "No thread data."); 
    } else if (fields.ID == null || fields.creator == null) {
        sendResponse(401, "Thread ID and/or creator not passed."); 
    } else if (fields.text == null || fields.comment_id == null) {
        sendResponse(401, "No comment text and/or ID passed."); 
    } else {
        // first verify that the thread exists 
        dbForum.getThread(fields, function(thread) {
            if (thread == null) {
                sendResponse(403, "thread does not exist."); 
                return; 
            } 

            // verify that the comment exists 
            let commentFields = {
                'id': fields.comment_id,
                'username': userLoggedIn,
                't_id': fields.ID, 
                't_creator': fields.creator, 
            }; 

            dbForum.getComment(commentFields, function(comment) {
                // update comment 
                let currentDateTime = (new Date()).toISOString();
                commentFields['text'] = fields.text; 
                commentFields['last_updated_dt'] = currentDateTime; 

                if (dbForum.updateComment(commentFields) == -1) {
                    sendResponse(500, "Issue updating comment in db.");
                } else {
                    // update thread's last updated datetime 
                    let threadFields = {
                        'ID': fields.ID, 
                        'creator': fields.creator, 
                        'last_updated_dt': currentDateTime
                    };

                    if (dbForum.threadUpdate(threadFields) == -1) {
                        sendResponse(500, "Issue updating thread in db.");
                    } else {
                        sendResponse(201, "Operation successful.");
                    }
                }
            }); 
        }); 
    }
}


function getAllThreadComments(dbFilled, fields, sendResponse) {
    // Retrieve all comments for a single thread 
    if (!dbFilled) {
        sendResponse(403, "No thread data."); 
    } else if (fields.ID == null || fields.creator == null) {
        sendResponse(401, "Thread ID and/or creator not passed.");
    } else {
        // first verify that the thread exists 
        dbForum.getThread(fields, function(thread) {
            if (thread == null) {
                sendResponse(403, "thread does not exist."); 
                return; 
            } 

            // get all comments for that thread 
            dbForum.getAllThreadComments(fields, function(comments) {
                if (comments.length == 0) {
                    sendResponse(403, "No comment data.");
                } else {
                    sendResponse(200, comments); 
                }
            }); 
        });   
    }
}


module.exports.insertThread = insertThread; 
module.exports.getThread = getThread;
module.exports.getAllThreads = getAllThreads; 
module.exports.addComment = addComment; 
module.exports.updateComment = updateComment; 
module.exports.getAllThreadComments = getAllThreadComments; 
