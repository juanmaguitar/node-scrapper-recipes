var getJSON = require('get-json');

var apiKeyFood2Fork = process.env.FOOD2FORK_API_KEY;

var cacheRecipes = {};

function getRecipes( req, res ) {

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

}

module.exports = getRecipes;
