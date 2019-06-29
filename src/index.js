import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from './Navbar';
import Leaderboard from './Leaderboard';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Navbar />, document.getElementById('nav'));


const ENTRYS = [
  {id:"1", player:"john", country: "ie", time:"80000", driver:"coco", version: "NTSC-J", date:"1331761803979", link:""},
  {id:"2", player:"bob", country: "fr", time:"104000", driver:"coco", version: "NTSC-J", date:"1561558803979", link:""},
  {id:"3", player:"reallllllllly longnnnngnameeee", country: "au", time:"102000", driver:"coco", version: "NTSC-J", date:"1541561803979", link:""},
  {id:"4", player:"jsir", country: "ie", time:"102000", driver:"coco", version: "NTSC-J", date:"1561551803979", link:""},
  {id:"5", player:"pepe", country: "ie", time:"121600", driver:"dingodile", version: "PAL", date:"1561560803979", link:""},
];

ReactDOM.render(<Leaderboard entrys={ENTRYS} />, document.getElementById('body'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
