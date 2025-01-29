require("dotenv").config();
const express=require("express");
const path=require("path");
const mongoose=require("mongoose"); 
const userRoute=require("./routes/user.route")
const postRoute=require("./routes/post.route")
const Post=require("./models/post.model")
const app=express();
const PORT=9999;


mongoose.connect(process.env.MONGO_URL).then(e=>console.log("MongoDB Connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.get("/",async (req,res)=>{
    try {
        const posts = await Post.find().populate("author", "name").exec(); // Fetch all posts and populate the author
        return res.render("home", { posts, message: "Welcome to Soma" }); // Pass posts to the template
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.use("/add",postRoute);
app.use("/user",userRoute);




app.listen(PORT,()=>{
    console.log("Server Started on Port: ",PORT);
})