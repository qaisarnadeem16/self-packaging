import * as React from "react";

function SvgArrowDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="M16 22L6 12l1.4-1.4 8.6 8.6 8.6-8.6L26 12z" />
      <path fill="none" d="M0 0h32v32H0z" />
    </svg>
  );
}

export default SvgArrowDown;
