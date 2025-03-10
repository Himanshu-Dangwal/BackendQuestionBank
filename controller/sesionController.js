const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.checkSession = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: "User no longer exists" });
        if (!user.isActive) {
            res.status(401).json({ message: "Unauthorized" });
        }

        res.json({ message: "Session valid" });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}