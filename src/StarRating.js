import { useState } from "react";
import PropTypes from 'prop-types'

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  fontSize: "20px",
};

const textStyle = {
  lineHeight: "1",
  margin: "0",
};

StarRating.protoTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number
}

export default function StarRating({
  maxRating = 5,
  color = "yellow",
  defaultRating = 0,
  onMovieRating = () => 0
 
}) {
  const starContainerStyle = {
    display: "flex",
    gap: "4px",
    cursor: "pointer",
    color: { color },
    // width: `${size}px`,
    // height: `${size}px`,
  };

  const [rating, setRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = function (rating) {
    setRating(rating);
    onMovieRating(rating);
  };

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span
            onClick={() => handleRating(i + 1)}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
           key = {i}
          >
            {hoverRating ? (
              hoverRating >= i + 1 ? (
                <span>🌟</span>
              ) : (
                <span>✨</span>
              )
            ) : rating >= i + 1 ? (
              <span>🌟</span>
            ) : (
              <span>✨</span>
            )}

            {/* {hoverRating || rating >= i + 1 ? (
              <span>
                {hoverRating ? (hoverRating >= i + 1 ? "🌟" : "✨") : "🌟"}
              </span>
            ) : (
              <span>✨</span>
            )} */}
          </span>
        ))}
      </div>
      <p style={textStyle}>{hoverRating || rating}</p>
    </div>
  );
}
