# Node Scrapper Recipes

This project gets recipes based on the http://food2fork.com/ API and scraping the targeted urls to get the full recipes

It serve a unique keypoint `/recipe` that accepts one parameters:
- `q`: query for the recipe

## Routes Examples

### Recipes

    /recipe
    /recipe?q=tomate
    /recipe?q=spaghetti

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

    /recipe/7fcd69

This details `endpoint` is only enabled for the following sources:

- closetcooking.com
- thepioneerwoman.com
- www.twopeasandtheirpod.com
- www.101cookbooks.com
- whatsgabycooking.com
- www.mybakingaddiction.com
- simplyrecipes.com
- allrecipes.com

### Details Recipes

## Production Examples

    https://powerful-inlet-75906.herokuapp.com/recipe
    https://powerful-inlet-75906.herokuapp.com/recipe?q=tomate
    https://powerful-inlet-75906.herokuapp.com/recipe/7fcd69

## Installation

To run local server...

    FOOD2FORK_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX  npm run dev

To run remotely (in heroku) the proper FOOD2FORK_API_KEY should be set before deploying...

    heroku config:set FOOD2FORK_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
