const express=require("express");
const { handleUserSignup, handleUserLogin, createUser, verifyUser } = require("../controllers/user.controller");
const router=express.Router();



router.get("/signup",handleUserSignup)
router.get("/login",handleUserLogin)

router.post("/signup",createUser)
router.post("/login",verifyUser);





module.exports=router;