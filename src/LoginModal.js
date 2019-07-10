import React, { Component } from 'react';
import "./LoginModal.css";
import GoogleLogin from 'react-google-login';
import Events from './Events';
import Store from "./Store";
import Cookies from 'react-cookies'
import Query from "./Query";

class LoginModal extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      option: "register",
      hasInput : false,
      showInvalid : false,
      invalid_username : false,
      invalid_dob : false,
      invalid_avatar : false,
      invalid_country : false,
      invalid_google : false
    };

    Store.register.username = "";
    Store.register.day = "";
    Store.register.month = "";
    Store.register.year = "";
    Store.register.avatar = "-";
    Store.register.country = "-";
    Store.register.email = "";

    this.errors = {
      username : "",
      country : "",
      dob : "",
      avatar : "",
      google : ""
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
      onClick={func}
      >
      {text}
    </div>
    );
  }

  handleRegister(evt, comp)
  {
    //validate client side before sending to server
    //--------------------------------------------------
    let validation = {};

    //User name validation
    validation.username = false;
    const MAX_USERNAME_LEN = 20;
    const MIN_USERNAME_LEN = 3;
    if(Store.register.username.length > MAX_USERNAME_LEN)
    {
      this.errors.username = "username too long";
    }
    else if(Store.register.username.length < MIN_USERNAME_LEN)
    {
      this.errors.username = "username too short";
    }
    else if(Store.register.username.match(/^[A-Za-z0-9_]+$/g) === null)
    {
      this.errors.username = "invalid characters used";
    }
    else
    {
      validation.username = true;
    }

    //country validation
    validation.country = false;
    if(Store.register.country.length <= 1)
    {
      this.errors.country = "no country selected";
    }
    else
    {
      validation.country = true;
    }


    //Date of birth validation
    const CURRENT_YEAR = new Date().getFullYear();
    let youngestYear = CURRENT_YEAR - 13;
    const oldestYear = 1900;
    validation.dob = false;
    if(isNaN(Store.register.year) || isNaN(Store.register.month) || isNaN(Store.register.day))
    {
      this.errors.dob = "invalid date";
    }
    else if(Store.register.year >= youngestYear)
    {
      this.errors.dob = "you must be over 13";
    }
    else if(Store.register.year <= oldestYear)
    {
      this.errors.dob = "invalid date";
    }
    else if(Store.register.month <= 0 || Store.register.month > 12 || Store.register.day > 31 || Store.register.day <=0)
    {
      this.errors.dob = "invalid date";
    }
    else 
    {
      validation.dob = true;
    }

    let dob = new Date(Store.register.year, Store.register.month, Store.register.day);

    

    //avatar validation
    validation.avatar = false;
    if(Store.register.avatar.length < 3)
    {
      this.errors.avatar = "avatar not selected";
    }
    else
    {
      validation.avatar = true;
    }

    //validation of google auth
    let loginToken = Cookies.load("login-token");
    validation.google = false;
    if(loginToken === undefined || Store.register.email.length <= 0)
    {
      this.errors.google = "account not linked";
    }
    else if(Store.register.email.match(/\S+@\S+\.\S+/) === null)
    {
      this.errors.google = "invalid email";
    }
    else
    {
      validation.google = true;
    }



    

    console.log("validation:", validation);

    comp.setState({
      showInvalid : true,
      invalid_username : !validation.username,
      invalid_country : !validation.country,
      invalid_dob : !validation.dob,
      invalid_avatar : !validation.avatar,
      invalid_google : !validation.google
    });

    //check if all valid
    let isAllValid = true;
    for(let key in validation)
    {
      if(validation[key] === false)
      {
        isAllValid = false;
      }
    }
    

    const dobDate = new Date(
      Store.register.year + " " +
      Store.register.month + " " +
      Store.register.day + " 00:00:00 UTC"
    );

    var params = {
      avatar : Store.register.avatar,
      country : Store.register.country,
      email : Store.register.email,
      dob : dobDate.getTime(),
      token : loginToken,
      username : Store.register.username
    };


    console.log("params", params);
    if(isAllValid)
    {
      //send to server
      //validated on server side too
      const url = Query.create("/addUser", params);
      console.log("url:", url);
      fetch(url, { })
      .then(function(res){
        if (res.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            res.status);
          return;
        }
        else
        {
          return res.json();
        }
      }).then(function(res){
        console.log("response:", res);

        if(res.error)
        {
          //todo: handle errors on client side
        }
        else if(res.success !== undefined && res.success === true)
        {
          //add cookies
          const MS_IN_DAY = 86400000;
          let expireDate = new Date(Date.now() + (14*MS_IN_DAY));
          Cookies.save(
            "avatar", 
            params.avatar,
            {
              path: '/',
              expires : expireDate
            }
          );
          Cookies.save(
            "username", 
            params.username,
            {
              path: '/',
              expires : expireDate
            }
          );

          //hide modal
          Events.setLoginIsHidden(true);
          

          //todo: send out global event
          //which will update navbar
        }
      });
      //validate server side too
      //wait for response and check if there was error or username is already taken
    }
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

  onUsernameInputChange(e, comp)
  {
    let val = e.target.value.replace(/\s+/g, "_");
    val = val.replace(/_+/g, "_");
    if(val.match(/^[A-Za-z0-9_]+$/g) !== null)
    {
      Store.register.username = val;
      comp.setState({hasInput : !comp.state.hasInput });
    }
  }

  genRegisterUserName()
  {
    let doms = [];
    doms.push(<label>Username</label>)
    
    if(this.state.showInvalid && this.state.invalid_username)
    {
     doms.push(<div className="invalid-field">* {this.errors.username}</div>);
    }

    doms.push(
        <input type="text" 
          value={Store.register.username}
          onChange={(e)=>{this.onUsernameInputChange(e, this)}}>
        </input>
    );

    return doms;
  }

  genRegisterCountry()
  {
    let doms = [];
    doms.push(<label>Country</label>);

    if(this.state.showInvalid && this.state.invalid_country)
    {
     doms.push(<div className="invalid-field">* {this.errors.country}</div>);
    }

    doms.push(
    <select 
      value={Store.register.country}
      onChange={(e)=>{this.onInputChange(e, "country", this)}}
      >
      <option disabled>-</option>
      <option value="fr">France</option>
      <option value="ie">Ireland</option>
    </select>
    );

    return doms;
  }


  genRegisterDOB()
  {
    let doms = [];
    doms.push(<label>Date of Birth</label>);

    if(this.state.showInvalid && this.state.invalid_dob)
    {
      doms.push(<div className="invalid-field">* {this.errors.dob}</div>);
    }

    doms.push(
      <div>
      <input type="text"
        className="dob2"
        number="true"
        maxLength="2"
        placeholder="DD"  
        value={Store.register.day} onChange={(e)=>{this.onInputChange(e, "day", this)}}
        ></input>
      /

      <input type="text" 
        className="dob2"
        number="true"
        maxLength="2"
        placeholder="MM"  
        value={Store.register.month} 
        onChange={(e)=>{this.onInputChange(e, "month", this)}}
        ></input>
      /

      <input type="text" 
        className="dob4"
        number="true"
        maxLength="4"
        placeholder="YYYY"  
        value={Store.register.year} 
        onChange={(e)=>{this.onInputChange(e, "year", this)}}></input>
        </div>
    );

    return doms;
  }

  genRegisterAvatar()
  {
    let doms = [];
    doms.push(<label>Avatar</label>);

    if(this.state.showInvalid && this.state.invalid_avatar)
    {
      doms.push(<div className="invalid-field">* {this.errors.avatar}</div>);
    }

    doms.push(
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
    );

    return doms;
  }

  genRegisterGoogle()
  {
    let doms = [];
    doms.push(
            <GoogleLogin
          className="google-btn"
          clientId="720355153565-m69ku08l8ec3lbs2p2al88jndqfvdbtp.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={Events.googleResponse}
          onFailure={Events.googleResponse}
          cookiePolicy={'single_host_origin'}
        />
    );

    if(this.state.showInvalid && this.state.invalid_google)
    {
        doms.push(<div className="invalid-field google-invalid">* {this.errors.google}</div>);
    }

    return doms;
  }

  genRegisterForm()
  {

    let inputs = [];

    inputs.push(this.genRegisterUserName());
    inputs.push(this.genRegisterCountry());
    inputs.push(this.genRegisterDOB());
    inputs.push(this.genRegisterAvatar());
    inputs.push(this.genRegisterGoogle());

    return(
      <div>
      <form id="register-form">
        {inputs}
      </form>
      <div className="submit" onClick={(e) => {this.handleRegister(e, this)}}>Submit</div>
    </div>
    );
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
      content.push(this.genRegisterForm());
    }


    return (
      <div>
        <div className="login-modal-bg" key="login-bg" onClick={(e)=>{Events.setLoginIsHidden(true)}} data-hidden={this.props.isHidden}></div>
        <div className="login-modal" data-hidden={this.props.isHidden}>
            
            <div className="login-menu">
              {this.genMenuItem("login", "Login")}
              {this.genMenuItem("register", "Register")}
            </div>
            <div className="login-content">{content}</div>
          
        </div>
      </div>
    );
  }
}

export default LoginModal;