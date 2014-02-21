var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');

var local_database_name = 'pick';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

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
app.use(express.bodyParser());

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var index = require('./routes/index.js')
var start = require('./routes/start.js')
var clip = require('./routes/clip.js')
var rate = require('./routes/rate.js')
var ratings = require('./routes/ratings.js')
var login = require('./routes/login.js')
var register = require('./routes/register.js')

app.get('/', index.index);

app.get('/start', start.start);
app.post('/start', start.doStart);

app.get('/login', login.login);
app.post('/login', login.doLogin);
app.get('/logout', login.logout);

app.get('/register', register.register);
app.post('/register', register.doRegister);

app.get('/clip', clip.test);

app.get('/rate', rate.rate)

app.get('/done', function(req, res) {
	res.render('done')
})

app.get('/ratings', ratings.ratings);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});