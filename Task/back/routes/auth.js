const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
    const authorization = req.header("authorization");
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Authentication token required" });
    }
    jwt.verify(token, "tcmTM", (err, user) => {
        if (err) {
            return res.status(403).json(err);
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticationToken };
