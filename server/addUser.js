const URL = require("./url.js");
const DATABASE_PATH = 'ctr.db';
var sqlite3 = require('sqlite3').verbose();
const Validation = require("./validation.js");
const debug = require("./debug.js");


module.exports = class AddUser
{
  static init(app)
  {
    app.get('/test2', function(req, res){
      let response = {};
      let params = URL.getParams(req.originalUrl);
     // console.log(params);
      debug.log("-----------");

      //validate params
      response.isValid = AddUser.validate(params);

      //promise to query db
      AddUser.isUserNameInUse(params.username)
      .then((resolveUserName, errUserName) => {
        if(errUserName)
        {
          debug.log("username check error:", errUserName);
          //query or databse error
        }
        else
        {
          debug.log("username isInUse:", resolveUserName.isInUse);

          if(resolveUserName.isInUse === false)
          {
            //check if email is in use
            AddUser.isEmailInUse(params.email)
            .then((resolveEmail ,errEmail) => {
              if(errEmail)
              {
                debug.log("email check error:", errEmail);
              }
              else
              {
                if(resolveEmail.isInUse === true)
                {
                  //email in use
                  debug.log("email in use");
                }
                else
                {
                  debug.log("params are all valid");
                  //params are valid
                  //add user to database
                  //add token to databse
                  //login event for user in client
                }
              }
            })
          }
          else
          {
            //username in use
          }
        }

        res.end(JSON.stringify(response));
      })
      
      
    });
  }

  static validate(params)
  {
    const keys = [
      {
        name : "username",
        type : "string",
        check : (val)=>{
          const MIN_USERNAME_LEN = 3;
          const MAX_USERNAME_LEN = 20;

          return (
            val.match(/^[A-Za-z0-9_]+$/g) != null &&
            val.length > MIN_USERNAME_LEN &&
            val.length < MAX_USERNAME_LEN
          );
        }
      },
      {
        name : "avatar",
        type : "string"
      },
      {
        name : "dob",
        type : "number",
        check : (val) => {
          const MS_IN_YEAR = 31536000000;
          const MIN_AGE = 13;
          const  maxDate = Date.now() - (MS_IN_YEAR * MIN_AGE);
          return (val <= maxDate);
        }
      },
      {
        name : "token",
        type : "string"
      },
      {
        name : "email",
        type : "string",
        check : (val) => {
          let match = val.match(/\S+@\S+\.\S+/);
          return !(match === null || match[0] !== match.input);
        }
      },
      {
        name : "country",
        type : "string",
        check : (val) => {
          return (val.length === 2);
        }
      }
    ];

    return Validation.checkParams(params, keys);
  }

  static isUserNameInUse(username)
  {
    var promise = new Promise(function (resolve, reject) {
      var db = new sqlite3.Database(DATABASE_PATH);
      const query = "SELECT * FROM players WHERE name='"+username+"'";
      let result = {};
      db.all(query, [], (err, rows) => {
        //validate other params
        if(err)
        {
          result.error = err;
          reject(result);
          console.log(err);
          throw err;
        }
        else
        {
          result.isInUse = (rows.length <= 0);
        }
        db.close();
        resolve(result);
      });
    });

    return promise;
  }

  static isEmailInUse(email)
  {
    var promise = new Promise(function (resolve, reject) {
      var db = new sqlite3.Database(DATABASE_PATH);
      const query = "SELECT * FROM players WHERE email='"+email+"'";
      let result = {};
      db.all(query, [], (err, rows) => {
        //validate other params
        if(err)
        {
          result.error = err;
          reject(result);
          console.log(err);
          throw err;
        }
        else
        {
          result.isInUse = (rows.length > 0);
        }
        db.close();
        resolve(result);
      });
    });

    return promise;
  }
}

