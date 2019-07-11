const URL = require("./url.js");
const DATABASE_PATH = 'ctr.db';
var sqlite3 = require('sqlite3').verbose();
const Validation = require("./validation.js");
const debug = require("./debug.js");


//response error IDs
const RESPONSE_DATABASE_ERROR = 1;
const RESPONSE_USERNAME_IN_USE = 2;
const RESPONSE_EMAIL_IN_USE = 3;

module.exports = class AddUser
{
  static init(app)
  {
    /*
      success response: 
        {
          success : true
        }

      failed response:
        {
          success : false,
          msg : "message content",
          err : errID
        }

    */
    app.get('/test2', function(req, res){
      let response = {};
      let params = URL.getParams(req.originalUrl);
     // console.log(params);
      debug.log("-----------");

      //validate params
      const isParamsValid = AddUser.validate(params);

      if(isParamsValid)
      {
        //promise to query db
        AddUser.isUserNameInUse(params.username)
        .then((resolveUserName, errUserName) => {
          if(errUserName)
          {
            //query or databse error
            AddUser.endFailed(res, "database error", errUserName, RESPONSE_DATABASE_ERROR);
            throw errUserName;
          }
          else
          {
            //debug.log("username isInUse:", resolveUserName.isInUse);

            if(resolveUserName.isInUse === false)
            {
              //check if email is in use
              AddUser.isEmailInUse(params.email)
              .then((resolveEmail ,errEmail) => {
                if(errEmail)
                {
                  AddUser.endFailed(res, "database error", errEmail, RESPONSE_DATABASE_ERROR);
                  throw errEmail;
                }
                else
                {
                  if(resolveEmail.isInUse === true)
                  {
                    //email in use
                    AddUser.endFailed(res, "email address is already in use", null, RESPONSE_EMAIL_IN_USE);
                  }
                  //all params are valid
                  else
                  {
                    //add user to database
                    AddUser.addUserToDB(params)
                    .then((resolveAddUser, errAddUser) =>{
                      if(errAddUser)
                      {
                        AddUser.endFailed(res, "database error", errAddUser, RESPONSE_DATABASE_ERROR);
                        throw errAddUser;
                      }
                      else
                      {
                        //add token to database
                        AddUser.addToken(params.token, params.username)
                        .then((resolveToken, errToken) =>{
                          if(errToken)
                          {
                            AddUser.endFailed(res, "database error", errToken, RESPONSE_DATABASE_ERROR);
                            throw errToken;
                          }

                          //--------------------------------------------------
                          //successfully completed all opperations
                          //--------------------------------------------------
                          else
                          {
                            let response = {
                              success : true
                            };
                            res.end(JSON.stringify(response));
                          }
                        }); //end of token add to db
                      }
                    }); //end of user add to db
                  }
                }
              }); //end of email check
            }
            else
            {
              //username in use
              AddUser.endFailed(res, "username is already in use", errUserName, RESPONSE_USERNAME_IN_USE);
            }
          }
        }); //endof username check
      }
    });
  }

  //end resolve, generate response to client and log error on server
  static endFailed(resolve, clientMsg, serverMsg, errID)
  {
    let response = {
      success : false,
      msg : clientMsg,
      err : errID
    };

    if(serverMsg !== undefined && serverMsg != null)
    {
      debug.log(serverMsg);
    }

    resolve.end(JSON.stringify(response));
  }

  //validates all the parameters
  static validate(params)
  {
    //signature of each paramater
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

  //returns a promise that checks if the username is in use
  static isUserNameInUse(username)
  {
    var promise = new Promise(function (resolve, reject) {
      var db = new sqlite3.Database(DATABASE_PATH);
      let lowercaseName = username.toLowerCase();
      const query = "SELECT * FROM players WHERE lowercase_name='" + lowercaseName + "'";
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

  //returns a promise that checks if the email is in use
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


  //returns a prmomise that adds a user to database (params must be validated beforehand)
  static addUserToDB(params)
  {
    var promise = new Promise(function (resolve, reject) {
      var db = new sqlite3.Database('ctr.db');

      let lowercaseName = params.username.toLowerCase();
      const userQuery = 
        "INSERT INTO players (name, country_code, dob, email, lowercase_name) " +
        "VALUES ("+
          "'" + params.username + "', " +
          "'" + params.country + "', " +
          params.dob + ", " +
          "'" + params.email + "', " +
          "'" + lowercaseName + "')";
    
      
      db.run(userQuery, [], (err) => {
        if(err)
        {
          reject();
        }

        console.log("Added new user:", params.username);
        db.close();
        resolve();
      });
    });

    return promise;
  }


  //returns a prmomise that adds a login token to database (params must be validated beforehand)
  static addToken(token, username)
  {
    var promise = new Promise(function (resolve, reject) {
      var db = new sqlite3.Database('ctr.db');
      const query = "SELECT * FROM players WHERE name='" + username + "'";

      db.all(query, [], (err, rows) =>{
        if(err)
        {
          db.close();
          reject(err);
        }
        if(rows.length > 0)
        {
          const MS_IN_DAY = 86400000;
          const playerID = rows[0].id;
          let expireDate = new Date(Date.now() + (14 * MS_IN_DAY));

          const tokenQuery = "INSERT INTO tokens (token, player_id, expires) " +
            "VALUES ('" + token + "', " + playerID + ", " + expireDate.getTime() +")";

          db.run(tokenQuery, [], (err) => {
            if(err)
            {
              reject(err);
            }
            else
            {
              resolve();
              console.log("Added login token for playerID:", rows[0].name);
            }
            db.close();
          });
        }
      });
    });

    return promise;
  }
}

