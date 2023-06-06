const bcrypt = require("bcrypt")
const validator = require("email-validator")
const jwt = require("jsonwebtoken")

const User = require("../users/model")

async function hashThePassword (req, res, next) { // hides the user's password upon registration in the database to protect it from attackers
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        })
    }
}

async function hashTheNewPassword (req, res, next) { // hides the user's new updated password
    try {
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        })
    }
}

async function comparePasswords (req, res, next) { // checks if the password the user inputs is the same as the one that is stored in our database under the same username
    try {
        req.userInfo = await User.findOne({
            username: req.body.username
        })

        if(req.userInfo && await bcrypt.compare(req.body.password, req.userInfo.password)) {
            next()
        } else {
            throw new Error ("username or password incorrect")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        })
    }
}

async function validateEmail (req, res, next) { // checks if there is an @ sign in the user's email when they are creating their account
    try {
        if (validator.validate(req.body.email)) {
            next()
        } else {
            throw new Error ("Invalid email. Please try again")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        })
    }
}

async function tokenCheck (req, res, next) { // allows for the user to automatically login if they have already done so before
    try {
        const token = req.header("Authorization")

        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decodedToken.id)
        
        if (user) {
            next()
        } else {
            throw new Error ("User is not authorised")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message
        }) 
    }
}

module.exports = {
    hashThePassword,
    hashTheNewPassword,
    comparePasswords,
    validateEmail,
    tokenCheck
}