const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = async(req,res,next) => {
    //console.log(req.headers);
    const token = req.headers['authorization'].split(" ")[1];
    if(!token){
        res.json({message : "No token found!"})
        return;
    }
    else{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decoded.user;
        next();
    }
}

const isAdmin = async(req,res,next) => {
    //console.log(req.headers);
    const token = req.headers['authorization'].split(" ")[1];
    if(!token){
        res.status(404).json({message : "No token found!"})
        return;
    }
    else{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        if(decoded.IsAdmin ===false){
            res.json({message:"You have no permission to do this action"});
            return;
        }
        next();
    }
}

module.exports = { isAdmin,isAuthenticated }