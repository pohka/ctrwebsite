
module.exports = class URL
{
  static getParams(url)
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
}
