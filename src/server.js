const express = require("express")
require("dotenv").config()
const app = express()

const port = process.env.PORT || 5001
const userRouter = require("./users/routes")

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}); // removes the CORS policy error

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