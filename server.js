const pgp = require("pg-promise")();
const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);

router.get("/username", readUserAccounts);
router.get("/username/:id", readUserAccount);

router.get("/friends/:id", readUserUser);

router.get("/notifications/:id", readNotification);
router.get("/notifications/friends/:id", readFriendNotifs);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send("Welcome to the Commit Service!");
}

// list all accounts
function readUserAccounts(req, res, next) {
  db.many("SELECT * FROM UserAccount")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}
// show user account using user id
function readUserAccount(req, res, next) {
  db.one("SELECT * FROM UserAccount WHERE ID=${id}", req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// list friends of user using user id
function readUserUser(req, res, next) {
  db.many("SELECT * FROM UserUser WHERE ID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// list of notifications function using user id
function readNotification(req, res, next) {
  db.any("SELECT * FROM Notif WHERE userID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// user id that returns all of users friends notifs
function readFriendNotifs(req, res, next) {
  db.many(
    "SELECT Notif.* FROM Notif, UserUser WHERE Notif.userID=UserUser.friendsID AND UserUser.userID=${id} OR Notif.userID=${id}",
    req.params
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// returns all of the users friends
function readUserFriends(req, res, next) {
  db.many(
    "SELECT UserUser.friendsID FROM UserUser, UserAccount WHERE UserAccount.ID=UserUser.userID AND UserUser.userID=${id}",
    req.params
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
