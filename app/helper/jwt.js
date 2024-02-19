const jwt = require("jsonwebtoken");

const signToken = (payload) => {
    return jwt.sign(payload, "rahasia");
};

const verifyToken = (token) => {
    return jwt.verify(token, "rahasia")
}
module.exports = {
    signToken,
    verifyToken,
}