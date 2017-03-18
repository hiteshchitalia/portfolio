var bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  AWS = require('aws-sdk'),
  uuid = require('node-uuid'),
  request = require('request'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express()

var sessionStore = new session.MemoryStore()

// Configure AWS
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})
var docClient = new AWS.DynamoDB.DocumentClient()

// APP CONFIG
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)
app.set('host', process.env.HOST || 'localhost')
// app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser('my Little secret'))
app.use(session({
  secret: 'Mary had a little Harry',
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 60000}
}))

app.use(function (req, res, next) {
  res.locals.message = req.session.msg
  delete req.session.msg
  res.locals.cdnPath = 'https://d28yqlnhqzu0k4.cloudfront.net'
  next()
})

// INDEX ROUTE
app.get('/', function (req, res) {
  res.render('home')
})

app.get('/home', function (req, res) {
  res.render('home')
})

// COLOR PICKER GAME ROUTE
app.get('/colorpicker', function (req, res) {
  res.render('colorPicker')
})

// TO DO LIST SAMPLE ROUTE
app.get('/todolist', function (req, res) {
  res.render('toDoList')
})

// MOVIE SEARCH ROUTE
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
      req.session.msg = {type: 'error', msg: 'Error connecting to API.  Please resubmit request.'}
      res.redirect(303, '/moviesearch')
    }
  })
})

// FEEDBACK ROUTE
app.post('/feedback', function (req, res) {
  var id = uuid.v1()
  var ts = new Date().getTime().toString()
  var insertItem = {
      id: id,
      feedbackText: req.body.fb,
      Timestamp: ts
    }
  var params = {
      TableName: 'Portfolio',
      Item: insertItem
    }
  docClient.put(params, function (err, newlyCreated) {
      if (err) {
          req.session.msg = {type: 'error', msg: 'Error connecting database.  Feedback not saved.'}
        } else {
          req.session.msg = {type: 'success', msg: 'Thanks for your feedback!'}
        }
      res.redirect(303, '/home')
    })
})

// app.listen(app.get('port'), app.get('host'), function () {
//   console.log('App started on http://' + app.get('host') + ':' +
//    app.get('port') + '; press Ctrl-C to terminate.')
// })

module.exports = app;
