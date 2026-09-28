import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequest } from '../config/api';
import './Reviews.css';

const defaultReviews = [
  { id: 1, text: "An absolute masterpiece. The longevity and sillage are unparalleled.", name: "Eleanor V.", product: "Velora Noir", date: "Oct 2023", rating: 5 },
  { id: 2, text: "I've never received so many compliments. It's truly my signature scent now.", name: "James M.", product: "Velora Oud", date: "Sep 2023", rating: 5 },
  { id: 3, text: "Elegant, sophisticated, and perfectly balanced.", name: "Sophia L.", product: "Velora Bloom", date: "Aug 2023", rating: 5 }
];

const Reviews = () => {
  const [reviews, setReviews] = useState(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await apiRequest('/reviews');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadReviews();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="reviews">
      <div className="reviews__container">
        <div className="reviews__header">
          <span className="reviews__label">✦ TESTIMONIALS</span>
          <h2 className="reviews__title">The VELORA Experience</h2>
        </div>

        <div className="reviews__carousel">
          <button className="reviews__btn reviews__btn--prev" onClick={handlePrev}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="reviews__content-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="review-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="review-card__quote-mark">“</div>
                <p className="review-card__text">{reviews[currentIndex].text}</p>
                <div className="review-card__rating">
                  {[...Array(reviews[currentIndex].rating || 5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="review-card__author">
                  <div className="review-card__avatar">
                    {reviews[currentIndex].name.charAt(0)}
                  </div>
                  <div className="review-card__meta">
                    <span className="review-card__name">{reviews[currentIndex].name}</span>
                    <span className="review-card__product">{reviews[currentIndex].product} • {reviews[currentIndex].date}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="reviews__btn reviews__btn--next" onClick={handleNext}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="reviews__dots">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              className={`reviews__dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
