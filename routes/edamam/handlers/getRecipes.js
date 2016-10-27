var express = require('express');
var getJSON = require('get-json');

var app = require('../../../app.js');

var apiKeyEdamam = process.env.EDAMAM_API_KEY;
var appIdEdamam = process.env.EDAMAM_APP_ID;

var cacheRecipesEdamam = {};
var recipesEdamam = {};

function getRecipes( req, res ) {

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

}


module.exports.getRecipes = getRecipes;
module.exports.recipesEdamam = recipesEdamam;
