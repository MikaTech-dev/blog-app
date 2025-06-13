const mongoose = require ("mongoose")

const blogSchema = new mongoose.Schema ({ 
    title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    function countWords (text) {
        const trimmedText = text.trim()
        if (!trimmedText) {
            return
        }
        const words = trimmedText.split(/\s+/) // splitting by whitespace
        return words.length
    }
    const wordCount = countWords(this.content)
    this.readingTime = Math.ceil(wordCount / 238); // number of words in the blog / average reading speed = total reading time of the blog
  }
  next();
 })