const article = require('../models/articles')

const createArticle = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body
  
    const newArticle = new article({
      title,
      description: description || title,
      tags,
      author: req.user._id,
      body,
      owner: req.user.username,
    })
    // save to database
    const createdArticle = await newArticle.save()

    // save Article ID to user document
    req.user.articles = req.user.articles.concat(createdArticle._id)
    await req.user.save()

    return res.status(201).json({
      status: 'success',
      data: createdArticle,
    })
  } catch (err) {
    err.source = 'creating an article'
    next(err)
  }
}

const getArticles = async (req, res, next) => {
  try {
    const Articles = await article
      .find(req.findFilter)
      .sort(req.sort)
      .select(req.fields)
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: 'success',
      pageInfo,
      data: Articles,
    })
  } catch (err) {
    err.source = 'get published articles controller'
    next(err)
  }
}

const getArticle = async (req, res, next) => {
  try {
    const { id } = req.params
    const Article = await Article.findById(id).populate('author', { username: 1 })

    if (!Article) {
      return res.status(404).json({
        status: 'fail',
        message: 'article not found'
      })
    }

    if (Article.state !== 'published') {
      const response = (res) => {
        return res.status(403).json({
          status: 'fail',
          error: 'Requested article is not published',
        })
      }
      if (!req.user) {
        return response(res)
      } else if (Article.author._id.toString() !== req.user.id.toString()) {
        return response(res)
      }
    }

    // update article read count
    Article.read_count += 1
    await Article.save()

    return res.json({
      status: 'success',
      data: Article,
    })
  } catch (err) {
    err.source = 'get published article controller'
    next(err)
  }
}

const updateArticleState = async (req, res, next) => {
  try {
    let { state } = req.body

    if (!(state && (state.toLowerCase() === 'published' || state.toLowerCase() === 'draft'))) {
      throw new Error('Please provide a valid state')
    }

    const article = await article.findByIdAndUpdate(req.params.id, { state: state.toLowerCase() }, { new: true, runValidators: true, context: 'query' })

    if (!article) {
      return res.status(404).json({
        status: 'fail',
        message: 'article not found'
      })
    }

    return res.json({
      status: 'success',
      data: article
    })
  } catch (err) {
    err.source = 'update article'
    next(err)
  }
}

const updateArticle = async (req, res, next) => {
  try {
    let articleUpdate = { ...req.body }

    if (articleUpdate.state) delete articleUpdate.state

    const article = await article.findByIdAndUpdate(req.params.id, articleUpdate, { new: true, runValidators: true, context: 'query' })

    if (!article) {
      return res.status(404).json({
        status: 'fail',
        message: 'article not found'
      })
    }

    return res.json({
      status: 'success',
      data: article
    })
  } catch (err) {
    err.source = 'update article'
    next(err)
  }
}

const deleteArticle = async (req, res, next) => {
  const user = req.user
  try {
    const deletedArticle = await article.findByIdAndRemove(req.params.id)

    if (!deletedArticle) {
      return res.status(404).json({
        status: 'fail',
        error: 'article not found'
      })
    }
    const deletedArticleId = deletedArticle._id
    const index = user.articles.indexOf(deletedArticleId)
    user.articles.splice(index, 1)

    await user.save()

    res.json({
      status: 'success',
      data: deletedArticle
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  updateArticleState,
  deleteArticle,
}