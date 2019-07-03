import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from "./LoginModal";

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
}

export default Events;
