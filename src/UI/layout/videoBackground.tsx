import React, { useEffect, useState } from "react";
import backgroundVideo from "../../assets/images/rocketlaunchland_2.mp4";
import "../../App.css";

const VideoBackground = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted id="video" className="video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
