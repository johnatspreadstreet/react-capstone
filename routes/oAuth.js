const express = require("express");

const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authController = require("./auth.controller");
const { JWT_SECRET, JWT_EXPIRY, CLIENT_ORIGIN } = require("../config");

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.name,
    expiresIn: JWT_EXPIRY
  });
}

// Setting up the passport middleware for each of the OAuth providers
const twitterAuth = passport.authenticate("twitter");
const googleAuth = passport.authenticate("google", { scope: ["profile"] });
const facebookAuth = passport.authenticate("facebook");
const githubAuth = passport.authenticate("github");

// Routes that are triggered by the callbacks from each OAuth provider once
// the user has authenticated successfully
router.get("/twitter/callback", twitterAuth, authController.twitter);
router.get("/google/callback", googleAuth, (req, res) => {
  const io = req.app.get("io");
  const user = {
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, "sz=250")
  };
  const authToken = createAuthToken(user);
  io.in(req.session.socketId).emit("google", user);
  res.redirect(`https://localhost:3000?authToken=${authToken}`);
});
router.get("/facebook/callback", facebookAuth, authController.facebook);
router.get("/github/callback", githubAuth, authController.github);

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right
// socket
router.use((req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
});

// Routes that are triggered on the client
router.get("/twitter", twitterAuth);
router.get("/google", googleAuth);
router.get("/facebook", facebookAuth);
router.get("/github", githubAuth);

module.exports = router;
