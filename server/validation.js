const debug = require("./debug.js");


module.exports = class Validation
{
  //pass in keys, that validate the value of each params
  /*
    - keys are required by default
    - check is optional

    example:
    ---------------------
    keys = [
      {
        name : "age",
        type : "number",
        check : (val) => {
          return age >= 13;
        }
      }
    ];

  */
  static checkParams(params, keys)
  {
    //if all required keys are in params
    let hasMissingKey = false;
    for(let i=0; i<keys.length && !hasMissingKey ; i++)
    {
      const keyName = keys[i].name;
      if(params[keyName] === undefined || params[keyName] == null)
      {
        debug.log("missing required key:", keyName);
        hasMissingKey = true;
      }
    }

    //missing a key
    if(hasMissingKey  === true)
    {
      return false;
    }
    else
    {
      let isValid = true;
      for(let i=0; i<keys.length && isValid; i++)
      {
        const key = keys[i];
        let val = params[key.name];

        //number type
        if(key.type === "number")
        {
          val = parseInt(val);
          if(isNaN(val) || (key.check !== undefined && key.check(val) === false))
          {
            debug.log("invalid value for:", key.name);
            isValid = false;
          }
        }
        //all other types
        else if(typeof val != key.type || (key.check !== undefined && key.check(val) === false))
        { 
          debug.log("invalid value for:", key.name);
          isValid = false;
        }
      }

      // 1 or more param(s) is of the incorrect type or didn't pass the validation check
      if(!isValid)
      {
        return false;
      }
      else
      {
        return true;
      }

    }
  }
}

