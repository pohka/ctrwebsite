import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from "./LoginModal";
import Navbar from './Navbar';
import Cookies from 'react-cookies'
import Query from "./Query"
import Store from "./Store"

class Events
{
  static setLoginIsHidden(isHidden)
  {
    ReactDOM.render(<LoginModal isHidden={isHidden}/>, document.getElementById("modal-container"));
  }

  static loginStatusChanged()
  {
    const token = Cookies.load("login-token");
    const isLoggedIn = (token !== undefined);
    ReactDOM.render(<Navbar isLoggedIn={isLoggedIn} />, document.getElementById('nav'));
  }

  static isLoggedInCheck()
  {
    const token = Cookies.load("login-token");
    return (token !== undefined);
  }

  static googleResponse(response)
  {
    if(response.error === undefined)
    {
      var profile = response.getBasicProfile();
      var tokenID = response.getAuthResponse().id_token;

      const MS_IN_DAY = 86400000;
      let expireDate = new Date(Date.now() + (14*MS_IN_DAY));
      Cookies.save(
        "login-token", 
        tokenID,
        {
          path: '/',
          expires : expireDate
        }
      );

      //todo: send token to server
      //store email when registering

      console.log(profile);
      const email = profile.U3;

      Store.register.email = email;
    }
    else
    {
      console.log("login error", response);
    }
    
  }

  static signOut()
  {
    console.log("signed out");
    const token = Cookies.load("login-token");
    if(token !== undefined)
    {
      //notify database of user logged out
      const url = Query.create("/logout", {token : token});
      console.log("url:", url);
      Query.fetch(url, (result)=>{
        console.log("result:", result);
      });
    }

    //remove cookies
    Cookies.remove("login-token");
    Cookies.remove("avatar");
    Cookies.remove("username");

    Events.loginStatusChanged();
  }

  static onRouteChange()
  {
    ReactDOM.render(<Navbar />, document.getElementById("nav"));
  }
}

export default Events;
