const express = require("express");
const model = require("./model");
const cors = require("cors");
var session = require('express-session')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static("client"));
app.use(session({
    secret: "This is where the fun begins",
    saveUninitialized: true,
    resave: false
}));

// my middlewares
function authorizeRequest(request, response, next) {
    if ( request.session && session.userId ) {
        next();
    } else {
        response.status(401).send("Unauthorized");
    }
}

/*-------------------
Sessions
-------------------*/
app.post("/sessions", function (request, response) {
    email = request.body.email;
    password = request.body.password;

    model.User.findOne({ email: email }).then((user) => {
        if (user) {
            user.verifyEncryptedPassword(password).then(function(match) {
                if (match) {
                    response.setHeader("Access-Control-Allow-Origin", "*");
                    response.status(201).send("Authenticated");
                    session.userId = user._id;
                    //console.log(session.userId);
                } else {
                    response.status(401).send("Unauthorized");
                }
            });
        } else {
            response.status(401).send("Unauthorized");
        }
    }).catch((error) => {
        console.error("Error", error);
        response.status(401).send("Unauthorized");
    });
});

app.get("/sessions", function (request, response) {
    //console.log(session.userId);
    if ( request.session && session.userId ) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.status(200).send("Authenticated");
    } else {
        response.status(401).send("Not Authenticated");
    }
});

app.delete("/sessions", function (request, response) {
    // This is probably not the best way to do this
    if ( session ) {
        session.userId = null;
    }
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.status(200).send("Logged out");
});


/*-------------------
Users
-------------------*/

app.post("/users", function (request, response) {
    console.log("Creating new user");

    const newUser = new model.User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
    });

    newUser.setEncryptedPassword(request.body.password).then(function() {
        newUser.save().then(() => {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.status(201).send("Created");
        }).catch((error) => {
            // Respond with the error message
            if (error.errors) {
                var errorMessages = [];
                for (var e in error.errors) {
                    errorMessages.push(error.errors[e].message);
                    response.status(422).json(errorMessages);
                }
            } else if (  error.code == 11000 ) {
                response.status(409).send("Email already exists");
            } else {
                console.log(error);
                response.status(500).send("Internal Server Error");
            }
        });
    });
});

// retrieve users collection
// app.get("/users", function (request, response) {
//     model.User.find().then((users) => {
//         response.setHeader("Access-Control-Allow-Origin", "*");
//         response.json(users);
//     });
// });

/*-------------------
Dreams
-------------------*/

app.get("/dreams", authorizeRequest, function (request, response) {
    model.Dream.find( { userID: session.userId } ).then((dreams) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(dreams);
    });
});

app.post("/dreams", authorizeRequest, function (request, response) {
    const newDream = new model.Dream({
        userID: session.userId,
        destination: request.body.destination,
        completed: request.body.completed,
        notes: request.body.notes,
        budget: request.body.budget,
    });

    newDream.save().then(() => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.status(201).send("Created");
    }).catch((error) => {
        // Respond with the error message
        if (error.errors) {
            var errorMessages = [];
            for (var e in error.errors) {
                errorMessages.push(error.errors[e].message);
                response.status(422).json(errorMessages);
            }
        } else {
            response.status(500).send("Internal Server Error");
        }
    });
});

app.delete("/dreams/:dreamId", authorizeRequest, function (request, response) {
    try {
        model.Dream.deleteOne({ _id: request.params.dreamId }).then(() => {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.status(200).send("OK");
        });
    } catch (error) {
        console.error(error);
        response.sendStatus(404);
    }
});

app.put("/dreams/:dreamId", authorizeRequest, function (request, response) {

    // Make sure the dream exists and belongs to the user
    model.Dream.findOne({ _id: request.params.dreamId, userID: session.userId }).then((dream) => {
        if (!dream) {
            response.status(404).send("Not Found");
            return;
        }
    });

    model.Dream.updateOne({ _id: request.params.dreamId }, {
        $set: {
            destination: request.body.destination,
            completed: request.body.completed,
            notes: request.body.notes,
            budget: request.body.budget,
        }
    }).then(() => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.status(200).send("OK");
    }).catch((error) => {
        // Respond with the error message
        if (error.errors) {
            var errorMessages = [];
            for (var e in error.errors) {
                errorMessages.push(error.errors[e].message);
                response.status(422).json(errorMessages);
            }
        } else {
            console.log(error);
            response.status(500).send("Internal Server Error");
        }
    });
});

/*-------------------
Trips
-------------------*/

app.get("/trips", authorizeRequest, function (request, response) {
    model.Trip.find({ userID: session.userId }).then((trips) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(trips);
    });
});

app.post("/trips", authorizeRequest, function (request, response) {
    const newTrip = new model.Trip({
        userID: session.userId,
        name: request.body.name,
        details: request.body.details,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
    });

    newTrip.save().then(() => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.status(201).send("Created");
    }).catch((error) => {
        // Respond with the error message
        if (error.errors) {
            var errorMessages = [];
            for (var e in error.errors) {
                errorMessages.push(error.errors[e].message);
                response.status(422).json(errorMessages);
            }
        } else {
            response.status(500).send("Internal Server Error");
        }
    });
});

app.delete("/trips/:tripId", authorizeRequest, function (request, response) {

    try {
        model.Trip.deleteOne({ _id: request.params.tripId }).then(() => {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.status(200).send("OK");
        });
    } catch (error) {
        console.error(error);
        response.sendStatus(404);
    }
});

app.listen(8080, function () {
    console.log("Server is running...");
});
