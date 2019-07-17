import React, { Component } from 'react';
import './Navbar.css';
import Router from "./Router";
import Events from "./Events";
import Cookies  from 'react-cookies';

class Navbar extends Component {
  constructor(props)
  {
    super(props);

    if(this.props.isLoggedIn)
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

    let isProfileMenuHidden = true;
    if(this.props.isProfileMenuHidden !== undefined)
    {
      isProfileMenuHidden = this.props.isProfileMenuHidden;
    }
    
    console.log("am i herd????")
    this.state = { 
      profileMenuHidden : isProfileMenuHidden
    };

    console.log("isloggedin:", this.props.isLoggedIn);

    console.log("username:", Cookies.load("username"));
    console.log("avatar:", Cookies.load("avatar"));
    
  }

  setIsProfileMenuHidden(isHidden)
  {
    console.log("test");
    this.setState({
      profileMenuHidden : isHidden
    });
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

  //tohgle profile menu visiblity 
  toggleProfileMenuClick(e, comp)
  {
    comp.setState({ profileMenuHidden : !comp.state.profileMenuHidden });
  }

  accountNavItem()
  {
    if(Events.isLoggedInCheck())
    {
      var username = Cookies.load("username");
      if(username === undefined)
      {
        username = "Account";
      }

      var avatar = Cookies.load("avatar");
      if(avatar === undefined)
      {
        avatar = "crash";
      }

      let avatarURL = "/img/avatars/" + avatar;

      //profile menu 
      var profileMenuItems = [];
      if(this.state.profileMenuHidden === false)
      {
        profileMenuItems.push(
            <a href="#" className="profile-menu-item">PROFILE</a>
        );

        profileMenuItems.push(
          <div className="profile-menu-item" onClick={Events.signOut}>LOG OUT</div>
        );
      }


    
      return(
        <div className="btn nav-login" id="profile-menu" onClick={(e)=>{ this.toggleProfileMenuClick(e, this); }}>
          {username.toUpperCase()}
          <div className="profile-menu">
            {profileMenuItems}
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
