const express = require('express');
const cors = require('cors');

const getRecipes = require('./handlers/getRecipes').getRecipes;
const getRecipeById = require('./handlers/getRecipeById');

let router = express.Router();

router.get('/recipes', cors(), getRecipes );
router.get('/recipe/:id', cors(), getRecipeById );

module.exports = router;
