import React, { Component } from 'react';
import './Navbar.css';
import Router from "./Router";
import Events from "./Events";
import Cookies  from 'react-cookies';

class Navbar extends Component {
  constructor(props)
  {
    super(props);

    const token = Cookies.load("login-token");
    const isSignedIn = (token !== undefined);
    if(isSignedIn)
    {
      let username = Cookies.load("username");
      if(username === undefined)
      {
        username = "Profile";
      }
      
      let avatar = Cookies.load("avatar");
      if(avatar === undefined)
      {
        avatar = "crash";
      }

      this.username = username;
      this.avatar = avatar;
    }
    console.log("username:", );
    console.log("avatar:", Cookies.load("avatar"));
    this.isSignedIn = isSignedIn;


    this.setState({ signedIn : isSignedIn });
  }

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

  accountNavItem()
  {
    if(this.isSignedIn === true)
    {
      return(
        <div className="btn nav-login">
          {this.username}
          <div className="profile-menu">
            <a href="#" className="profile-menu-item">Profile</a>
            <div className="profile-menu-item" onClick={Events.signOut}>Log Out</div>
          </div>
        </div>
      );
    }
    else
    {
      return (<div className="btn nav-item nav-login" onClick={this.loginClick}>LOGIN</div>);
    }
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

    let account = this.accountNavItem();
    itemDOMs.push(account);

    return (
      <div className="Navbar">
        <div className="nav-container">
          <a className="btn nav-logo" href="/" onClick={Router.handleClick} route="root">CTR WORLD</a>
          {itemDOMs}
        </div>
      </div>
    );
  }
}

Navbar.items = [];

export default Navbar;
