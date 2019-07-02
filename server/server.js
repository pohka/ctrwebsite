const http = require('http');
const hostname = 'localhost';
const port = 3001;
var sqlite3 = require('sqlite3').verbose();


const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())

 
//todo catach sql injection
app.get('/query/:type/:trackKeyName', function (req, res) {

  var db = new sqlite3.Database('ctr.db');
  let obj = { data : [] };

 const READABLE_TABLES = ["course", "lap"];
 var isValid = false;
 for(let i=0; i<READABLE_TABLES.length && !isValid; i++)
 {
   if(READABLE_TABLES[i] === req.params.type)
   {
     isValid = true;
   }
 }

 //invalid table name requested, dont do any query
 if(!isValid)
{
  res.end(JSON.stringify(obj));
  console.log("invalid table");
  return;
}
else
{
  let table = req.params.type;

  let query = 
  "SELECT " +
    table+".entry_id, " +
    "players.id as player_id, " +
    table+".time, " +
    table+".version, " +
    table+".date, " +
    table+".link, " +
    table+".illegal, " +
    "tracks.name as track_name, " +
    "players.name as player_name, " +
    "players.country_code, " +
    "drivers.name as driver_name " +
  "FROM " + table + " " +
  "JOIN tracks on "+table+".track_id = tracks.track_id " +
  "JOIN players on "+table+".player_id = players.id " +
  "JOIN drivers on "+table+".driver_id = drivers.driver_id "+
  "WHERE tracks.key_name='"+req.params.trackKeyName+"' " +
  "ORDER BY "+table+".time";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.end(JSON.stringify(obj));
      throw err;
    }
    else
    {
      obj.data = rows;
      console.log("request for :", req.params.type, req.params.trackKeyName);
      res.end(JSON.stringify(obj));
    }
    db.close();
  });
  }
});
  


var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", hostname, port)
});

