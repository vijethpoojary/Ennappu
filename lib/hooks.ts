"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { graphemes, isMobileDevice } from "./utils";

/** Typewriter that reveals one grapheme at a time once `start` is true. */
export function useTypewriter(text: string, start: boolean, speed = 70) {
  const reduced = useReducedMotion();
  const chars = useMemo(() => graphemes(text), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setCount(chars.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= chars.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [start, reduced, chars, speed]);

  return { text: chars.slice(0, count).join(""), done: count >= chars.length };
}

/** True on phones / touch devices. Starts false to keep server and client markup identical. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setMobile(isMobileDevice());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

/** setTimeout that is cleared automatically on unmount. */
export function useTimers() {
  const ids = useRef<number[]>([]);
  useEffect(() => {
    const list = ids.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);
  return useMemo(
    () => (fn: () => void, ms: number) => {
      ids.current.push(window.setTimeout(fn, ms));
    },
    [],
  );
}
