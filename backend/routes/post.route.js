const express=require("express");
const { addPost } = require("../controllers/post.controller");
const router=express.Router();


router.get("/",(req,res)=>{
    return res.render("addPost");
})
router.post("/",addPost)








module.exports=router;