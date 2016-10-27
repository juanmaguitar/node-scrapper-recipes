# Node Scrapper Recipes

This project gets recipes based on the http://food2fork.com/ and https://www.edamam.com/ API's and scraping the targeted urls to get the full recipes

## food2fork _endpoints_

### Recipes (food2fork)

It serve a unique keypoint `/recipe` that accepts one parameters:
- `q`: query for the recipe

    /food2fork/recipe
    /food2fork/recipe?q=tomate
    /food2fork/recipe?q=spaghetti

This JSON serve a array if recipes w/ the form:

    {
        publisher: "The Pioneer Woman",
        f2f_url: "http://food2fork.com/view/7fcd69",
        title: "Chicken Spaghetti",
        source_url: "http://thepioneerwoman.com/cooking/2007/06/chicken_spaghet/",
        recipe_id: "7fcd69",
        image_url: "http://static.food2fork.com/496652595_50b3c3e3b92634.jpg",
        social_rank: 99.99999999999605,
        publisher_url: "http://thepioneerwoman.com",
        url_details: "/recipe/7fcd69"
    },

The property `url_details` can be used to do another request to get the details of the recipe

### Details Recipes (food2fork)

    /food2fork/recipe/7fcd69

This details `endpoint` is only enabled for the following sources:

- closetcooking.com
- thepioneerwoman.com
- www.twopeasandtheirpod.com
- www.101cookbooks.com
- whatsgabycooking.com
- www.mybakingaddiction.com
- simplyrecipes.com
- allrecipes.com

### Production Examples

    https://powerful-inlet-75906.herokuapp.com/food2fork/recipe
    https://powerful-inlet-75906.herokuapp.com/food2fork/recipe?q=tomate
    https://powerful-inlet-75906.herokuapp.com/food2fork/recipe/7fcd69

## edamam _endpoints_

### Recipes (edamam)

It serve a unique keypoint `/recipes` that accepts one parameters:
- `q`: query for the recipe

    /edamam/recipes
    /edamam/recipes?q=tomate
    /edamam/recipes?q=spaghetti

The property `details_url` can be used to do another request to get the details of the recipe

### Details Recipes (edamam)

    /edamam/recipe/4d5eb7a575380b78e67b64de74ddc864

This details `endpoint` is only enabled for the following "providers":

- KiwiLimon
- Cookpad Spain
- Canal Cocina
- Hogarmania
- Que Rica Vida
- Recetal Comidas
- Hogar Util
- Hola - Cocina y Recetas
- Comida Kraft

### Production Examples

    https://powerful-inlet-75906.herokuapp.com/edamam/recipes?q=pollo
    https://powerful-inlet-75906.herokuapp.com/edamam/recipes?q=queso
    https://powerful-inlet-75906.herokuapp.com/food2fork/recipe/7fcd69


## Installation

To run local server...

    FOOD2FORK_API_KEY=XXXXXX EDAMAM_API_KEY=XXXXXX EDAMAM_APP_ID=XXXXXX npm run dev

To run remotely (in heroku) the proper FOOD2FORK_API_KEY should be set before deploying...

    heroku config:set FOOD2FORK_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
    heroku config:set EDAMAM_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
    heroku config:set EDAMAM_APP_ID=XXXXXXXXXXXXXXXXXXXXXXXX
