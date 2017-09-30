var csv = require('csv');
var tsv = require('tsv');
var fs = require('fs');
var cheerio = require("cheerio");
var fetch = require('isomorphic-fetch');
var mongodb = require('mongodb');
var mongodbServer = new mongodb.Server('localhost', 27017, {
  auto_reconnect: true,
  poolSize: 10
});
var db = new mongodb.Db('yuntech', mongodbServer);

var time = '1060807-1060813'

var sheetId = '1rLXhqXVg9VpOksdeiH9JRsWbBQ3dFzpgVPeSViuyLRA';
var downloadType = 'tsv';
var downloadlink = 'https://docs.google.com/spreadsheets/d/'+ sheetId +'/export?format=' + downloadType + '&id=' + sheetId + '&gid=1722512482'
fetch(downloadlink).then(function(res) {
    var dest = fs.createWriteStream('./test.tsv');
    res.body.pipe(dest);
});
var data = [];
db.open(function() {
    data = db.collection('court').find().toArray().then(function(err,res) {
        if(res){
            console.log(data);     
            db.close;
        }
        else{
            console.log("search fail!!");      
            db.close;            
        }
    });
});

/*
var filename = '105學年度-場地借用狀況 - 1060619-1060625';
var fileytpe = 'tsv';
//read tsv
var read_tsv = fs.readFileSync('./test_data/' + filename + '.' + fileytpe,'utf8');

var test = [];
test.push(read_tsv.split(/\t|\r|\n\r/));
console.log(read_tsv);
console.log(test);

fs.writeFile('tsv.json', JSON.stringify(test) , (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
});

var output = [];
*/