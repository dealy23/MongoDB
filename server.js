var express = require('express')
  , app = express()
  , ejs = require('ejs')
  , bodyParser = require('body-parser');


app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index');
});

app.post('/save_time', function(req, res){

  console.log(req.body);
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
