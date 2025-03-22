import React from 'react'
import DownArrow from "../../assets/icons/DownArrow.js";
import UpArrow from "../../assets/icons/UpArrow.js";

interface ScrollProps {
    upRef: HTMLElement | any;
    downRef: HTMLElement  | any;
}

const Scroll: React.FC<ScrollProps> = ({upRef, downRef}) => {
    return ( <>
       <div className="scrollPosition">
          <div
            className="scroll"
            style={{ position: "relative", left: "12%"}}
            onClick={() =>
                upRef.scrollIntoView({ behavior: "smooth" })
            }
          >
            <UpArrow />
          </div>
          <div
            className="scroll"
            style={{ position: "relative", left: "12%" }}
            onClick={() =>
                downRef.scrollIntoView({ behavior: "smooth" })
            }
          >
            <DownArrow />
          </div>
        </div> 
    </>
    )
}

export default Scroll