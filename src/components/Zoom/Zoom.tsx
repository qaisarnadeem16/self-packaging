import React from 'react'
import { FfZoomIn } from "../../assets/icons/FfZoomIn";
import { FfZoomOut } from "../../assets/icons/FfZoomOut";

interface ZoomProps {
  zoomIn: any;
  zoomOut: any;
}

const Zoom: React.FC<ZoomProps> = ({ zoomIn, zoomOut }) => {
  return (<div className="viewer_zoom">
    <div className="" style={{display:'felx', flexDirection:'column', alignItems:'center'}}>
      <div
        className=""
        style={{cursor:'pointer'}}
        onClick={() => zoomIn()}
      >
        <FfZoomIn />
      </div>

      <div className="ff_zoom_description">ZOOM</div>
    </div>

    <div className="" style={{display:'felx',flexDirection:'column', alignItems:'center'}}>
      <div
        className=""
        style={{cursor:'pointer'}}
        onClick={() => zoomOut()}
      >
        <FfZoomOut />
      </div>
      <div className="ff_zoom_description">ZOOM</div>
    </div>

    
  </div>
  )
}

export default Zoom