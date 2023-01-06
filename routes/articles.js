const articleRouter = require('express').Router()
const articleController = require('../controllers/articles')
const { addArticleValidationMw, updateArticleValidationMw } = require ("../middleware/article.validator")
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middleware/features')
const { getUserFromToken, attachUser } = require('../middleware/verifyUser')
const { pagination } = require('../middleware/pagination')
const { verifyArticleOwner } = require('../middleware/verifyArticleOwner')

articleRouter.route('/')
  .get(filterAndSort, filterByPublished, pagination, list, articleController.getArticles)
  .post(getUserFromToken, addArticleValidationMw, articleController.createArticle)

articleRouter.route('/p')
  .get(getUserFromToken, filterAndSort, setUserFilter, pagination, articleController.getArticles)

articleRouter.route('/:id')
  .get(attachUser, articleController.getArticle)
  .patch(getUserFromToken, verifyArticleOwner, updateArticleValidationMw, articleController.updateArticleState)
  .put(getUserFromToken, verifyArticleOwner, updateArticleValidationMw, articleController.updateArticle)
  .delete(getUserFromToken, verifyArticleOwner, articleController.deleteArticle)

module.exports = articleRouter