const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const axios = require("axios")
const RECAPTCHA_SECRET_KEY = process.env.SECRET_KEY;

module.exports.loginHandler = async (req, res) => {
    // console.log(process.env.JWT_SECRET)
    const { username, password, captchaValue, deviceId } = req.body;

    if (!captchaValue) {
        return res.status(400).json({ error: "CAPTCHA is required!" });
    }
    console.log(username, password, captchaValue, deviceId);
    try {

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`;

        const { data } = await axios.post(verifyUrl);
        console.log(data);
        if (!data.success) {
            return res.status(400).json({ error: "CAPTCHA verification failed!" });
        }

        const foundUser = await User.findOne({ username });
        if (!foundUser) return res.status(404).json({ message: 'User not found' });
        console.log(foundUser);
        if (!foundUser.isActive) return res.status(403).json({ message: 'Account is deactivated' });

        console.log("Checked for active user")
        console.log(foundUser.isActive);

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (foundUser.deviceId && foundUser.deviceId !== deviceId) {
            return res.status(403).json({ message: 'Device ID mismatch. Please log in from the registered device.' });
        }
        if (!foundUser.deviceId) {
            foundUser.deviceId = deviceId;
            await foundUser.save();
        }

        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.signupHandler = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password);

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(400).json({ message: "User with username already exists" })
        }

        const newUser = new User({ username, password })

        const resp = await newUser.save();
        res.status(201).json({ success: true, user: resp });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error searching the db or creating the user" })
    }
}

module.exports.loginTestHandler = async (req, res) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports.updateActiveTimeHandler = async (req, res) => {
    const id = req.id;
    const { activeTime } = req.body;
    // console.log(user);
    // console.log(id);
    try {
        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: 'User not found' });
        foundUser.totalActiveTime += activeTime;
        await (foundUser.save());
        // console.log(foundUser);
        res.status(200).json({ message: "Updated time" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.totalActiveTime = async (req, res) => {
    try {
        const users = await User.find({}, 'username isActive createdAt totalActiveTime');

        const formattedUsers = users.map(user => {
            const totalSeconds = user.totalActiveTime;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            return {
                username: user.username,
                isActive: user.isActive,
                createdAt: user.createdAt,
                totalActiveTime: `${hours}h ${minutes}m ${seconds}s`
            };
        });

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
