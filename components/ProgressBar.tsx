"use client";

import { useEffect, useState, useRef } from "react";

interface ProgressBarProps {
  isLoading: boolean;
}

// Estimated generation time in ms — bar fills to 90% in this time
const ESTIMATED_MS = 30_000;

export default function ProgressBar({ isLoading }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Reset and start
      setProgress(0);
      setVisible(true);

      const step = 100; // ms between ticks
      const increment = (90 / ESTIMATED_MS) * step;

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          // Slow down as it approaches 90%
          const remaining = 90 - prev;
          const next = prev + increment * (remaining / 90 + 0.1);
          return Math.min(next, 90);
        });
      }, step);
    } else {
      // Complete and hide
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progress > 0) {
        setProgress(100);
        hideRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 600);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  if (!visible) return null;

  const isComplete = progress >= 100;

  return (
    <div className="h-0.5 w-full bg-gray-800 relative overflow-hidden">
      <div
        className={`h-full transition-all ${isComplete ? "duration-300" : "duration-100"} ease-out`}
        style={{
          width: `${progress}%`,
          background: isComplete
            ? "#22c55e"
            : "linear-gradient(90deg, #4f6ef7, #818cf8)",
        }}
      />
    </div>
  );
}
