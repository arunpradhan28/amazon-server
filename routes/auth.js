const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

//signup api
authRouter.post("/api/signup", async (req, res) => {
  console.log("**********/api/signup request***********");
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email is already present" });
    }
    const hashPassword = await bcryptjs.
    hash(password, 8)
    let user = new User({
      name,
      email,
      password : hashPassword,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//signin api

authRouter.post("/api/signin", async(req,res)=>{
    try {
      const {email,password} = req.body;
      const userExist = await User.findOne({email});
      if(!userExist){
        return res.status(400).json({msg : "User with this email is does not exist"})
      }

      const isMatch = await bcryptjs.compare(password,userExist.password);
      if(!isMatch){
        return res.status(400).json({msg : "Password is Incorrect"});
      }
     const token =  jwt.sign({id : userExist._id} , "passwordKey");
     console.log({ token, ...userExist._doc });
    return res.json({ token, ...userExist._doc });
      
    } catch (e) {
      res.status(500).json({error: e.message });
    }
});

authRouter.post("/tokenIsValid", async(req,res)=>{
  try {
    onsole.log("token is valid ");
   const token = req.header('x-auth-token');
   if(!token) return res.json(false);
   const verified = jwt.verify(token , "passwordKey");
   if(!verified) return res.json(false);
   const user = await User.findById(verified.id);
   if(!user) return res.json(false);
   res.json(true)

  } catch (e) {
    res.status(500).json({error: e.message });
  }
});

// get user data

authRouter.get("/", auth, async (req, res) => {
  onsole.log(" auth request");
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
