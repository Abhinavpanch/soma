const {Schema,model,mongoose}=require("mongoose");


const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, 
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // For nested comments
  createdAt: { type: Date, default: Date.now },
},{timestamps:true});


const Comment=model("comment",commentSchema);

module.exports = Comment;