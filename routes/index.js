module.exports = function(app) {
    app.use('/', require('./home.js'));
    app.use('/scrape', require('./scrape.js'));
    app.use('/articles', require('./article.js'));
}