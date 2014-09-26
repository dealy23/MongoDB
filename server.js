var express = require('express')
  , app = express()
  , ejs = require('ejs')
  , bodyParser = require('body-parser')
  , mongojs = require('mongojs');

var databaseUrl = "mydb";
var collections = ["times"];
var db = mongojs.connect(databaseUrl, collections);

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index');
});



app.post('/save_time', function(req, res){

  db.times.insert(req.body, function(err, document) {
    res.send(document);
  });
});


app.get('/times', function(req, res){

  db.times.find({}, function(err, data) {
    res.send(data);
  });

});

app.delete('/time', function(req, res){
  var id = db.ObjectId(req.body._id);
  db.times.remove({_id:id}, function(err, data){
    if(err) { throw err; }
    res.send(data);
  })
});

//app.put('/time', function (req, res){
//  var id = db.ObjectID(req.body._id);
//  db.times.update({_id:id}, function(err, data){
//  })
//})

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
