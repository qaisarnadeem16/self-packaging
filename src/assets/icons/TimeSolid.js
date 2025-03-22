import React from "react";

const TimesSolid = React.forwardRef((props, svgRef) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    ref={svgRef}
    aria-labelledby={props.titleId}
    {...props}
  >
    {props.title ? <title id={props.titleId}>{props.title}</title> : null}
    <path d="M7.21875 5.78125 L5.78125 7.21875 L14.5625 16 L5.78125 24.78125 L7.21875 26.21875 L16 17.4375 L24.78125 26.21875 L26.21875 24.78125 L17.4375 16 L26.21875 7.21875 L24.78125 5.78125 L16 14.5625 Z" />
  </svg>
));

export default TimesSolid;