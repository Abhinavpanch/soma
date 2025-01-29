const Post=require("../models/post.model")



async function addPost(req,res){
    console.log(req.body)
    const {title,content,author,genre}=req.body;
    await Post.create({
        title,content,author,genre
    });
    return res.redirect("/");
}



module.exports={
    addPost,

}