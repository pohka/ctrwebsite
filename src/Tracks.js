import React, { Component } from 'react';
import Router from "./Router";
import "./Tracks.css";

const TRACKS_DATA = [
  {
    name : "Crash Cove",
    id : "crashcove"
  },
  {
    name : "Roo Tubes",
    id : "rootubes"
  },
  {
    name : "Tiger Temple",
    id : "tigertemple"
  },
  {
    name : "Coco Park",
    id : "cocopark"
  },
  {
    name : "Mystery Caves",
    id : "mysterycaves"
  },
  {
    name : "Blizzard Bluff",
    id : "blizzardbluff"
  },
  {
    name : "Sewer Speedway",
    id : "sewerspeedway"
  },
  {
    name : "Dingo Canyon",
    id : "dingocanyon"
  },
  {
    name : "Papu Pyramid",
    id : "papupyramid"
  },
  {
    name : "Dragon Mines",
    id : "dragonmines"
  },
  {
    name : "Polar Pass",
    id : "polarpass"
  },
  {
    name : "Cortex Castle",
    id : "cortexcastle"
  },
  {
    name : "Tiny Arena",
    id : "tinyarena"
  },
  {
    name : "Hot Air Skyway",
    id : "hotairskyway"
  },
  {
    name : "N.Gin Labs",
    id : "nginlabs"
  },
  {
    name : "Oxide Station",
    id : "oxidestation"
  },
  {
    name : "Slide Coliseum",
    id : "slidecoliseum"
  },
  {
    name : "Turbo Track",
    id : "turbotrack"
  }
];

class Tracks extends Component
{
  genItem(track)
  {
    let src = "/img/" + track.id + ".png";
    let path = "/track/" + track.id;
    return (
    <a className="track" href={path} onClick={Router.cc} route="track" trackID={track.id}>
      <img src={src} alt=""></img>
      <div className="track-name">{track.name}</div>
    </a>);
  }

  render()
  {
    let items = [];
    for(let i=0; i<TRACKS_DATA.length; i++)
    {
      items.push(this.genItem(TRACKS_DATA[i]));
    }

    return (
      <div className="track-container">{items}</div>
    );
  }
}

export default Tracks;
