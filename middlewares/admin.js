const jwt = require("jsonwebtoken");
const User = require("../models/user")

const admin = async(req,res,next) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) {
            res.status(401).json({msg : "No auth token,access denied"});
        }

        const verified = jwt.verify(token,"passwordKey");
        if(!verified) {
            res.status(401).json({msg : "Token verification failed,access denied"});
        }

        
        const user = await User.findById(verified.id);
        if(user.type == "user" || user.type == "seller") {
            res.status(401).json({msg : "You Are Not An Admin"});
        }
        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    

}

module.exports = admin;