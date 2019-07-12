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
  }
}
