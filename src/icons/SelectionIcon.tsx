import * as React from "react";

function SelectionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      data-testid="check-icon"
    >
      <path d="M14 21.414l-5-5.001L10.413 15 14 18.586 21.585 11 23 12.415l-9 8.999z"></path>
      <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm0 26a12 12 0 1112-12 12 12 0 01-12 12z"></path>
      <path
        data-name="<Transparent Rectangle>"
        fill="none"
        d="M0 0h32v32H0z"
      ></path>
    </svg>
  );
}

export default SelectionIcon;