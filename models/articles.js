const mongoose = require('mongoose')
const { readingTime } = require('../readingTime')

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
        String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: String,
    },
    state: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published'],
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: Number,
    tags: [String],
    body: String,
  },
  { timestamps: true }
)

// Reading time before saving article
articleSchema.pre('save', function (next) {
  let article = this
  const timeToRead = readingTime(this.body)
  article.reading_time = timeToRead
  next()
})

// Reading time before updating article
articleSchema.pre('findOneAndUpdate', function (next) {
  let article = this._update
  if (article.body) {
    const timeToRead = readingTime(article.body)
    article.reading_time = timeToRead
  }
  next()
})

articleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.owner
  },
})

module.exports = mongoose.model('Article', articleSchema)