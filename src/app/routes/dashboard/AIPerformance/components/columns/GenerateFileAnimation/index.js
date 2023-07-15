import { useEffect, useState } from 'react';
import styles from './GenerateFileAnimation.module.scss';

const DOT_LENGTH = 2;
const TIME_IN_MILLESECONDS = 500;
export default function GenerateFileAnimation() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => {
        if (dots.length > DOT_LENGTH) return [];
        else dots.push('null');
        return [...dots];
      });
    }, TIME_IN_MILLESECONDS);
    return () => clearInterval(interval);
  }, []);

  const renderDots = dots.map(() => '.');

  return (
    <div className={styles.generateText}>Generating file {renderDots}</div>
  );
}
