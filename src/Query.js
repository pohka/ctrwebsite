
class Query
{
  static create(path, params)
  {
    let fullPath = "http://" + Query.host + path;

    //if params is not empty
    if(!(Object.keys(params).length === 0 && params.constructor === Object))
    {
      fullPath += "?";
      let i=0;
      for(let key in params)
      {
        if(i>0)
        {
          fullPath += "&"
        }
        i++;

        fullPath += key + "=" + params[key];
      }

      return encodeURI(fullPath);
    }
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
