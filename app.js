var bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  AWS = require('aws-sdk'),
  uuid = require('node-uuid'),
  request = require('request'),
  express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  flash = require('connect-flash'),
  app = express()

// Configure AWS
AWS.config.update( {
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
})
var docClient = new AWS.DynamoDB.DocumentClient();

// APP CONFIG
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)
app.set('host', process.env.HOST || 'localhost')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('secret'));

app.use(session({
  secret: "Mary had a little Harry",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(function(req, res, next) {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


// ROUTES
app.get('/', function (req, res) {
  res.redirect(303, '/home')
})

// INDEX ROUTE
app.get('/home', function (req, res) {
  res.render('home')
})

// COLOR PICKER GAME
app.get('/colorpicker', function (req, res) {
  res.render('colorPicker')
})

// TO DO LIST SAMPLE
app.get('/todolist', function (req, res) {
  res.render('toDoList')
})

// MOVIE SEARCH
app.get('/moviesearch', function (req, res) {
  res.render('movieSearch')
})

app.get('/movieresult/:id', function (req, res) {
  var id = req.params.id   // if using GET, can use .query to get the query parameters
  var url = 'http://www.omdbapi.com/?type=movie&i=' + id
  request(url, function (error, response, body) {
    if (id !== '' && !error && response.statusCode === 200) {
        var resp = JSON.parse(body)
        res.render('movieDetails', {movie: resp})
      } else {
        res.redirect(303, '/moviesearch')
      }
  })
})

app.get('/movieresult', function (req, res) {
  var st = req.query.searchTerm      // if using GET, can use .query to get the query parameters
  var url = 'http://www.omdbapi.com/?type=movie&s=' + st
  request(url, function (error, response, body) {
    if (st !== '' && !error && response.statusCode === 200) {
        var resp = JSON.parse(body)
        res.render('movieResults', {data: resp, query: st})
      } else {
            // Add flash message and send back to movie search
        res.redirect(303, '/moviesearch')
      }
  })
})

app.post('/feedback', function (req, res) {
    var id = uuid.v1()
    var fb = {id: id, feedbackText: req.body.fb};
    var params = {
      TableName: "Portfolio",
      Item: fb
    }
    docClient.put(params, function(err, newlyCreated) {
        if (err) {
          req.flash("error", "Error connecting to database.  Feedback not saved.")
        } else {
          //newlyCreated.save();
          req.flash("success", "Thanks for your feedback!")
        }
    })
    res.redirect(303, '/home');
})

app.listen(app.get('port'), app.get('host'), function () {
  console.log('App started on http://' + app.get('host') + ':' +
    app.get('port') + '; press Ctrl-C to terminate.')
})
