import * as React from "react";

function ShareIcon(props: React.SVGProps<SVGAElement>){
    return(
        <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.25 15a3.752 3.752 0 00-2.918 1.418L8.85 12.99c.2-.645.2-1.335 0-1.98l5.482-3.427A3.75 3.75 0 1013.5 5.25c.003.335.054.669.15.99L8.167 9.668a3.75 3.75 0 100 4.665l5.483 3.427a3.59 3.59 0 00-.15.99A3.75 3.75 0 1017.25 15zm0-12a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm-12 11.25a2.25 2.25 0 110-4.499 2.25 2.25 0 010 4.499zm12 6.75a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z"
          fill="#292929"
        ></path>
      </svg>
    )
}

export default ShareIcon;