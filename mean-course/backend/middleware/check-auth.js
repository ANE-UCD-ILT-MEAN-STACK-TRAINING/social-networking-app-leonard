const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //a tokec typically would look like "Bearer aduiuskfoab792"
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'test_secret_key');
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token Invalid!!"
        });
    }
}
