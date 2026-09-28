import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating, size = 16 }) => {
  const roundedRating = Math.round(rating * 10) / 10;
  const fullStars = Math.floor(roundedRating);
  const hasPartialStar = roundedRating % 1 !== 0;
  
  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={size} fill="#c8a45e" color="#c8a45e" />;
          } else if (i === fullStars && hasPartialStar) {
            // Partial star styling
            return <Star key={i} size={size} fill="none" color="#c8a45e" />;
          }
          return <Star key={i} size={size} fill="none" color="#333" />;
        })}
      </div>
      <span className="star-rating__value">{roundedRating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
