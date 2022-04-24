/*
This is the driver file for the server-side portion of our tech stack (backend + database). 
In particular, it contains the routing to all backend endpoints, which call business layer and data access functions. 
As a data-centric application, many crucial system functions are supported by code defined in these server-side layers. 

Server-side contributors: Liam Turcotte, Samuel Bazinet 
*/

// initialize app 
const express = require('express'); 
const app = express(); 
app.use(express.urlencoded({ extended: false })); 

// import business layer files 
const authBiz = require('./biz/auth.js'); 
const initBiz = require('./biz/init.js'); 
const userBiz = require('./biz/users.js'); 
const locationBiz = require('./biz/locations.js'); 
const watchlistBiz = require('./biz/watchlist.js'); 

// track state of db to reject certain operations 
// CHANGE THESE VALUES IF SERVER IS STARTED WITH AN EMPTY OR CLEARED DATABASE
var dbInitialized = true;
var dbFilled = true;  

// track auth info 
var isLoggedIn = false; 
var userLoggedIn = null; 
var hashArgs = {
    'iterations': 20,
    'hash_length': 64,
    'algorithm': 'sha512',
    'salt': null
}; 
var saltLength = 128; 

// ML models 
var cropRecClassifier = null; 


// TODO: May need to implement access control mechanisms 
// TODO: strongly consider splitting up endpoints into different files 


// _________________________________________________ Initialization ___________________________________________________
app.get('/initializeDB', function(request, response) {
    // Construct all the tables in the database. 
    initBiz.initializeDatabase(dbInitialized, function(statusCode, respBody) {
        if (statusCode == 200) {
            dbInitialized = true; 
        }

        response.status(statusCode).send(respBody); 
    }); 
}); 


app.get('/fillDB', function(request, response) {
    // Fill all the tables in the database with user, auth, location, and watch list data. 
    initBiz.fillDatabase(dbInitialized, dbFilled, function(statusCode, respBody) {
        if (statusCode == 200) {
            dbFilled = true; 
        }

        response.status(statusCode).send(respBody); 
    }); 
}); 


app.get('/clearDB', function(request, response) {
    // Delete all records from the database but keep all of the tables.
    initBiz.clearDatabase(isLoggedIn, dbInitialized, function(statusCode, respBody) {
        if (statusCode == 200) {
            dbFilled = false; 
            isLoggedIn = false; 
            userLoggedIn = null; 
        }

        response.status(statusCode).send(respBody); 
    });
});


app.get('/emptyDB', function(request, response) {
    // Delete all the tables and corresponding data from the database. 
    initBiz.emptyDatabase(isLoggedIn, dbInitialized, function(statusCode, respBody) {
        if (statusCode == 200) {
            dbInitialized = false; 
            dbFilled = false; 
            isLoggedIn = false; 
            userLoggedIn = null; 
        }

        response.status(statusCode).send(respBody); 
    }); 
}); 


// _________________________________________________ Authentication ___________________________________________________
app.get('/authenticatedUser', function(request, response) {
    // Fetch data of the currently authenticated user. 
    authBiz.sendAuthenticatedUser(isLoggedIn, userLoggedIn, function(statusCode, respBody) {
        response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
    }); 
}); 


app.get('/authInfo', function(request, response) {
    // Fetch auth info (salt, iterations, hash length, algorithm) for a user 
    authBiz.sendAuthInfo(request.query.username, function(statusCode, respBody) {
        response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
    }); 
}); 


/*app.post('/login', function(request, response) {
    // Attempt to login using auth info passed in from the request.  
    authBiz.login(isLoggedIn, userLoggedIn, request.body.username, request.body.hashedPw, 
        function(statusCode, respBody, authUsername) {
            if (authUsername != null) {
                isLoggedIn = true; 
                userLoggedIn = authUsername; 
            }

            response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
        }   
    ); 
});*/


app.get('/login', function(request, response) {
    // Attempt to login using auth info passed in from the request.  
    authBiz.login(isLoggedIn, userLoggedIn, request.query.username, request.query.hashedPw, 
        function(statusCode, respBody, authUsername) {
            if (authUsername != null) {
                isLoggedIn = true; 
                userLoggedIn = authUsername; 
            }

            response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
        }   
    ); 
}); 


app.get('/hashArgs', function(request, response) {
    // Sends password hashing arguments currently in use. 
    authBiz.sendAuthArgs(hashArgs, saltLength, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
        hashArgs.salt = null; 
    }); 
}); 


/*app.post('/register', function(request, response) {
    // Creates a new user. Enters new info in Users and Auth tables. Logs in as this user.  
    authBiz.register(request.body, function(statusCode, respBody, authUsername) {
        if (authUsername != null) {
            isLoggedIn = true; 
            userLoggedIn = authUsername; 
        }

        response.status(statusCode).send(respBody); 
    }); 
}); */


app.get('/register', function(request, response) {
    // Creates a new user. Enters new info in Users and Auth tables. Logs in as this user.  
    authBiz.register(request.query, function(statusCode, respBody, authUsername) {
        if (authUsername != null) {
            isLoggedIn = true; 
            userLoggedIn = authUsername; 
        }

        response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
    }); 
}); 


/*app.post('/logout', function(request, response) {
    // Logs out the currently authenticated user. 
    authBiz.logout(isLoggedIn, function(statusCode, respBody) {
        isLoggedIn = false; 
        userLoggedIn = null;

        response.status(statusCode).send(respBody); 
    }); 
}); */


app.get('/logout', function(request, response) {
    // Logs out the currently authenticated user. 
    authBiz.logout(isLoggedIn, function(statusCode, respBody) {
        isLoggedIn = false; 
        userLoggedIn = null;

        response.header("Access-Control-Allow-Origin", "*").status(statusCode).send(respBody); 
    }); 
});


// _________________________________________________ Users ___________________________________________________
app.get('/users', function(request, response) {
    // Fetch all users in the database. 
    userBiz.getAllUsers(isLoggedIn, dbFilled, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
}); 


// _________________________________________________ Locations ___________________________________________________
app.get('/locations', function(request, response) {
    // Fetch all locations in the database. 
    locationBiz.getAllLocations(isLoggedIn, dbFilled, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
});


app.get('/buildRecModel', function(request, response) {
    // Build crop recommendation model using all locations currently in the database. 
    locationBiz.buildCropRecModel(dbFilled, function(statusCode, respBody, classifier_) {
        if (classifier_ != null) {
            cropRecClassifier = classifier_; 
        }

        response.status(statusCode).send(respBody); 
    }); 
}); 


app.get('/cropRecommendation', function(request, response) {
    // Computes the recommended crop for a particular location already in the database. 
    // Performs no data modifications. 
    locationBiz.calculateRecommendedCrop(dbFilled, cropRecClassifier, request.query.longitude, request.query.latitude, 
        function(statusCode, respBody) {
            response.status(statusCode).send(respBody); 
        }
    ); 
}); 


app.get('/locationField', function(request, response) {
    // Returns the value for a certain attribute (field) for a particular location. 
    locationBiz.getField(dbFilled, request.query.longitude, request.query.latitude, request.query.field, 
        function(statusCode, respBody) {
            response.status(statusCode).send(respBody);
        }
    ); 
}); 


// _________________________________________________ Watchlist ___________________________________________________
app.post('/location', function(request, response) {
    // Add a new location to the database. 
    // This is a watchlist endpoint since users add new locations from the watchlist page client-side. 
    // Users have the choice to add this new location to their watchlist or not. 
    watchlistBiz.addLocation(isLoggedIn, userLoggedIn, cropRecClassifier, request.body, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
}); 


app.post('/watchlist', function(request, response) {
    // Add an existing location to a user's watchlist. 
    watchlistBiz.addWatcher(isLoggedIn, userLoggedIn, dbFilled, request.body, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
}); 


app.get('/watchlist', function(request, response) {
    // Retrieve all watched locations for a particular user. 
    watchlistBiz.fetchWatchedLocations(isLoggedIn, userLoggedIn, dbFilled, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
}); 


app.get('/watchlistColStats', function(request, response) {
    // Calculate aggregate data for a certain location attribute in a user's watchlist.  
    watchlistBiz.fetchAttrData(isLoggedIn, userLoggedIn, dbFilled, request.query.attr, function(statusCode, respBody) {
        response.status(statusCode).send(respBody); 
    }); 
}); 


// set up the server to listen on port 4321 
app.set('port', process.env.PORT || 4321);
app.listen(app.get('port'), function() {
    console.log('Server initialization is successful.');
    console.log(`Server is currently listening on port ${app.get('port')}`); 
}); 
