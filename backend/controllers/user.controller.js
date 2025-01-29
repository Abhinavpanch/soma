const User=require("../models/user.model");

function handleUserSignup(req,res){
    return res.render("signup")
}


function handleUserLogin(req,res){
    return res.render("login")
}

async function createUser(req,res){
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/user/login");
}

async function verifyUser(req,res){
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"User NOT Found"});
        }

        if(user.password!==password){
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.redirect("/");
    }catch(err){
        console.log("Error during login: ",err)
    }
}


module.exports={
    handleUserSignup,
    handleUserLogin,
    createUser,
    verifyUser,
}