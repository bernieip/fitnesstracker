// Required dependencies
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const Workout = require("./models/workout");

// use MongoDB
let mongoose = require("mongoose");
let db = require ("./models");

// Connect to MongoDB Atlas
// "mongodb+srv://admin-bernie:Q123456t@cluster0-8tphl.mongodb.net/workout"
mongoose.connect("mongodb://localhost:27017/workout",
    {useNewUrlParser: true, useUnifiedTopology: true});

// Create port for heroku and localhost
const PORT = process.env.PORT || 3000;

const app = express();

// use morgan to track middleware, and public folder for static content
app.use(morgan("tiny"));
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup for Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Setup for Exercise Route
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

// Setup for Stats Route
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});


app.get("/api/workouts", async (req, res) => {
    Workout.find({})
        .then(dbWorkout => {
        res.json(dbWorkout);
    })
        .catch(err => {
            res.json(err);
        })
});

app.post("/api/workouts", async (req, res) => {
    const workout = new Workout({ exercises: req.body });
    Workout.create(workout)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err)
        })
});

app.put("/api/workouts/:id", async (req,res) => {
    const id = req.params.id;
    const data = req.body;

    Workout.findById(id)
        .then(dbWorkout => {
            dbWorkout.exercises.push(data);
            return dbWorkout;
        })
        .then(dbWorkout => {
            Workout.findOneAndUpdate(
                { _id: id },
                { exercises: dbWorkout.exercises },
                { new: true }
            )
                .then(dbWorkout => {
                    res.json(dbWorkout);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            res.json(err);
        })
});

app.get("/api/workouts/range", async (req, res) => {
    Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
});

app.listen(PORT, function() {
    console.log("App is now listening at localhost:" + PORT);
});