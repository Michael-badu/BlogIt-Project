const Joi = require ("joi");

const ArticleAddSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(255)
        .trim()
        .required(),
    description: Joi.string()
        .min(5)
        .max(360)
        .optional()
        .trim(),
    author: Joi.string()
        .min(5)
        .required()
        .trim(),
    owner: Joi.string()
        .min(5)
        .optional()
        .trim(),
    state: Joi.string()
        .required(),
    read_count: Joi.number()
        .integer(),
    reading_time: Joi.number(),
})

const ArticleUpdateSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(255)
        .trim(),
    description: Joi.string()
        .min(5)
        .max(360)
        .optional()
        .trim(),
    author: Joi.string()
        .min(5)
        .trim(),
    owner: Joi.string()
        .min(5)
        .optional()
        .trim(),
    state: Joi.string(),
    read_count: Joi.number()
        .integer(),
    reading_time: Joi.number(),
})

async function addArticleValidationMw (req, res, next) {
    const ArticlePayLoad = req.body

    try{
        await ArticleAddSchema.validateAsync(ArticlePayLoad)
        next()
    } catch (error) {
        next({
            message: error.details(0).message,
            status: 406
    })
    }
}

async function updateArticleValidationMw(req, res, next) {
    const ArticlePayLoad = req.body
    try{
        await ArticleUpdateSchema.validateAsync(ArticlePayLoad)
        next()
    } catch (error) {
        next({
            message: error,
            status: 406
    })
    }
}

module.exports = {
    addArticleValidationMw,
    updateArticleValidationMw
}