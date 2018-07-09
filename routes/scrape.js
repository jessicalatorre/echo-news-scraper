var express = require('express');
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

//we need to this module to use the path.join method.
//path does exactly that: allows us to use path.join. It's path library
var path = require('path');

var db = require("../models");

router.get('/', function (req, res) {
    // First, we grab the body of the html with request
    //Axios allows us to do GETs via client and server
    //this function runs when the AJAX call exectures in app.js
    axios.get("http://www.echojs.com/").then(function(response) {
        console.log(response);
        // Then, we load that response into cheerio which we save in a shorthand $ selector
        var $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each( function(i, element) {
        // Save an empty result object
        var result = {};
    
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
    
        result.link = $(this).children("a").attr("href");
    
        // Create a new Article using the `result` object built from scraping
        //create is the mongoose method to insert the data into our Articld Collection (model)
        db.Article.create(result)
            .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
            });
        });
        res.send("Scrape Successfully!");
    });
});

//and we export the router objects. This means we'll be able to use it with require in the index.js file
//we're only exporting what is needed. In this case it's only router
module.exports = router;


//scrape/a