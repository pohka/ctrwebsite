import React, { Component } from 'react';
import './Leaderboard.css';

class LeaderboardEntry extends Component {
  render() {
    const entry = this.props.entry;

    return (
      <tr data-key={entry.id} >
        <td>{entry.rank}</td>
        <td>{entry.player}</td>
        <td>{entry.country}</td>
        <td>{entry.IGTimeString}</td>
        <td>{entry.driver}</td>
        <td>{entry.version}</td>
        <td>{entry.dateString}</td>
        <td>{entry.link}</td>
      </tr>
    );
  }
}

class Leaderboard extends Component {

  constructor(props)
  {
    super(props);

    this.props.entrys.forEach((entry) => {
      //convert time from string to number
      let time = parseInt(entry.time);
      if(!isNaN(time))
      {
        entry.time = time;
      }
      else
      {
        entry.time = Number.MAX_SAFE_INTEGER;
      }

      //generate in game time string (mm:ss:mmm)
      entry.IGTimeString = Leaderboard.convertToIGTString(entry.time);

      //generate date locale string
      let epoch = parseInt(entry.date);
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

        entry.dateString = dt.getFullYear() + "-" + month + "-" + day;
      }
      else
      {
        entry.dateString = "";
      }
    });

    //sort by fastest time by default
    Leaderboard.sortByKey(this.props.entrys, "time");
    //set rank value
    var count = 1;
    this.props.entrys.forEach((entry) => {
      entry.rank = count;
      count++;
    })
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

    this.props.entrys.forEach((entry) => {
      rows.push(
        <LeaderboardEntry
          entry={entry}
          key={entry.id}
        />
      );
    });

    return (
      <div>
        <h2>Crash Cove</h2>
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Country</th>
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


export default Leaderboard;
