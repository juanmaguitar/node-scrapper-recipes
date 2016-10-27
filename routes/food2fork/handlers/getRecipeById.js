var getJSON = require('get-json');
var request = require('request');
var cheerio = require('cheerio');

var apiKeyFood2Fork = process.env.FOOD2FORK_API_KEY;

var cacheRecipeDetails = {};

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


function getRecipeById( req, res ) {

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

}

module.exports = getRecipeById;