import { useState, useEffect, useRef } from "react";

/**
 * Cycles through `words` with a typewriter effect.
 * Returns the current displayed text and a boolean indicating the cursor blink phase.
 */
export function useTypingEffect(words = [], {
  typeSpeed = 80,
  deleteSpeed = 50,
  pauseAfterType = 1800,
  pauseAfterDelete = 400,
} = {}) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[wordIndex];

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        const next = currentWord.slice(0, display.length + 1);
        setDisplay(next);

        if (next === currentWord) {
          // Finished typing — pause then start deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseAfterType);
          return;
        }
        timeoutRef.current = setTimeout(tick, typeSpeed + Math.random() * 40);
      } else {
        // Deleting
        const next = currentWord.slice(0, display.length - 1);
        setDisplay(next);

        if (next === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          timeoutRef.current = setTimeout(tick, pauseAfterDelete);
          return;
        }
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [display, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  return display;
}
