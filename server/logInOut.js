const URL = require("./url.js");
const DATABASE_PATH = 'ctr.db';
var sqlite3 = require('sqlite3').verbose();


module.exports = class LogInOut
{
  static init(app)
  {
    app.get("/logout", function(req, res){
      let params = URL.getParams(req.originalUrl);
      let response= {};

      //validate token
      if(params.token !== undefined && typeof params.token == "string")
      {
        var db = new sqlite3.Database(DATABASE_PATH);
        const query = "DELETE FROM tokens WHERE token='"+params.token+"'";
        
        db.run(query, (result, err)=>{
          if(err)
          {
            response.success = false;
            response.error="database error";
            throw err;
          }
          else
          {
            response.success = true;
          }
          db.close();
          res.end(JSON.stringify(response));
        });
      }
      else
      {
        response.error="invalid params";
        response.success = false;;
        res.end(JSON.stringify(response));
      }
    });


    app.get("/login", function(req, res){
      let params = URL.getParams(req.originalUrl);
      let response = {};

      if(
        params.email !== undefined && typeof params.email == "string" &&
        params.token !== undefined && typeof params.token == "string"
        )
      {
        //create new login token
        //duplicating code here
        var db = new sqlite3.Database('ctr.db');
        const query = "SELECT * FROM players WHERE email='" + params.email + "'";
  
        db.all(query, [], (err, rows) =>{
          if(err)
          {
            db.close();
          }
          if(rows.length > 0)
          {
            const MS_IN_DAY = 86400000;
            const playerID = rows[0].id;
            const username = rows[0].name;
            const avatar = rows[0].avatar;
            let expireDate = new Date(Date.now() + (14 * MS_IN_DAY));
  
            const tokenQuery = "INSERT INTO tokens (token, player_id, expires) " +
              "VALUES ('" + params.token + "', " + playerID + ", " + expireDate.getTime() +")";
  
            db.run(tokenQuery, [], (err) => {
              if(err)
              {
                
              }
              else
              {
                response.username = username;
                response.avatar = avatar;
                res.end(JSON.stringify(response));
              }
              db.close();
            });
          }
        });
      }
      else
      {
        response.error = "Invalid parameter(s)";
        res.end(JSON.stringify(response));
      }

      
    });
  }
}
