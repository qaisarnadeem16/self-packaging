import React, { PureComponent, useState } from "react";
import { useTrail, animated, config } from "react-spring";


export default function Loading() {
  const dots = new Array(4);
  const [active, setActive] = useState(true);
  const trail = useTrail(dots.length, {
    // config: { mass: 5, tension: 300, friction: 20 },
    config: config.stiff,
    transform: active
      ? "translateY(-50px) scale(1.4)"
      : "translateY(0px) scale(1)",
    onRest: () => setActive(!active)
  });

  return (
    <div className="container">
      {trail.map(({ transform }, i) => (
        <animated.div key={i} className="dot" style={{ transform }} />
      ))}
    </div>
  );
}
