

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
  static setRoute(id)
  {
    for(let i=0; i<Router.routes.length; i++)
    {
      if(Router.routes[i].id === id)
      {
        Router.routes[i].action();
        Router.route = Router.routes[i].id;
        window.history.pushState("", "title", Router.routes[i].dir);
        return true;
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
      let routeID = evt.target.getAttribute('route');
      if(routeID !== undefined && routeID != null)
      {
        Router.setRoute(routeID);
      }
    }
  }
}



Router.route = "";
Router.routes = [];

export default Router;