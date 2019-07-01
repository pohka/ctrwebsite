

class Router
{
  static onLoad()
  {
    let pathName = window.location.pathname;
    for(let i=0; i<Router.routes.length; i++)
    {
      if(Router.routes[i].dir === pathName)
      {
        Router.route = Router.routes[i].id;
        Router.routes[i].action();
        break;
      }
    }
  }

  //set the route and returns true if route with id was found
  static setRoute(id, target)
  {
    if(id !== Router.route)
    {
      for(let i=0; i<Router.routes.length; i++)
      {
        if(Router.routes[i].id === id)
        {
          Router.routes[i].action(target);
          Router.route = Router.routes[i].id;
          
          let path = Router.routes[i].dir;
          let matches = path.match(/{.*?\}/g);
          let missingKey = false;
          if(matches != null)
          {
            for(let a=0; a<matches.length; a++)
            {
              let key = matches[a].substring(1,matches[a].length-1); //remove 2 brackets
              let val = target.getAttribute(key);
              if(val !== undefined && val != null)
              {
                path = path.replace(matches[a], val);
              }
              else
              {
                missingKey = true;
              }
            }
          }
          
          if(missingKey === false)
          {
            window.history.pushState("", "title", path);
            return true;
          }
        }
      }
    }
  }

  
  static handleClick(id, event)
  {
    this.setRoute(id);
    console.log(id, event);
  }

  static cc(evt)
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
        Router.setRoute(routeID, target);
      }
    }
  }
}



Router.route = "";
Router.routes = [];

export default Router;