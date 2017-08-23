var express = require('express');
var app = express();
var multer = require('multer')
var upload = multer();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/gridFS");
var connection = mongoose.connection;
var Grid = require('gridfs-stream');
var fs = require('fs');
var stream = require ('stream')
var mime = require('mime');


//Connect grid and mongo
Grid.mongo = mongoose.mongo;






// var fs = require('fs');
//
// var myReadStream = fs.createReadStream(__dirname + "/readme.txt", 'utf8');
// var writeStream = fs.createWriteStream(__dirname + "/writeme.txt");
//
// myReadStream.pipe(writeStream);
//
//
app.get('/files', function(req, res){

  var gfs = Grid(connection.db);
var name = 'practice.png'
var readStream = gfs.createReadStream({
  filename: name
});

res.setHeader('Content-disposition', 'attatchment; filename='+ name);
res.setHeader('Content-type', mime.lookup(readStream));

readStream.pipe(res);






})


app.post('/upload',upload.single('chicken'), function(req, res){
  console.log("FILE", req.file);
  console.log("FILES", req.files);
  console.log("BODY", req.body);

  var buffer = Buffer.from(req.file.buffer);
  console.log("BUFFER:", buffer, "\nType: ",typeof buffer);

  var bufferStream = new stream.PassThrough();
  bufferStream.end( buffer );


  //Create connection to gridFS
  var gfs = Grid(connection.db);
//Create a write stream where the file name is practice png
  var writeStream = gfs.createWriteStream({
    filename: "practice.png"
  });
  console.log("Create a write stream where the file name is practice png")
//Create a read stream from the file that was just uploaded.
//var uploadedFileStream =  fs.createReadStream(buffer);
console.log("Create a read stream from the file that was just uploaded.");
//Pipe the uploaded file to the database
bufferStream.pipe(writeStream);
console.log("Pipe the uploaded file to the database");

//Log when we are done writing to the database.
  writeStream.on('close', function(file){
    console.log(file.filename, " written to the database");
  });

  res.json({ok: "ok"});
})







app.listen(3000, function(){
  console.log("Listening on port 3000.")
});
