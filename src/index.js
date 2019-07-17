import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import './index.css';

//components
import Navbar from './Navbar';
import Leaderboard from './Leaderboard';
import Tracks from"./Tracks";
import Archive from "./Archive";
import Guide from "./Guide";
import Speedrun from "./Speedrun"
import LoginModal from './LoginModal';
import Home from "./home";


import * as serviceWorker from './serviceWorker';
import Router from './Router';
import Events from './Events';
import Cookies from "react-cookies";





Router.routes.push({
  title : "Home",
  id : "root",
  dir : "/",
  action : function(){

    ReactDOM.render(<Home/>, document.getElementById('body'));
  }
});

Router.routes.push({
  title : "Tracks",
  id : "tracks_root",
  dir : "/tracks",
  action : function(){

    ReactDOM.render(<Tracks/>, document.getElementById('body'));
  }
});

Router.routes.push({
  title : "Archive",
  id : "archive",
  dir : "/archive",
  action : function(){
    ReactDOM.render(<Archive />, document.getElementById('body'));
  }
})

var routeTrack = {
  title: "",
  id : "track",
  dir : "/track/:trackID",
  action : function(params){
    ReactDOM.render(<Leaderboard />, document.getElementById('body'));
  }
};
Router.routes.push(routeTrack);

Router.routes.push({
  title : "Guide",
  id : "guide",
  dir : "/guide",
  action : function(){
    ReactDOM.render(<Guide />, document.getElementById('body'));
  }
});

Router.routes.push({
  title : "Speedrun",
  id : "speedrun",
  dir : "/speedrun",
  action : function(){
    ReactDOM.render(<Speedrun />, document.getElementById('body'));
  }
})

Navbar.items = [
  {
    cls : "btn nav-item",
    route : "tracks_root",
    text : "Tracks"
  },
  {
    cls : "btn nav-item",
    route : "archive",
    text : "Archive"
  },
  {
    cls : "btn nav-item",
    route : "speedrun",
    text : "Speedruns"
  },
  {
    cls : "btn nav-item",
    route : "guide",
    text : "Guide"
  }
];

Router.onPathChange = Events.onRouteChange;

ReactDOM.render(<LoginModal isHidden="true" />, document.getElementById("modal-container"));


const token = Cookies.load("login-token");
const isLoggedIn = (token !== undefined);
var NAVBAR_COMP = ReactDOM.render(<Navbar isLoggedIn={isLoggedIn} />, document.getElementById('nav'));

document.addEventListener("click", function(e){
  let id = e.target.id;
  if(id !== undefined && id !== "profile-menu")
  {
    NAVBAR_COMP.setIsProfileMenuHidden(true);
  }
});


//ReactDOM.render(<Leaderboard entrys={ENTRYS} />, document.getElementById('body'));
Router.onLoad();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
