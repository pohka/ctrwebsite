import React, { Component } from 'react';
import './Navbar.css';
import Router from "./Router"

class Navbar extends Component {


  genItem(cls, routeID, text)
  {
    let route = null;
    for(let i=0; i<Router.routes.length && route == null; i++)
    {
      if(Router.routes[i].id === routeID)
      {
        route = Router.routes[i];
      }
    }

    if(route == null)
    {
      return null;
    }

    return (
      <a href={route.dir} className={cls}onClick={Router.handleClick} route={route.id}>{text}</a>
    );
  }

  render()
  {
    let itemDOMs = [];
    for(let i=0; i<Navbar.items.length; i++)
    {
      let item = this.genItem(Navbar.items[i].cls, Navbar.items[i].route, Navbar.items[i].text);
      if(item != null)
      {
        itemDOMs.push(item);
      }
    }

    return (
      <div className="Navbar">
        <div className="nav-container">
          {itemDOMs}
        </div>
      </div>
    );
  }
}

Navbar.items = [];

export default Navbar;
