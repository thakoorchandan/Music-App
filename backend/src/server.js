const express = require("express");
const passport = require("./configs/passport");
const connect = require("./configs/db");
const { register, login, allUsers } = require("./controllers/auth.controller");
const albumController = require("./controllers/album.controller");

const app = express();

app.use(express.json());

app.post("/resso/register", register);
app.post("/resso/login", login);
app.get("/resso/allUsers", allUsers);

app.use("/resso/albums", albumController);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.use(passport.initialize());

passport.serializeUser(({ user, token }, done) => {
  done(null, { user, token });
});

passport.deserializeUser(({ user, token }, done) => {
  done(err, { user, token });
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // successRedirect: '/auth/google/success',
    failureRedirect: "/auth/google/failure",
  }),
  function (req, res) {
    console.log("user", req.user);
    return res.status(200).send({ user: req.user.user, token: req.user.token });
    // return res.send("Hey Seccuess")
  }
);

const start = async () => {
  await connect();

  app.listen("2233", () => {
    console.log("Listeing on port 2233");
  });
};

module.exports = start;
