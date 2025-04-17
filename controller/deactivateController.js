const User = require("../models/User")

module.exports.deactivateController = async (req, res) => {
    const { username } = req.body;

    try {
        const userToDeactivate = await User.findOne({ username });
        if (!userToDeactivate) {
            res.status(404).json({ message: "User not found" });
        }

        userToDeactivate.isActive = !userToDeactivate.isActive;
        await userToDeactivate.save();

        if (userToDeactivate.isActive) {
            res.status(201).json({ message: "User successfully activated" });
        } else {
            res.status(201).json({ message: "User successfully deactivated" });
        }
    } catch (error) {
        res.status(500).json({ message: "Some internal error while deactivating" });
    }
}