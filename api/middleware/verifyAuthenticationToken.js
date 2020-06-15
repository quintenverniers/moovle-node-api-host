const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let authKey = "icSSmYBncvosHIeqsbnObyl2Y5SCfveupdcA4Oz2xAMIYT8cjHesNqNXkwqDkDB";
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(req.headers);
        const decodedToken = JWT.verify(token, authKey);
        const newAuthToken = JWT.sign(
            {
                email: decodedToken.email,
                userID: decodedToken.userID
            }, 
            authKey, 
            {
                expiresIn: "7d"
            }
        );
        decodedToken.newToken = newAuthToken
        req.userData = decodedToken;
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed',
        });
    }
    
    next();
}