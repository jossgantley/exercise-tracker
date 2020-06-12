let mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("express").Router();
let User = require("./userModel");
let Exercise = require("./ExerciseModel");

router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

router.route("/new-user").post((req, res) => {
  const username = req.body.username;
  User.findOne({ username: username }, (err, aUser) => {
    if (aUser) {
      res.json({ error: "This username is already taken" });
    } else {
      const newUser = new User({ username: username });
      console.log(newUser);
      newUser
        .save()
        .then(user => res.json({ username: user.username, _id: user.id }))
        .catch(err => console.log(err));
    }
  });
});

router.route("/add").post((req, res) => {
  User.findOne({ _id: req.body.userId }, (err, user) => {
    console.log(user);
    const userId = user === undefined ? user : user._id;
    const description = req.body.description;
    const duration = req.body.duration;
    const date = req.body.date
      ? new Date(req.body.date).toDateString()
      : new Date().toDateString();
    const username = user === undefined ? null : user.username;
    console.log(userId);
    if (userId === undefined) {
      res.json({ error: "User ID not registered, please create a new user" });
    }
    const newExercise = new Exercise({
      userId,
      description,
      duration,
      date,
      username
    });

    newExercise
      .save()
      .then(exercise =>
        res.json({
          userId: exercise.userId,
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
          username: exercise.username
        })
      )
      .catch(err => console.log(err));
  }).catch(err => console.log(err));
});

router.route("/users").get((req, res) => {
  User.find({}, (err, users) => {})
    .then(users => res.json(users))
    .catch(err => console.log(err));
});

router.route("/log").get((req, res) => {
  const { userId, from, to, limit } = req.query;
  Exercise.find({ userId: userId }, (err, log) => {})
    .then(newLog => {
      console.log(new Date(from) > new Date());

      if (from && new Date(from) !== undefined && from !== undefined) {
        newLog = newLog.filter(item => {
          console.log("hello");
          return item.date >= new Date(from);
        });
      }

      if (to && new Date(to) !== undefined && to !== undefined) {
        newLog = newLog.filter(item => {
          console.log("hello");
          return item.date <= new Date(to);
        });
      }

      if (limit && Number(limit) !== NaN) {
        newLog = newLog.slice(0, Number(limit));
      }

      console.log(newLog);
      res.json({
        userId: userId,
        username: newLog[0].username,
        count: newLog.length,
        log: newLog.map(item => {
          return {
            description: item.description,
            duration: item.duration,
            date: item.date.toDateString()
          };
        })
      });
    })

    .catch(err => console.log(err));
});

module.exports = router;
