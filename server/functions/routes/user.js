const router = require('express').Router()
const admin = require('firebase-admin')

const user = require('../models/user')

router.get('/', (req, res) => {
    return res.send("Inside user router")
})

router.get("/jwtVerification", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ msg: 'Token not found' })
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedValue = await admin.auth().verifyIdToken(token)
        if (!decodedValue) {
            return res.status(500).send({ success: false, msg: "Unauthorized access" })
        } else {
            const userExists = await user.findOne({ "user_id": decodedValue.user_id })
            if (!userExists) {
                newUserData(decodedValue, req, res)
            } else {
                updateNewUserData(decodedValue, req, res)
            }
        }
        // return res.status(200).json({ success: true, data: decodedValue });
    }
    catch (err) {
        return res.send({ success: false, msg: `Error in extracting the token : ${err}` })
    }
})

const newUserData = async (decodedValue, req, res) => {
    const newUser = new user({
        name: decodedValue.name,
        email: decodedValue.email,
        imageURL: decodedValue.picture,
        user_id: decodedValue.user_id,
        email_verified: decodedValue.email_verified,
        role: "member",
        auth_time: decodedValue.auth_time,
    })

    try {
        const saveUser = await newUser.save();
        res.status(200).send({ user: savedUser })
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}

const updateNewUserData = async (decodedValue, req, res) => {
    const filter = { user_id: decodedValue.user_id };

    const options = {
        upsert: true,
        new: true,
    }
    try {
        const result = await user.findOneAndUpdate(
            filter,
            { auth_time: decodedValue.auth_time },
            options
        )
        res.status(200).send({ user: result })
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}

module.exports = router