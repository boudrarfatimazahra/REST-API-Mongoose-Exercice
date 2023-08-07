const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')
//load environment variables from .env
dotenv.config({ path: './config/.env' })

const app = express()

const PORT = 3001

const mongo_url = process.env.MONGO_URI

//connect to mongodb
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.log(`Error connecting to MongoDB ${error}`));

//Middleware to parse JSON in request body 
app.use(express.json())

//Add a new user to the database

app.post('/users', async (req, res, next) => {
    const { name, email, age } = req.body
    try {
        const userCreated = await User.create({ name, age, email })
        if (!userCreated) return res.status(400).send({ message: 'created user is failed' })
        return res.status(200).send(userCreated)
    } catch (error) {
        return res.status(500).send({ message: 'internal error server' })
    }
})

//  RETURN ALL USERS 
app.get('/users', async (req, res, next) => {
    try {
        const allUsers = await User.find()
        return res.status(200).send(allUsers)
    } catch (error) {

        return res.status(500).send({ message: 'internal error server' })
    }
})

// EDIT A USER BY ID
app.put('/users/:id', async (req, res, next) => {
    const { id } = req.params
    const { name, email, age } = req.body
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: id }, { name, email, age })
        if (!updatedUser) return res.status(400).send({ message: "update user is failed" })
        return res.status(200).send({ message: "OK" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'internal error server' })
    }
})

//REMOVE A USER BY ID 

app.delete('/users/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedUser = await User.findOneAndDelete({ _id: id })
        if (!deletedUser) return res.status(400).send({ message: "delete user is failed" })

        return res.status(200).send({ message: "OK" })
    } catch (error) {
        return res.status(500).send({ message: 'internal error server' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})