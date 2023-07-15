import { AnimatedDiv, AnimatedSpan } from 'app/components/Animated';
import React from 'react';

const loadingContainer = {
  width: '2rem',
  display: 'flex',
  justifyContent: 'space-around'
};

const loadingCircle = {
  // display: 'block',
  // width: '0.5rem',
  // height: '0.5rem',
  // backgroundColor: 'black',
  // borderRadius: '0.25rem',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#05090E'
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2
    }
  },
  end: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const loadingCircleVariants = {
  start: {
    opacity: 1
  },
  end: {
    opacity: 0.2
  }
};

const loadingCircleTransition = {
  duration: 1.5,
  yoyo: Infinity,
  ease: 'easeInOut'
};

export default function ThreeDotsLoading() {
  return (
    <AnimatedDiv
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial='start'
      animate='end'
    >
      <AnimatedSpan
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      >
        .
      </AnimatedSpan>
      <AnimatedSpan
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      >
        .
      </AnimatedSpan>
      <AnimatedSpan
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      >
        .
      </AnimatedSpan>
    </AnimatedDiv>
  );
}
