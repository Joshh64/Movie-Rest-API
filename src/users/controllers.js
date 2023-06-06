const User = require("./model")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) { // lets users create accounts
    try {
        await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        res.status(201).send({
            message: "Account successfully created"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message
        })
    }
}

async function login(req, res) { // allows users to login to their accounts and also generates what is called a token when they do
    try {
      const user = await User.findOne({ 
        username: req.body.username
    });
  
      if (!user) {
        return res.status(404).send({ 
          message: "Username or password incorrect" 
        });
      }

      const token = await jwt.sign({
        id: req.userInfo._id
      }, process.env.SUPER_SECRET_KEY)
  
      res.status(200).send({ 
        message: "Login successful",
        token: token
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ 
        message: error.message 
      });
    }
  }

  async function readUsers (req, res) { // provides a list of the users in our database
    try {
      const users = await User.find({})
      res.status(200).send({
        users: users
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: error.message
      })
    }
  }

  async function updateUser (req, res) { // allows for the user to update their password
    try {
      const {username, newPassword} = req.body

      const user = await User.findOne({
        username
      })

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      user.password = newPassword
      await user.save()

      res.status(200).json({
        message: "Password successfully updated!",
        updatedUser: user
      })

    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: error.message
      })
    }
  }

  async function deleteUser(req, res) { // deletes the user
    try {
        const deletedUser = await User.findOneAndDelete({
            username: req.body.username
        })
        if (!deletedUser) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        res.status(200).send({
            message: "User successfully deleted",
            user: deletedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    registerUser,
    login,
    readUsers,
    updateUser,
    deleteUser
}