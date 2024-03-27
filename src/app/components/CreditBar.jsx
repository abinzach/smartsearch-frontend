import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularMeter = ({ credits, totalCredits }) => {
  // Calculate the percentage of remaining credits
  const percentage = (credits / totalCredits) * 100;
  return (
    <div title="Credits" style={{ width: 25, height: 25 }}>
      <CircularProgressbar
        value={percentage}
        text={credits}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#d4b665", // Adjust the color as per your design
          trailColor: "#f2f2f2",
          textSize: "40px"
        })}
      />
    </div>
  );
};

export default CircularMeter;
