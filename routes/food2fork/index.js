const express = require('express');
const cors = require('cors');

const getRecipes = require('./handlers/getRecipes');
const getRecipeById = require('./handlers/getRecipeById');

let router = express.Router();

router.get('/recipe', cors(), getRecipes );
router.get('/recipe/:id', cors(), getRecipeById );

module.exports = router;
