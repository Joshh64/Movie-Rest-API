const { Router } = require("express")
const userRouter = Router()
const {registerUser, login, readUsers, updateUser, deleteUser} = require("./controllers")
const {hashThePassword, hashTheNewPassword, comparePasswords, validateEmail, tokenCheck} = require ("../middleware/index.js")

userRouter.post("/users/register", validateEmail, hashThePassword, registerUser)
userRouter.post("/users/login", comparePasswords, login) // manual login
userRouter.get("/users/readUsers", readUsers)
userRouter.get("/users/authCheck", tokenCheck, login) // persistant login
userRouter.put("/users/updateUser", hashTheNewPassword, updateUser)
userRouter.delete("/users/deleteUser", deleteUser)

module.exports = userRouter