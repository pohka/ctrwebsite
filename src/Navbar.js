import React, { Component } from 'react';
import './Navbar.css';
import Router from "./Router";
import Events from "./Events";

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

    if(Router.isMatchingPath(route.dir, window.location.pathname))
    {
      cls += " active";
    }

    if(route == null)
    {
      return null;
    }

    return (
      <a href={route.dir} className={cls} onClick={Router.handleClick} route={route.id} key={text}>{text.toUpperCase()}</a>
    );
  }

  loginClick(evt)
  {
    Events.setLoginIsHidden(false);
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
          <a className="btn nav-logo" href="/" onClick={Router.handleClick} route="root">CTR WORLD</a>
          {itemDOMs}
          <div className="btn nav-item nav-login" onClick={this.loginClick}>LOGIN</div>
        </div>
      </div>
    );
  }
}

Navbar.items = [];

export default Navbar;
