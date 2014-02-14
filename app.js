var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var clip = require('./routes/clip.js')
var rate = require('./routes/rate.js')

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.render('index')
});

app.get('/start', function(req, res) {
	res.render('start')
});

app.post('/start', function(req, res) {
	res.redirect('/clip')
});

app.get('/clip', clip.test);

app.get('/rate', rate.rate)

app.get('/done', function(req, res) {
	res.render('done')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});