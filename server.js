const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);

//user functions
router.get("/usernames", readUserAccounts);
router.get("/users/:id", readUserUser);
router.put("/usernames/:id", updateUser);
router.post('/users/:id', createUser);
router.delete('/users/:id', deleteUser);
router.get("/users/email/:email", readUserEmail);

//login
router.post("/login", handleLogin);



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
    res.send('Welcome to the Commit Service!');
}


// username function
function readUserAccounts(req, res, next) {
    db.many("SELECT * FROM UserAccount")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}



// friends function
function readUserUser(req, res, next) {
    db.oneOrNone('SELECT * FROM UserUser WHERE id=${ID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        })
}
//Updating user
function updateUser(req, res, next) {
    db.oneOrNone('UPDATE Users SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

//Create user
function createUser(req, res, next) {
    db.one('INSERT INTO Users(name, emailAddress, password, type) VALUES (${name}, ${email}, ${password}, ${type}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

// Delete user
function deleteUser(req, res, next) {
    db.oneOrNone('DELETE FROM Users WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

//reads email
function readUserEmail(req, res, next){
    const email = req.params.email;
    db.oneOrNone("SELECT * FROM Users WHERE emailaddress='" + req.params.email + "'", req.params)
    .then(data => {
        returnDataOr404(res, data);
    })
    .catch(err => {
        next(err);
    });
}
//login function
async function handleLogin(req, res) {
    const { emailAdress, username, password } = req.body;  // email, username, password might be wrong spelling

    try{
        const user = await db.oneOrNone('SELECT * FROM Users WHERE emailAdress = $1', emailAdress);

        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if(user.password === pasword) {
            return res.status(200).json({ message: 'Login approved' });
        } else {
            return res.status(200).json({ message: 'Incorrect password' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occured during login'});
    }
}



// list of notifications function

// user id that includes user id returns all of users friends notifs