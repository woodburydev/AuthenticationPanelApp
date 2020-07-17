const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");
//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  "mongodb+srv://nathanielwoodbury:admin@cluster0-q9g9s.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

function AdminAuthenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user) {
      if (req.user.username == "nathanielwoodbury") {
        // Could Plug a List into Here... Again
        // If We Made It This Far, We Are Authenticated
        next();
      }
    }
  }
}

app.get("/admin/getUsers", AdminAuthenticationMiddleware, (req, res) => {
  // We need to authenticate that this user is a admin.

  // We are valid if we made it this far
  User.find({}, (err, doc) => {
    if (err) throw err;
    const revised = doc.filter((user) => user.username !== "nathanielwoodbury");
    // Send back passwords to the client because youre a boss and like insecure systems with potential data breaches

    res.send(revised);
  });
});

app.post("/admin/deleteUser", AdminAuthenticationMiddleware, (req, res) => {
  User.findByIdAndDelete(req.body.id, (err) => {
    if (err) throw err;
  });
  res.send("complete");
});

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});
