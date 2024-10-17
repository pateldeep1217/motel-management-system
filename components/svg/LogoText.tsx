import React from "react";

const LogoText = ({ className = "", width = "306", height = "40" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <svg
        viewBox="0 0 106 40"
        width={width}
        height={height}
        className="fill-current"
        aria-label="StaySync Logo"
      >
        <g className="font-medium">
          <text
            x="13"
            y="26"
            className="text-white font-extrabold"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Stay
          </text>
          <text
            x="62"
            y="26"
            className="text-cyan-600 font-semibold"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Sync
          </text>
        </g>
      </svg>
    </div>
  );
};

export default LogoText;
