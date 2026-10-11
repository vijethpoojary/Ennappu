"use client";

import { useCallback, useEffect, useState } from "react";
import { particles } from "@/lib/particles";
import CursorTrail from "./CursorTrail";
import FloatingHearts from "./FloatingHearts";
import Footer from "./Footer";
import Gallery from "./Gallery";
import Hero from "./Hero";
import HugKiss from "./HugKiss";
import Intro from "./Intro";
import Letter from "./Letter";
import NameBlast from "./NameBlast";
import Navbar from "./Navbar";
import Story from "./Story";

export default function Experience() {
  const [introDone, setIntroDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [blastKey, setBlastKey] = useState(0);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => particles.destroy();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", !introDone);
    return () => document.body.classList.remove("scroll-locked");
  }, [introDone]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setBlastKey((k) => k + 1);
  }, []);
  const handleFinish = useCallback(() => setIntroDone(true), []);
  const handleSkip = useCallback(() => {
    setRevealed(true);
    setIntroDone(true);
  }, []);
  const replay = useCallback(() => setBlastKey((k) => k + 1), []);

  return (
    <>
      <FloatingHearts />
      <CursorTrail />
      <div className="grain" aria-hidden />

      {!introDone && <Intro onReveal={handleReveal} onFinish={handleFinish} onSkip={handleSkip} />}

      <Navbar visible={introDone} />

      <main className="relative z-10">
        <Hero start={revealed} onReplay={replay} />
        <Story />
        <Gallery />
        <HugKiss />
        <Letter />
      </main>

      <Footer />
      <NameBlast playKey={blastKey} />
    </>
  );
}
