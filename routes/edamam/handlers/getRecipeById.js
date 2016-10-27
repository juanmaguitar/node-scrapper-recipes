var express = require('express');
var getJSON = require('get-json');
var request = require('request');
var cheerio = require('cheerio');

var recipesEdamam = require('./getRecipes').recipesEdamam;
var cacheRecipeDetailsEdamam = {};

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

function getRecipeById( req, res ) {

	var recipeId = req.params.id
	var recipeResponse = recipesEdamam[recipeId]
	var publisher = recipeResponse.source;
	var apiUrl = req.url;

	if ( cacheRecipeDetailsEdamam[apiUrl]) {
		console.log("response from cacheRecipeDetailsEdamam: " + apiUrl)
		res.json(cacheRecipeDetailsEdamam[apiUrl]);
	}
	else if ( Object.keys(sourcesEdamam).includes(publisher) ) {

		request(recipeResponse.url, function(error, response, html) {

			var $ = cheerio.load(html);

			$(sourcesEdamam[publisher]).filter(function() {
				var $data = $(this);

				$data.find(".adsense_block.adsense_csi").remove()
				$data.find("script").remove()
				$data.find(':contains("Foto y fuente:")').remove()
				$data.find('.media__img-rev').remove()

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


}

module.exports = getRecipeById;