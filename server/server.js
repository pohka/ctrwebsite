const http = require('http');
const hostname = 'localhost';
const port = 3001;
var sqlite3 = require('sqlite3').verbose();
const DATABASE_PATH = 'ctr.db';
const debug = require("./debug.js");
debug.setIsEnabled(true);


const express = require('express')
var cors = require('cors')
const app = express()


app.use(cors())


require('./addUser').init(app);


//let v = "http://localhost:3001/addUser?avatar=coco&country=fr&email=pohka10@gmail.com&dob=765331200000&token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlNTUwOGQyNzk2NWFkNzkwN2MyMzIyMTJkZWZhNDhlZDc2MzcyN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzIwMzU1MTUzNTY1LW02OWt1MDhsOGVjM2xiczJwMmFsODhqbmRxZnZkYnRwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNzIwMzU1MTUzNTY1LW02OWt1MDhsOGVjM2xiczJwMmFsODhqbmRxZnZkYnRwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA3MzI1MTE4NjYyNDU0NDM3MjkxIiwiZW1haWwiOiJwb2hrYTEwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibFJrTW54Y0pRN2w5ZjhKRFNaN2VwQSIsIm5hbWUiOiJQb2hrYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUF1RTdtQWhUU1NtY2ItNHlIbWtLVDRZMnV0VkpaOU1tbG8wM2JaZFBBMWdxUT1zOTYtYyIsImdpdmVuX25hbWUiOiJQb2hrYSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTYyNzA3NjUyLCJleHAiOjE1NjI3MTEyNTIsImp0aSI6ImU4YWJmZDkwZWUwYzM0Y2FlMjRhMWFhOWI5MWQyYTI5Mjg2MTJmMzcifQ.toXBl4kwWA9Z4awdD2N9qLxjkLJ_fVKfvI4imnzvSpt7fcLblpo1w5rTwCgOy056XFILY4lY3DPhJLSq1e0fFl2tJZ7nc50-Ou5XZg4ANHIgQbtG5cOXxq8gbilyGDOViR9cT4SgjOO99JAv5RRRzpb-M1bSYrLYaQ4LGmF1JCpOSdYLeIVcu51zF2Q5PZ3n0vY_kOYKsclEZcQzdWRnlNMdf3zSIrRe1sGH04WyBU_U_QaxKGvaTOEfF2TEcqGLGB3T1YEaGkink85rpBeRRNCALIQ-svXJ1jN8RnBPh96jK-e28uD1XY42-1bRou58FOBWRWmj3XlEL8hRRb51ow&username=pohka"

function getUrlParams(url)
{
  
  let params = {};

  let paramsStartIndex = url.indexOf("?");
  if(paramsStartIndex > -1)
  {
    //substring after '?'
    let paramsString = url.substring(paramsStartIndex+1);

    let els = paramsString.split("&");
    for(let i=0; i<els.length; i++)
    {
      let data = els[i].split("=");
      if(data.length === 2)
      {
        const key = decodeURI(data[0]);
        const val = decodeURI(data[1]);
        params[key] = val;
      }
    }
  }

  return params;
}


// const options = {
//   hostname: hostname,
//   port: port,
//   path: '/todos',
//   method: 'GET'
// }
// const req = http.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', d => {
//     process.stdout.write(d)
//   })
// })

 
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
  

function validateAddUserOtherParams(params)
{
  const MS_IN_YEAR = 31536000000;
  const MIN_AGE = 13;
  let dobNum = parseInt(params.dob);
  
  let isValid = true;
  //country code (2 character string)
  if(typeof params.country != "string" || params.country.length !== 2)
  {
    isValid = false;
  }
  //date of birth (number and is over 13)
  else if(typeof dobNum != "number" || isNaN(dobNum) || dobNum > Date.now() - (MIN_AGE * MS_IN_YEAR))
  {
    isValid = false
  }
  else if(typeof params.avatar != "string" || params.avatar.length < 3)
  {
    isValid = false;
  }
  else if(typeof params.token != "string")
  {
    isValid = false;
  }


  return isValid;
}

function validateEmail(email)
{
  let isValid = (typeof email == "string");

  if(isValid)
  {
    let match = email.match(/\S+@\S+\.\S+/);
    if(match === null || match[0] !== match.input)
    {
      isValid = false;
    }
  }

  return isValid;
}

//adds user to database, no validation 
function addUser(params, callback)
{
  var db = new sqlite3.Database('ctr.db');
  const userQuery = 
    "INSERT INTO players (name, country_code, dob, email) " +
    "VALUES ('" + params.username + "', '" + params.country + "', " + params.dob + ", '" + params.email + "')";

  db.run(userQuery, [], (err) => {
    if(err)
    {
      callback(false);
      db.close();
    }
    else
    {
      console.log("Added new user: ", params.username);
      db.all("SELECT * FROM players WHERE name='" + params.username + "'", [], (err, rows) =>{
        if(err)
        {
          callback(false);
          db.close();
        }
        if(rows.length > 0)
        {
          const MS_IN_DAY = 86400000;
          const playerID = rows[0].id;
          let expireDate = new Date(Date.now() + (14 * MS_IN_DAY));

          const tokenQuery = "INSERT INTO tokens (token, player_id, expires) " +
            "VALUES ('" + params.token + "', " + playerID + ", " + expireDate.getTime() +")";

          db.run(tokenQuery, [], (err) => {
            if(err)
            {
              console.log("token error");
              callback(false);
            }
            else
            {
              callback(true);
            }
            
            db.close();
          });

        }
      });
    }
  });

 
}



function isEmailUnique(email) {
  var isUnique = true;
  var db = new sqlite3.Database(DATABASE_PATH);
  db.all("SELECT * FROM players WHERE email='"+email+"'", [], (err, rows) => {
    //validate other params
    if(err || rows.length > 0)
    {
      isUnique = false;
    }
    db.close();
    return isUnique;
  });
}

app.get("/test", function(req, res){
  let result = {};

  let email = "abc";

  var isUniqueEmail = new Promise(function (resolve, reject) {
    var db = new sqlite3.Database(DATABASE_PATH);
    db.all("SELECT * FROM players WHERE email='"+email+"'", [], (err, rows) => {
      //validate other params
      if(err)
      {
        result.error = "database error";
        console.log(err);
        throw err;
      }
      else
      {
        result.isUnique = (rows.length <= 0);
      }
      db.close();
      resolve(result);
    });
  });


  isUniqueEmail.then(function(result, err){
    //continue from here
    if(result.error)
    {

    }
    else
    {
      if(result.isUnique === false)
      {
        //not unique email
      }
      else
      {
        //continue
        // addUser(params, (isSuccess)=>{
        //   if(isSuccess)
        //   {
        //     result.success = isSuccess;
        //   }
        //   else
        //   {
        //     result.error = "database error 2";
        //     result.errorID = 4;
        //   }
        //   res.end(JSON.stringify(result));
        // });
      }
    }

    res.end(JSON.stringify(result));
  });
});

app.get('/addUser', function(req, res){
  //console.log("addUser", req.originalUrl);
  //req.originalUrl; //url
  let params = getUrlParams(req.originalUrl);
  //console.log("params:", params);

  var result = {};


  //validate server side too

  const MAX_USERNAME_LEN = 20;
  const MIN_USERNAME_LEN = 3;

  const requiredKeys = [
    "username",
    "avatar",
    "dob",
    "token",
    "email",
    "country"
  ];


  let hasAllRequiredKeys = true;
  for(let i=0; i<requiredKeys.length && hasAllRequiredKeys; i++)
  {
    const key = requiredKeys[i];
    if(params[key] === undefined || params[key] == null)
    {
      result.error = "missing parameter(s)";
      result.errorID = 0;
      hasAllRequiredKeys = false;
    }
  }

  //missing keys
  if(!hasAllRequiredKeys)
  {
    res.end(JSON.stringify(result));
  }
  //all keys valid
  else
  {
    if(
      typeof params.username == "string" &&
      params.username.match(/^[A-Za-z0-9_]+$/g) != null &&
      params.username.length > MIN_USERNAME_LEN &&
      params.username.length < MAX_USERNAME_LEN
    )
    {
      //check if username is already in use
      var db = new sqlite3.Database('ctr.db');
      console.log("query: find matching username");
      const query = "SELECT * FROM players WHERE name='"+params.username+"'";
      db.all(query, [], (err, rows) => {
        if(err)
        {
          console.log("addUser ERROR:", err);
          result.error = "unknown";
          result.errorID = 1;
          res.end(JSON.stringify(result));
          throw err;
        }
        else
        {
          if(rows.length > 0)
          {
            result.error = "username already taken";
            result.errorID = 2;
            res.end(JSON.stringify(result));
          }
          else
          {
            const isEmailValid = validateEmail(params.email);
            if(!isEmailValid)
            {
              result.error = "invalid parameter(s)";
              result.errorID = 0;
              res.end(JSON.stringify(result));
            }
            else
            {
              //TODO: check if email is already in use
              console.log("query: find matching email");
              const emailQuery = "SELECT * FROM players WHERE email='" + params.email + "'";
              db.all(emailQuery, [], (err, rows) => {
                //validate other params
                if(err)
                {
                  result.error = "database error 1";
                  result.errorID = 0;
                  res.end(JSON.stringify(result));
                }
                else
                {
                  //email already in use
                  if(rows.length > 0)
                  {
                    result.error = "email already in use";
                    result.errorID = 3;
                    res.end(JSON.stringify(result));
                  }
                  else
                  {
                    const isValid = validateAddUserOtherParams(params);
                    if(!isValid)
                    {
                      result.error = "invalid parameter(s)";
                      result.errorID = 0;
                      res.end(JSON.stringify(result));
                    }
                    if(isValid)
                    {

                      addUser(params, (isSuccess)=>{
                        if(isSuccess)
                        {
                          result.success = isSuccess;
                        }
                        else
                        {
                          result.error = "database error 2";
                          result.errorID = 4;
                        }
                        res.end(JSON.stringify(result));
                      });
                      //TODO:
                      //add new player to database
                      //add token to database
                      
                    }
                  }
                }
              });
            }
          }
        }
        
        db.close();
        console.log("DB CLOSED");
      });
    }
  }

});


var server = app.listen(port, function () {
  console.log("Example app listening at http://%s:%s", hostname, port)
});


