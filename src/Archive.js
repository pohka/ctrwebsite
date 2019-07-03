import React, { Component } from 'react';
import "./Archive.css"

class VideoPreview extends Component
{
  constructor(props)
  {
    super(props);
    this.videoID = this.props.link.youtubeID;
    if(this.props.link.params !== undefined)
    {
      this.videoID += "?";
      let count = 0;
      for(let key in this.props.link.params)
      {
        if(count > 0)
        {
          this.videoID += "&";
        }
        this.videoID += key + "=" + this.props.link.params[key];
        count++;
      }
    }
  }

  render(){

    //let src = "https://img.youtube.com/vi/"+this.props.link.youtubeID+"/hqdefault.jpg";
    let videoSrc = "https://www.youtube.com/embed/"+this.videoID;

    return(
      <div className="video-preview">
        <div className="video-media">
          <iframe src={videoSrc} 
            frameBorder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen" 
            msallowfullscreen="msallowfullscreen" 
            oallowfullscreen="oallowfullscreen" 
            webkitallowfullscreen="webkitallowfullscreen"
          ></iframe>
        </div>
        
        <div className="video-preview-text">
          <h2>{this.props.link.title}</h2>
          <div className="video-preview-desc">{this.props.link.desc}</div>
        </div>
      </div>
    );
  }
}

class Archive extends Component {


  render() {
    let links = [
      {
        title : "Beta Footage",
        youtubeID : "JhtGoNaR3yk",
        desc : "As with every other video game, Crash Team Racing has had ideas that were not included in the final release of the game. The following video tells the stories of what could have actually been at one point in the development. Unfortutnately, a lot of the stuff were cut either because of the low hardware limitations of the PlayStation 1 or some other undisclosed reasons. Many of these things vary from textures to extra parts of the tracks and additional, at times unique, features."
      },
      {
        title : "Japanese Version Unboxing",
        desc : "Unboxing video and showcasing the contents of Crash Bandicoot Racing, the NTSC-J version",
        youtubeID : "-Qqso45nOyQ"
      },
      {
        title : "Crazy Japanese Trailer",
        youtubeID : "xDlPZ-fPTYQ",
        desc : "A very rare, extrange and crazy Japanese Trailer extracted from Crash Bandicoot Carnival! Is a Review of the first Crash Bandicoot video games!",
        params : { start : 225 }
      },
      {
        title : "Making of Crash Team Racing",
        youtubeID : "GMHYrCZBmk0",
        desc : "Behind the scenes of Crash Team Racing - Naughty Dog's final Crash title"
      },
      {
        title : "Did You Know? CTR",
        youtubeID : "VUl-p8ZNmg0",
        desc : "Did You Know Gaming looks at some some secrets, history and Easter eggs from CTR! This video covers everything from when the game wasn't even a Crash Bandicoot title"
      }
    ];


    let rows = [];
    for(let i=0; i<links.length; i++)
    {
      rows.push(
        <VideoPreview link={links[i]} />
      );
    }

    return (
      <div className="video-preview-container">
        {rows}
      </div>
    );
  }
}

export default Archive;