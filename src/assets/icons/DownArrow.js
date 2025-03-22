import React from "react";

const DownArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="40" height="60" viewBox="0 0 150 201">
      <defs>
        <filter id="filter" x="6" y="28" width="140" height="126" filterUnits="userSpaceOnUse">
          <feOffset result="offset" in="SourceAlpha"></feOffset>
          <feGaussianBlur result="blur" stdDeviation="4"></feGaussianBlur>
          <feFlood result="flood" floodOpacity="0.83"></feFlood>
          <feComposite result="composite" operator="in" in2="blur"></feComposite>
          <feBlend result="blend" in="SourceGraphic"></feBlend>
        </filter>
      </defs>
      <g style={{ fill: 'rgb(238, 238, 238)', filter: 'url(#filter)' }}>
        <path
          id="Triangle_2"
          data-name="Triangle 1"
          className="cls-2"
          d="M79.83,134.75a5,5,0,0,1-8.66,0L23.106,51.5a5,5,0,0,1,4.33-7.5h96.128a5,5,0,0,1,4.331,7.5Z"
          style={{ stroke: 'inherit', filter: 'none', fill: 'inherit' }}
        ></path>
      </g>
      <use xlinkHref="#Triangle_2" style={{ stroke: 'rgb(168, 168, 168)', filter: 'none', fill: 'none' }}></use>
    </svg>
  );
};

export default DownArrow;
