"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";

const ROTATION_RANGE = 10.5;
const HALF_ROTATION_RANGE = 10.5 / 2;

const Card = ({ result }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const [expandedIndexes, setExpandedIndexes] = useState([]);

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const { title, source, page_content } = result;

  const handleClick = () => {
    window.open(source, "_blank");
  };

 const formatContent = (content, index) => {
  // Split content into paragraphs
  const paragraphs = content.split("\n\n");

  // Truncate each paragraph to 50 words if not expanded
  const truncatedParagraphs = paragraphs.map(
    (paragraph) =>
      expandedIndexes.includes(index)
        ? paragraph // Not truncated if expanded
        : paragraph.split(" ").slice(0, 50).join(" ") // Truncate to 50 words
  );

  // Check if any paragraph is truncated
  const isTruncated = truncatedParagraphs.some(
    (truncatedParagraph, i) => truncatedParagraph !== paragraphs[i]
  );

  // Render Read More button only if content is truncated
  const readMoreButton =
    isTruncated && (
      <button
        className="text-blue-500 text-sm hover:underline focus:outline-none"
        onClick={() => handleExpand(index)}
      >
        Read More
      </button>
    );

  // Map each paragraph to include line breaks and Read More button
  const formattedContent = truncatedParagraphs.map(
    (truncatedParagraph, i) => (
      <p key={i} className="mb-2">
        {/* Split each truncated paragraph into lines */}
        {truncatedParagraph.split("\n").map((line, j) => (
          <div className="text-black cursor-default" key={j}>
            {line}
            <br />
          </div>
        ))}
        {/* Render Read More button for the last paragraph if truncated */}
        {i === truncatedParagraphs.length - 1 && readMoreButton}
      </p>
    )
  );

  return formattedContent;
};

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative my-5 h-96 w-full  rounded-xl bg-gradient-to-br from-pink-700/30 to-violet-300/30"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute cursor-default inset-4 overflow-y-scroll p-10 grid rounded-xl bg-gray-100 shadow-lg"
      >
        <h3 className="lg:text-lg text-black font-semibold mb-2">{title}</h3>
        <p className="text-sm underline text-indigo-600">{source}</p>
        <div className="text-black text-sm lg:text-md mb-2">{formatContent(page_content)}</div>
        <button
          className="bg-indigo-500 h-10 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleClick}
        >
          Open Link
        </button>
      </div>
    </motion.div>
  );
};

export default Card;
