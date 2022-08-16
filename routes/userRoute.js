const express=require('express');
const router=express.Router();
const User=require('../models/user');

router.post('/register',async(req,res)=>{
    const newuser=new User(req.body)

    try {
        const user=await newuser.save();
        res.json({message:"User Registered Successfully"});
    } catch (error) {
        res.json({message:"Registration Failed"});
    }
});

router.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  try {
    const user=await User.findOne({email:email,password:password});
    if(user){
        const temp={
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            phonenumber:user.phonenumber,
            _id:user._id
        }
        res.status(200).send(temp);
    }else{
        res.status(400).json({message:"User not found"})
    }
  } catch (error) {
    res.status(400).json({message:"Login Failed"})
  }
});


router.get('/getallusers',async(req,res)=>{
  try {
    const userdata = await User.find();
    res.send(userdata);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
module.exports=router;