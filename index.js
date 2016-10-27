var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var getJSON = require('get-json');
var jsesc = require('jsesc');
var path = require('path');
var cors = require('cors');

var app = express();

var apiKey = process.env.FOOD2FORK_API_KEY;
var baseUrl = process.env.BASE_URL;
var port = process.env.PORT;

var publicFolder = path.join(__dirname, 'public');

var sources = {
	'closetcooking.com' : '.recipe_post',
	'thepioneerwoman.com' : '.entry-content',
	'www.twopeasandtheirpod.com' : '.post.single-post',
	'www.101cookbooks.com': '.entrybody',
	'whatsgabycooking.com': '.entry-content',
	'www.mybakingaddiction.com' : '.post.single-post',
	'simplyrecipes.com' : '.recipe-description',
	'allrecipes.com' : '.directions--section__steps'
}

var cacheRecipes = {};
var cacheRecipeDetails = {};

app.get('/recipe/:id', cors(), function( req, res ) {

	var recipeId = req.params.id
	var urlApiRecipe = "http://food2fork.com/api/get?key=<%API_KEY%>"
	urlApiRecipe = urlApiRecipe.replace('<%API_KEY%>', apiKey );
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

			if ( Object.keys(sources).includes(publisher) ) {

				request(recipeResponse.recipe.source_url, function(error, response, html) {
					var $ = cheerio.load(html);

					$(sources[publisher]).filter(function() {
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

app.get('/recipe', cors(), function( req, res ) {

	var url = "http://food2fork.com/api/search?key=<%API_KEY%>"
	var query = req.query.q;

	url = url.replace('<%API_KEY%>', apiKey );

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

app.use( express.static(publicFolder) );

app.listen(process.env.PORT || '8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;