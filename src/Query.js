
class Query
{
  static create(path, params)
  {
    let fullpath = "http://" + Query.host + path;
    if(!Query.isParamsEmpty(params))
    {
      fullpath += "?";
      for(let key in params)
      {
        fullpath += key + "=" + params[key] + "&";
      }
      fullpath.slice(0, -1); //remove last ampersand
    }
    return fullpath;
  }

  static isParamsEmpty(params) 
  {
    for(var key in params) {
      if(params.hasOwnProperty(key))
      {
        return false;
      }
            
    }
    return true;
  }
}

Query.host = "localhost:3001";

export default Query;
