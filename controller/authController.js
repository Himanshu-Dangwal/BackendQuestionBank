const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.loginHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.signupHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(400).json({ message: "User with username already exists" })
        }

        const newUser = new User({ username, password })

        const resp = await newUser.save();
        res.status(201).json({ success: true, user: resp });
    } catch (err) {
        res.status(500).json({ message: "Error searching the db or creating the user" })
    }
}