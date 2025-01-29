const {Schema,model,mongoose}=require("mongoose");


const userSchema=new mongoose.Schema({
    fullName:{type:String,required:true,},
    email:{type:String,required:true,unique:true,},
    password:{type:String,required:true,}
},{timestamps:true});



const User=model("user",userSchema);


module.exports=User;