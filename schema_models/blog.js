const mongoose = require ("mongoose");
const { schema } = require("./user");

const blogSchema = new mongoose.Schema ({ 
    title: {
    type: String,
    required: [true, "Title is required"],
    min: [5, 'Too short'],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // ref: "user" tells Mongoose that this field stores an ObjectId referencing documents in the "user" collection. This allows us to use the populate function which allows us to replace this bit we're commenting on with related user data from the mongodb collection we're referencing (itc "User")
    required: [true, "Author is required"]
  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },
  readCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  }
}, { timestamps: true });

// Calculate reading time before saving
blogSchema.pre("save", function(next) {
  if (this.content) {
        // const wordCount = this.content.trim().split(/\s+/).length; 
    
            // Helper function to make the above more reusable and readable
    function countWords(text) {
    const trimmedText = text?.trim() || "";
    if (!trimmedText) return 0;
    return trimmedText.split(/\s+/).length;
}
    const wordCount = countWords(this.content)
    this.readingTime = Math.ceil(wordCount / 238); // number of words in the blog / average reading speed = total reading time of the blog approximated to the nearest whole number (math.ceil)
  }
  next();
 })

 module.exports = mongoose.model("Blog", blogSchema)