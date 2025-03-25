import * as React from "react";

function ShareIcon(props: React.SVGProps<SVGAElement>) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="27" height="27" rx="4.5" fill="white" stroke="#434342" />
      <path d="M7.52344 6.04688L23.1653 12.4557" stroke="#434342" stroke-miterlimit="10" />
      <path d="M5.27344 23.1864L19.7158 14.4688" stroke="#434342" stroke-miterlimit="10" />
      <circle cx="8.08447" cy="5.66259" r="2.66259" fill="#FF5733" />
      <circle cx="20.8345" cy="12.3345" r="2.66259" fill="#FF5733" />
      <circle cx="6.66259" cy="22.3384" r="2.66259" fill="#FF5733" />
    </svg>
  )
}

export default ShareIcon;