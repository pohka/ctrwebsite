import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from "./LoginModal";
import Navbar from './Navbar';
import Cookies from 'react-cookies'

class Events
{
  static setLoginIsHidden(isHidden)
  {
    ReactDOM.render(<LoginModal isHidden={isHidden}/>, document.getElementById("modal-container"));
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
    }
    else
    {
      console.log("login error", response);
    }
    
  }

  static signOut()
  {
    console.log("signed out");
    Cookies.remove("login-token");
    //todo: notify server that this user has logged out, then remove the token from database
  }

  static onRouteChange()
  {
    ReactDOM.render(<Navbar />, document.getElementById("nav"));
  }
}

export default Events;
