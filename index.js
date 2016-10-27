var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var getJSON = require('get-json');
var jsesc = require('jsesc');
var path = require('path');
var cors = require('cors');

var app = express();

var apiKeyFood2Fork = process.env.FOOD2FORK_API_KEY;

var apiKeyEdamam = process.env.EDAMAM_API_KEY;
var appIdEdamam = process.env.EDAMAM_APP_ID;

var baseUrl = process.env.BASE_URL;
var port = process.env.PORT;

var publicFolder = path.join(__dirname, 'public');

var sourcesFood2Fork = {
	'closetcooking.com' : '.recipe_post',
	'thepioneerwoman.com' : '.entry-content',
	'www.twopeasandtheirpod.com' : '.post.single-post',
	'www.101cookbooks.com': '.entrybody',
	'whatsgabycooking.com': '.entry-content',
	'www.mybakingaddiction.com' : '.post.single-post',
	'simplyrecipes.com' : '.recipe-description',
	'allrecipes.com' : '.directions--section__steps'
}


var sourcesEdamam = {
	'KiwiLimon' : '.pasos',
	'Cookpad Spain': '#steps ol',
	'Canal Cocina': 'article.cooking div',
	'Hogarmania': '.ficha',
	'Que Rica Vida': '.recipePartStepsList',
	'Recetal Comidas' : '[itemprop="recipeInstructions"]',
	'Hogar Util': '.ficha',
	'Hola - Cocina y Recetas': '.robapaginas-blogs + .entry',
	'Comida Kraft' : '[itemprop="recipeInstructions"]'
}

var cacheRecipes = {};
var cacheRecipeDetails = {};

var cacheRecipesEdamam = {};
var cacheRecipeDetailsEdamam = {};
var recipesEdamam = {};

app.get('/food2fork/recipe/:id', cors(), function( req, res ) {

	var recipeId = req.params.id
	var urlApiRecipe = "http://food2fork.com/api/get?key=<%API_KEY%>"
	urlApiRecipe = urlApiRecipe.replace('<%API_KEY%>', apiKeyFood2Fork );
	urlApiRecipe = urlApiRecipe + '&rId=' + recipeId;

	if (cacheRecipeDetails[urlApiRecipe]) {
		console.log("response from cacheRecipeDetails: " + urlApiRecipe)
		res.json( cacheRecipeDetails[urlApiRecipe] );
	}
	else {

		getJSON(urlApiRecipe, function(error, recipeResponse){

			var publisher = recipeResponse.recipe.publisher_url;
			publisher = publisher.split("://")[1]
			console.log ('publisher => ' + publisher);

			if ( Object.keys(sourcesFood2Fork).includes(publisher) ) {

				request(recipeResponse.recipe.source_url, function(error, response, html) {
					var $ = cheerio.load(html);

					$(sourcesFood2Fork[publisher]).filter(function() {
						var $data = $(this);
						recipeResponse.recipe.description_text = $data.text();
						recipeResponse.recipe.description_html = $data.html();
					});
					cacheRecipeDetails[urlApiRecipe] = recipeResponse;
					console.log("response from server: " + urlApiRecipe)
					res.json(recipeResponse);

				});

			}

			else {
				res.json({ msg: 'no data'});
			}

		})

	}


})

app.get('/food2fork/recipe', cors(), function( req, res ) {

	var url = "http://food2fork.com/api/search?key=<%API_KEY%>"
	var query = req.query.q;

	url = url.replace('<%API_KEY%>', apiKeyFood2Fork );

	if (query) {
		url = url + '&q=' + query;
	}

	console.log("requesting =>  " + url)
	if (cacheRecipes[url]) {
		console.log("response from cacheRecipes: " + url)
		res.json( cacheRecipes[url] );
	}
	else {

		getJSON(url, function(error, response){

			if( !error ) {

					var jsonRecipes = response;

					jsonRecipes = jsonRecipes.recipes.map( (recipe, i) => {
						recipe.url_details = '/recipe/' + recipe.recipe_id;
						return recipe;
					})

					cacheRecipes[url] = jsonRecipes;
					console.log("response from server: " + url)
					res.json(jsonRecipes);

			}
			else {
				res.json({ "status": "ko", "msg" : "No song found" });
			}

		})

	}

})

app.get('/edamam/recipes', cors(), function( req, res ) {

	var url = "https://test-es.edamam.com/search?q=<%QUERY%>&app_id=<%APP_ID%>&app_key=<%API_KEY%>"
	var query = req.query.q;

	url = url.replace('<%API_KEY%>', apiKeyEdamam );
	url = url.replace('<%APP_ID%>', appIdEdamam );
	url = url.replace('<%QUERY%>', query );

	console.log("requesting =>  " + url)

	if (cacheRecipesEdamam[url]) {
		console.log("response from cacheRecipesEdamam: " + url)
		res.json( cacheRecipesEdamam[url] );
	}
	else {

		getJSON(url, function(error, response){

			if( !error ) {

					var jsonRecipes = response;


					jsonRecipes = jsonRecipes.hits
						.map( hit => hit.recipe )
						.map( recipe => {
							var idRecipe = recipe.uri.split("#recipe_")[1];
							recipesEdamam[idRecipe] = recipe;
							recipe.details_url = "/edamam/recipe/" + idRecipe;
							return recipe;
						} )

					cacheRecipesEdamam[url] = jsonRecipes;
					console.log("response from server: " + url)
					res.json(jsonRecipes);

			}
			else {
				res.json({ "status": "ko", "msg" : "No song found" });
			}

		})

	}

})

app.get('/edamam/recipe/:id', cors(), function( req, res ) {

	var recipeId = req.params.id
	var recipeResponse = recipesEdamam[recipeId]
	var publisher = recipeResponse.source;
	var apiUrl = req.url;

	if ( cacheRecipeDetailsEdamam[apiUrl]) {
		res.json(cacheRecipeDetailsEdamam[apiUrl]);
	}
	else if ( Object.keys(sourcesEdamam).includes(publisher) ) {

		request(recipeResponse.url, function(error, response, html) {

			var $ = cheerio.load(html);

			$(sourcesEdamam[publisher]).filter(function() {
				var $data = $(this);
				recipeResponse.description_text = $data.text();
				recipeResponse.description_html = $data.html();
			});

			cacheRecipeDetailsEdamam[apiUrl] = recipeResponse;
			console.log("response from server: " + apiUrl)
			res.json(recipeResponse);

		});

	}
	else {
			res.json({ msg: 'no data'});
	}


})

app.use( express.static(publicFolder) );

app.listen(process.env.PORT || '8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;