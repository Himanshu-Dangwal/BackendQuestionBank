const jwt = require('jsonwebtoken');
module.exports.fetchUser = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Authorization required" });
        }

        jwt.verify(token, process.env.JSW_SECRET, (err, decoded) => {
            if (err) {
                console.error(err);
                return res
                    .status(401)
                    .json({ message: 'Invalid token', error: err.message });
            }

            req.user = decoded.user;
            console.log(req.user);

            next();
        });
    } catch (error) {
        res.status(404).json({ message: "No Auth token found" });
    }

}