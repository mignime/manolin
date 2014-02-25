var http = require('http');
var express = require('express'), app = express();
var jade = require('jade');
var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {}); //fernetjs.com/2012/08/buenos-amigos-nodejs-mongodb/#sthash.UuGDGxaJ.dpuf
var dbTest = new mongodb.Db('gasManolo', server, {}) //fernetjs.com/2012/08/buenos-amigos-nodejs-mongodb/#sthash.UuGDGxaJ.dpuf
server = http.createServer(app)
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false })
app.use(express.urlencoded());
app.use(express.json());

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

dbTest.open(function (error, client) {
  if (error) throw error;
 
  //en el parámetro client recibimos el cliente para comenzar a hacer llamadas
  //este parámetro sería lo mismo que hicimos por consola al llamar a mongo
  var collection = new mongodb.Collection(client, 'tanque');
   
  collection.find({},{clave:1, _id:0}).toArray(function(err, docs) {

  //imprimimos en la consola el resultado
    console.dir(docs);
  });
  dbTest.close();
}); 
//- See more at: http://fernetjs.com/2012/08/buenos-amigos-nodejs-mongodb/#sthash.UuGDGxaJ.dpuf

app.post('/obtenTanques', function(req, res){
  dbTest.open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'tanque');
     
    collection.find({},{clave:1, _id:0}).toArray(function(err, docs) {
      console.log("LOSTANQWS ",docs);
      //res.writeHead(200, "OK", {'Content-Type': 'application/json'});
      res.send(docs);
      //res.end();
    //imprimimos en la consola el resultado
      res.docs;
      dbTest.close();
    });
  }); 
});
app.post('/descripcionTanque', function(req, res){
  dbTest.open(function (error, client) {
    if (error) throw error;
    console.log("---::::::::::::--- ",req.body);
    var collection = new mongodb.Collection(client, 'tanque');
    var descTanque = req.body.clave;
    collection.find({clave:descTanque},{_id:0}).toArray(function(err, docs) {
      console.log("LOSTANQWS ",docs);
      //res.writeHead(200, "OK", {'Content-Type': 'application/json'});
      res.send(docs);
      //res.end();
    //imprimimos en la consola el resultado
      res.docs;
      dbTest.close();
    });
  }); 
});

app.post('/precioTanque', function(req, res){
  dbTest.open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'precios');
    var clavePrecio = req.body.clavePrecio;
    collection.find({clave:clavePrecio},{_id:0,clave:0}).toArray(function(err, precio) {
      console.log("PRECIOS ",precio);
      //res.writeHead(200, "OK", {'Content-Type': 'application/json'});
      res.send(precio);
      //res.end();
    //imprimimos en la consola el resultado
      res.precio;
      dbTest.close();
    });
  }); 
});

app.post('/signup', function(req, res){
  console.log("[200] " + req.method + " to " + req.url);
              
            req.on('data', function(chunk) {
              console.log("Received body data:");
              console.log(chunk.toString());
            });
            
            req.on('end', function() {
              // empty 200 OK response for now
              res.writeHead(200, "OK", {'Content-Type': 'text/html'});
              res.end();
            });
});

app.get('/', function(req, res){
  console.log("REQUEST "+req.method+"------------", req.url);
  // set up some routes
  switch(req.url) {
    case '/':
      res.render('home.jade');
        // show the user a simple form
        //  console.log("[200] " + req.method + " to " + req.url);
        //  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        //  res.write('<html><head><title></title></head><body>');
        //  res.write('<h1>Registro</h1>');
        //  res.write('<form enctype="application/x-www-form-urlencoded" action="/formhandler" method="post">');
        //  res.write('Tanque: <input type="text" name="username" value="%" /><br />');
        // res.write('Medidor: <input type="text" name="userage" value="" /><br />');
        //  res.write('<input type="submit" />');
        //  res.write('</form></body></html');
        //res.end();
      break;
    case '/signup':
        if (req.method == 'POST') {
            console.log("[200] " + req.method + " to " + req.url);
              
            req.on('data', function(chunk) {
              console.log("Received body data:");
              console.log(chunk.toString());
            });
            
            req.on('end', function() {
              // empty 200 OK response for now
              res.writeHead(200, "OK", {'Content-Type': 'text/html'});
              res.end();
            });
            
          } else {
            console.log("[405] " + req.method + " to " + req.url);
            res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
            res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
          }
      break;
    default:
      res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
      console.log("[404] " + req.method + " to " + req.url);
  };
}).listen(8000)