const router = require('express').Router()
const admin = require('../config/firebase.config')

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
    } catch (err) {
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

router.get("/getUsers", async (req, res) => {
    const filter = {};  // This will retrieve all users
    const options = {
        sort: {
            createdAt: 1,
        },
    };

    const cursor = await user.find(filter, null, options);  // Correct order of parameters
    if (cursor) {
        return res.status(200).send({ success: true, data: cursor });  // Use `users` instead of `user` for multiple results
    } else {
        return res.status(400).send({ success: false, msg: "No Data Found" });
    }
});


router.put("/updateRole/:userId", async (req, res) => {

    const filter = { _id: req.params.userId };
    const role = req.body.role;

    try {
        const result = await user.findOneAndUpdate(filter, {
            role: role
        })

        return res.status(200).send({ user: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
})

router.delete("/deleteUser/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };

    const result = await user.deleteOne(filter);

    if (result.deletedCount === 1) {
        res.status(200).send({ success: true, msg: "User Removed" })
    }
    else {
        res.status(500).send({ success: false, msg: "User Not Found" })
    }
})

module.exports = router