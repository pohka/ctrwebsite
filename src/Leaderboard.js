import React, { Component } from 'react';
import './Leaderboard.css';
import "./Router";
import Router from './Router';
import Tracks from "./Tracks";
import Flag from "react-flags";

class LeaderboardEntry extends Component {

  render() {
    const entry = this.props.entry;
    if(entry === undefined)
    {
      return(
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      );
    }

    let linkData;
    if(entry.link === undefined || entry.link == null || entry.link.length === 0)
    {
      linkData = "N/A";
    }
    else
    {
      linkData = (<a href={entry.link}>link</a>);
    }

    let flagSrc = "/img/flags/flags-iso/shiny/32/" + entry.country_code.toUpperCase() + ".png";



    return (
      <tr>
        <td className="td-rank">#{entry.rank}</td>
        <td className="td-country"><img src={flagSrc}></img></td>
        <td className="td-player">{entry.player_name}</td>
        
        <td>{entry.IGTimeString}</td>
        <td>{entry.driver_name}</td>
        <td>{entry.version}</td>
        <td>{entry.dateString}</td>
        <td>{linkData}</td>
      </tr>
    );
  }
}


class Leaderboard extends Component {

  constructor(props)
  {
    super(props);
    this.entrys = [];
    Leaderboard.current = this;
    //var th = this;

    let params = Router.getParamsNow();
    this.trackName = Tracks.getTrackNameByID(params.trackID);
    let url = "http://localhost:3001/query/course/" + params.trackID;
    fetch(url, { })
    .then(function(response){
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      else
      {
        return response.json();
      }
    }).then(function(res){
      console.log("request result:", res.data);

      let currentRank = 1;
      for(let i=0; i<res.data.length; i++)
      {
        res.data[i].IGTimeString = Leaderboard.convertToIGTString(res.data[i].time);
        res.data[i].dateString = Leaderboard.genDateString(res.data[i].date);

        //rank will be the same for ties
        if(i === 0 || res.data[i].time !== res.data[i-1].time)
        {
          currentRank = i+1;
        }
        res.data[i].rank = currentRank;
      }

      Leaderboard.current.entrys = res.data;

      Leaderboard.current.forceUpdate();
    });
  }

  //generate date locale string
  static genDateString(timeStamp)
  {
    let dateString = "";
    let epoch = parseInt(timeStamp);
    if(!isNaN(epoch))
    {
      let dt = new Date(epoch);
      let month = (dt.getMonth() + 1);
      if(month < 10)
      {
        month = "0" + month;
      }
      let day = dt.getDate();
      if(day < 10)
      {
        day = "0" + day;
      }

      dateString = dt.getFullYear() + "-" + month + "-" + day;
    }

    return dateString;
  }


  //sort an array of objects by similar key
  static sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  //convert to in game time string (1:02:33)
  static convertToIGTString(time)
  {
    const t = parseInt(time);
    //invalid time value
    if(isNaN(t) || t===Number.MAX_SAFE_INTEGER)
    {
      return "N/A";
    }

    //add extra times
    let ms = t%1000;
    if(ms < 10)
    {
      ms = "00" + ms;
    }
    else if(ms < 100)
    {
      ms = "0" + ms;
    }
    let secs = parseInt((t%60000)/1000);
    if(secs < 10)
    {
      secs = "0" + secs;
    }
    let mins = parseInt(t/60000);

    return "" + mins + ":" + secs + ":" + ms;
  }


  render() {
    const rows = [];

    for(let i=0; i<this.entrys.length; i++)
    {
      let key = "row-" + i;
      rows.push(
        <LeaderboardEntry
          entry={this.entrys[i]}
          key={key}
        />
      );
    }

    //empty rows
    const MIN_ROWS = 10;
    for(let i=this.entrys.length; i<MIN_ROWS; i++)
    {
      let key = "empty-row-" + i;
      rows.push(<LeaderboardEntry key={key} />);
    }

    return (
      <div className="leaderboard-container">
        <h2>{this.trackName}</h2>
      <table className="leaderboard">
        <thead>
          <tr>
            <th className="td-rank"></th>
            <th className="td-country"></th>
            <th className="td-player"></th>
            <th>Time</th>
            <th>Driver</th>
            <th>Version</th>
            <th>Date</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      </div>
    );
  }
}

Leaderboard.current = null;


export default Leaderboard;
