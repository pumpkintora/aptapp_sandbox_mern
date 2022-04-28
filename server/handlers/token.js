import jwt from "jsonwebtoken";

export const verify = async (req, res, next) => {
    try {
        // get token from request
        let { token } = req.body;
        // verify jwt token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err) {
                return next({ status: 400, message: "Invalid Token" });
            } 
        })
        // respond with success/error
        // return res.status(200).json({ message: "valid token" })
    } catch (e) {
        return next({ status: 400, message: "Token doesn't exist" });
    }
}