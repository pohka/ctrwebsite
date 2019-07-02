const http = require('http');
const hostname = '127.0.0.1';
const port = 3001;
var sqlite3 = require('sqlite3').verbose();


const express = require('express')
const app = express()
 
//todo catach sql injection
app.get('/query/track/:trackKeyName/:type', function (req, res) {
  var db = new sqlite3.Database('ctr.db');
  let obj = { data : [] };

  
  let query = "SELECT * FROM " + req.params.type + " JOIN tracks on course.track_id=tracks.track_id WHERE tracks.key_name='"+req.params.trackKeyName+"'";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.end(JSON.stringify(obj));
      throw err;
    }

    obj.data = rows;
    res.end(JSON.stringify(obj));
    db.close();
  });
});

var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", hostname, port)
})

/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const reqTypes = [
  {
    id : "track",
    dir : "/track/:trackID",
    action : function(response, params){
      
      var db = new sqlite3.Database('ctr.db');

      let data = [];
      db.get('SELECT * FROM course WHERE track_id=1', function(err, row){
        data.push(row);
      },
      //call  when all rows have been pulled
      function(){
      //  response.res("abc");
        db.close();
      });
    }
  }
];

function isMatchingRequest(url, reqDir)
{
  if(url.length > 0)
  {
    //remove forward slash at start of url
    if(url[0]==="/")
    {
      url = url.substring(1);
    }

    if(reqDir[0] === "/")
    {
      reqDir = reqDir.substring(1);
    }

    let a = url.split("/");
    let b = reqDir.split("/");
    let isMatch = true;
    for(let i=0; i<b.length && isMatch; i++)
    {
      if(b[i].length > 0)
      {
        if(b[i][0] !== ":" && a[i]!==b[i])
        {
          isMatch = false;
        }
      }
    }

    return isMatch;
  }
  return false;
}

function getParamsFromURL(dir, url)
{
  let params = {};
  if(url.length > 0)
  {
    //remove forward slash at start of url
    if(url ==="/")
    {
      url = url.substring(1);
    }

    if(dir === "/")
    {
      dir = dir.substring(1);
    }

    let a = url.split("/");
    let b = dir.split("/");

    if(a.length >= b.length)
    {
      for(let i=0; i<b.length; i++)
      {
        if(b[i].length > 1 && b[i][0] === ":")
        {
          let key = b[i].substring(1);
          params[key] = a[i];
        }
      }
    }
  }

  return params;
}

// const server = http.createServer();
server.on('request', (request, response) => {
  if(request.url.endsWith(".json"))
  {
    console.log("got url:", request.url);
    let url = request.url.replace(".json", "");
    let els = url.substring(1).split("/");

    let reqObj = null;
    let hasFoundMatch = false;
    for(let i=0; i<reqTypes.length && !hasFoundMatch; i++)
    {
      if(isMatchingRequest(url, reqTypes[i].dir))
      {
        reqObj = reqTypes[i];
        hasFoundMatch = true;
        console.log("found matching request");
      }
    }

    if(els.length > 1 && reqObj != null)
    {
      let params = getParamsFromURL(reqObj.dir, url);
      console.log(params);
      reqObj.action(response, params);
    }
    
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World222");
    response.end();
  }
});
*/
