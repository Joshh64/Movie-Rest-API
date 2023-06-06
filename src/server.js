const express = require("express")
require("dotenv").config()
const cors = require("cors")
const app = express()

const port = process.env.PORT || 5001
const userRouter = require("./users/routes")

app.use(express.json())

app.use(cors()) // enable requests from any origin (fixes CORS policy error)

app.use(userRouter)

app.get("/health", (req, res) => {
    res.status(200).send({
        message: "api is working"
    })
})

require("./db/connection")

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})