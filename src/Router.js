

class Router
{
  static onLoad()
  {
    Router.setRouteFromPathName();
  }

  //returns true if the routeDir matched the path, taking url params into account
  static isMatchingPath(routeDir, pathName)
  {
    let a = routeDir.substring(1).split("/");
    let b = pathName.substring(1).split("/");
    if(a.length !== b.length)
    {
      return false;
    }

    let isMatch = true;
    for(let i=0; i<a.length && isMatch; i++)
    {
      //if string not a url param and they dont match
      let match = a[i].match(/{.*?\}/g);
      if(match == null && a[i] !== b[i])
      {
        isMatch = false;
      }
    }

    return isMatch;
  }

  static getParamsNow()
  {
    let route = Router.getRouteByID(Router.route);
    return Router.getParamsFromPath(route.dir, window.location.pathname);
  }

  //get a params object from the matching keys in dir
  static getParamsFromPath(routeDir, pathName)
  {
    //if pathName is href, remove the origin from the path
    pathName = pathName.replace(window.location.origin, "");

    let a = routeDir.substring(1).split("/");
    let b = pathName.substring(1).split("/");

    if(a.length !== b.length)
    {
      return null;
    }

    let params = {};
    
    for(let i=0; i<a.length; i++)
    {
      let match = a[i].match(/{.*?\}/g);
      if(match!=null)
      {
        let key = match[0].substring(1,match[0].length-1);
        params[key] = b[i];
      }
    }

    return params;
  }

  //use current url to set the route
  static setRouteFromPathName()
  {
    let pathName = window.location.pathname;
    let hasFoundMatch = false;
    for(let i=0; i<Router.routes.length && !hasFoundMatch; i++)
    {
      if(Router.isMatchingPath(Router.routes[i].dir, pathName))
      {
        let params = Router.getParamsFromPath(Router.routes[i].dir, pathName);
        Router.route = Router.routes[i].id;
        Router.routes[i].action(params);
        hasFoundMatch = true;
        if(Router.debugMode)
        {
          console.log("Changing path:", pathName, "dir:", Router.routes[i].dir, "params:", params);
        }
      }
    }

    if(!hasFoundMatch)
    {
      console.log("no route found that matches", pathName);
    }
  }

  //set the route and returns true if route with id was found
  static setRoute(id, params)
  {
    if(id !== Router.route)
    {
      for(let i=0; i<Router.routes.length; i++)
      {
        if(Router.routes[i].id === id)
        {
          Router.routes[i].action(params);
          Router.route = Router.routes[i].id;
          
          let path = Router.buildPathFromParams(Router.routes[i].dir, params)
          
          if(path != null)
          {
            if(Router.debugMode)
            {
              console.log("Changing path:", path, "dir:", Router.routes[i].dir, "params:", params);
            }
            window.history.pushState("", "title", path);
            return true;
          }
        }
      }
    }
  }

  //handle a click event for a link, requires a href
  static handleClick(evt)
  {
    //left click
    if(evt.button === 0)
    {
      evt.preventDefault();
      
      let routeID = evt.target.getAttribute("route");
      let target = evt.target;
      if(routeID == null)
      {
        routeID = evt.target.parentNode.getAttribute("route");
        target = evt.target.parentNode;
      }
      
      if(routeID !== undefined && routeID != null)
      {
        let route = Router.getRouteByID(routeID);
        if(route != null)
        {
          let params = Router.getParamsFromPath(route.dir, target.href);
          Router.setRoute(routeID, params);
        }
        else
        {
          console.log("route not found with id: ", routeID);
        }
      }
    }
  }


  //find a route by id, if not found returns null
  static getRouteByID(id)
  {
    for(let i=0; i<Router.routes.length; i++)
    {
      if(id === Router.routes[i].id)
      {
        return Router.routes[i];
      }
    }
    return null;
  }

  //replace url params in dir string with params obj
  //e.g. dir = "/track/{trackID}" params = { trackID : "crashcove"}
  static buildPathFromParams(dir, params)
  {
    let path = dir;
    let matches = dir.match(/{.*?\}/g);
    if(matches != null)
    {
      if(params == null)
      {
        console.log("params is null, when it requires match of keys:", matches);
        return null;
      }

      for(let a=0; a<matches.length; a++)
      {
        let key = matches[a].substring(1,matches[a].length-1);
        if(params[key] !== undefined && params[key] != null)
        {
          path = path.replace(matches[a], params[key]);
        }
        else
        {
          console.log("param not found for key:", key);
          return null;
        }
      }
    }
    return path;
  }
}

//event when back and forward buttons are pressed
window.onpopstate = function(evt) {
  Router.setRouteFromPathName();
}



Router.route = "";
Router.routes = [];
Router.debugMode = false; //optional

export default Router;