import React, { Component } from 'react';
import "./LoginModal.css";
import GoogleLogin from 'react-google-login';
import Events from './Events';

class LoginModal extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      option: "login"
    };
  }

  handleOptionClick(option)
  {
    this.setState({option: option});
    console.log("setting state");
  }

  genMenuItem(option, text)
  {
    let cls = "login-menu-item";
    if(option === this.state.option)
    {
      cls += " active";
    }

    let func = (e)=>{this.handleOptionClick(option)};
    
    return(
    <div 
      className={cls}
      onClick={func}>
      {text}
    </div>
    );
  }

  render() {
    let content = [];

    if(this.state.option === "login")
    {
      content.push(<div>
        <GoogleLogin
          clientId="720355153565-m69ku08l8ec3lbs2p2al88jndqfvdbtp.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={Events.googleResponse}
          onFailure={Events.googleResponse}
          cookiePolicy={'single_host_origin'}
        />
        
       
        <a href="#" onClick={Events.signOut}>Sign out</a>
      </div>);
    }
    else
    {
      content.push(
      <div>
        <label>Username</label>
        <input type="text"></input>
        <br></br>
        <label>Country</label>
        <select placeholder="-">
          <option selected="selected" disabled="true">-</option>
          <option value="fr">France</option>
          <option value="ie">Ireland</option>
        </select>
        <br></br>
        <label>Date of Birth</label>
        <input type="text" pattern="[0-9]{2}" placeholder="DD"></input>
        /
        <input type="text" pattern="[0-9]{2}" placeholder="MM"></input>
        /
        <input type="text" pattern="[0-9]{4}" placeholder="YYYY"></input>
        <br></br>
        <label>Avatar</label>
        <select>
          <option selected="selected" disabled="true">-</option>
          <option value="crash">Crash</option>
          <option value="dingodile">Dingodile</option>
          <option value="coco">Coco</option>
          <option value="penta_penguin">Penta Penguin</option>
          <option value="ngin">N.Gin</option>
          <option value="cortex">Cortex</option>
          <option value="tiny">Tiny</option>
          <option value="polar">Polar</option>
          <option value="pura">Pura</option>
          <option value="ripper_roo">Ripper Roo</option>
          <option value="papu_papu">Papu Papu</option>
          <option value="komodo_joe">Komodo Joe</option>
          <option value="pinstripe">Pinstripe</option>
          <option value="fake_crash">Fake Crash</option>
          <option value="ntropy">N.Tropy</option>
          <option value="nitros_oxide">Nitros Oxide</option>
        </select>
        <br></br>
        <div>google sign in button here</div>
        <button>Submit</button>
      </div>
      );
    }

    return (
      
      <div>
        
        <div className="login-modal" data-hidden={this.props.isHidden}>
            <div className="login-menu">
              {this.genMenuItem("login", "Login")}
              {this.genMenuItem("register", "Register")}
            </div>
            <div className="login-content">{content}</div>
          <div className="login-modal-bg" onClick={(e)=>{Events.setLoginIsHidden(true)}}></div>
        </div>
      </div>
    );
  }
}

export default LoginModal;