import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from "./LoginModal";
import Navbar from './Navbar';

class Events
{
  static setLoginIsHidden(isHidden)
  {
    ReactDOM.render(<LoginModal isHidden={isHidden}/>, document.getElementById("modal-container"));
  }

  static googleResponse(response)
  {
    console.log(response);
  }

  static signOut()
  {
    console.log("signed out");
  }

  static onRouteChange()
  {
    ReactDOM.render(<Navbar />, document.getElementById("nav"));
  }
}

export default Events;
