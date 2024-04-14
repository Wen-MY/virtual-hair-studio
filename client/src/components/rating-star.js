import React, { useState } from 'react';

const RatingStars = ({ rating, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarClick = (clickedRating) => {
    onRate(clickedRating);
  };

  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`fs-1 mx-2 ${starValue <= (hoverRating || rating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'}`}
            onMouseEnter={() => handleStarHover(starValue)}
            onMouseLeave={() => handleStarHover(0)}
            onClick={() => handleStarClick(starValue)}
          ></span>
        );
      })}
    </div>
  );
};

export default RatingStars;
