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
    let alt = track.name +" preview";

    const routeID = "track";
    let route = Router.getRouteByID(routeID);
    let path = Router.buildPathFromParams(route.dir, {trackID : track.id });

    return (
    <a className="btn track" href={path} onClick={Router.handleClick} route={routeID} key={track.name}>
      <div className="track-img-con">
        <img src={src} alt={alt} draggable="false"></img>
      </div>
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

  static getTrackNameByID(trackID)
  {
    for(let i=0; i<TRACKS_DATA.length; i++)
    {
      if(TRACKS_DATA[i].id === trackID)
      {
        return TRACKS_DATA[i].name;
      }
    }
    return "";
  }
}

export default Tracks;
