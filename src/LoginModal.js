import React, { Component } from 'react';
import "./LoginModal.css";
import GoogleLogin from 'react-google-login';
import Events from './Events';
import Store from "./Store";
import Cookies from 'react-cookies'

class LoginModal extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      option: "login",
      hasInput : false
    };

    Store.register.username = "";
    Store.register.day = "";
    Store.register.month = "";
    Store.register.year = "";
    Store.register.avatar = "";
    Store.register.country = "";
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
      onClick={func}
      >
      {text}
    </div>
    );
  }

  handleRegister(evt, comp)
  {
    // //send msg to server
    // const url = Query.create("/addUser", { token : tokenID })
    // fetch(url, { })
    // .then(function(res){
    //   if (res.status !== 200) {
    //     console.log('Looks like there was a problem. Status Code: ' +
    //       res.status);
    //     return;
    //   }
    //   else
    //   {
    //     return res.json();
    //   }
    // }).then(function(res){
    //   console.log("response:", res);
    // });

    //let form = document.getElementById("register-form");

    //let params = Store.register;
    let dob = new Date(Store.register.year, Store.register.month, Store.register.day);
    var params = Store.register;
    let loginToken = Cookies.load("login-token");
    params.token = loginToken;

    //todo: validate client side before sending to server
    //notification to fill missing fields
    //validate server side too

    console.log("params", params);
    //console.log(comp.state);
  }

  onInputChange(e, key, comp)
  {
    //number value
    if(e.target.getAttribute("number"))
    {
      if(!isNaN(e.target.value))
      {
        Store.register[key] = e.target.value;
        comp.setState({hasInput : !comp.state.hasInput });
      }
    }
    //text value
    else
    {
      Store.register[key] = e.target.value;
      comp.setState({hasInput : !comp.state.hasInput });
    }
  }

  render() {
    let content = [];

    if(this.state.option === "login")
    {
      content.push(<div key="google-btns">
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
      <form id="register-form">
        <label>Username</label>
        <input type="text" value={Store.register.username} onChange={(e)=>{this.onInputChange(e, "username", this)}}></input>
        <br></br>
        <label>Country</label>
        <select 
          value={Store.register.country}
          onChange={(e)=>{this.onInputChange(e, "country", this)}}
          >
          <option disabled>-</option>
          <option value="fr">France</option>
          <option value="ie">Ireland</option>
        </select>
        <br></br>

        <label>Date of Birth</label>
        <input type="text" 
          number="true"
          maxlength="2"
          placeholder="DD"  
          value={Store.register.day} onChange={(e)=>{this.onInputChange(e, "day", this)}}
          ></input>
        /

        <input type="text" 
          number="true"
          maxlength="2"
          placeholder="MM"  
          value={Store.register.month} 
          onChange={(e)=>{this.onInputChange(e, "month", this)}}
          ></input>
        /

        <input type="text" 
          number="true"
          maxlength="4"
          placeholder="YYYY"  
          value={Store.register.year} 
          onChange={(e)=>{this.onInputChange(e, "year", this)}}></input>
        <br></br>
        <label>Avatar</label>
        <select 
          value={Store.register.avatar}
          onChange={(e)=>{this.onInputChange(e, "avatar", this)}}
        >
          <option disabled>-</option>
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

        <GoogleLogin
          clientId="720355153565-m69ku08l8ec3lbs2p2al88jndqfvdbtp.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={Events.googleResponse}
          onFailure={Events.googleResponse}
          cookiePolicy={'single_host_origin'}
        />

        <div onClick={(e) => {this.handleRegister(e, this)}}>Submit</div>
      </form>
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