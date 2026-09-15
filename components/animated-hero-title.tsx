"use client";

import { useEffect, useState } from "react";

const titleVariants = [
  "Horizoncraft Legends",
  "Horizoncraft Ultimate",
  "Verticalcraft Legends",
  "Horizoncraft",
] as const;

const finalTitle = titleVariants.at(-1)!;

export function AnimatedHeroTitle() {
  const [animatedTitle, setAnimatedTitle] = useState<string>(titleVariants[0]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function wait(duration: number) {
      return new Promise<void>((resolve) => {
        timer = setTimeout(resolve, duration);
      });
    }

    async function erase(value: string) {
      for (let length = value.length - 1; length >= 0; length -= 1) {
        await wait(38);
        if (cancelled) return false;
        setAnimatedTitle(value.slice(0, length));
      }
      return true;
    }

    async function type(value: string) {
      for (let length = 1; length <= value.length; length += 1) {
        await wait(62);
        if (cancelled) return false;
        setAnimatedTitle(value.slice(0, length));
      }
      return true;
    }

    async function playAnimation() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        await wait(0);
        if (!cancelled) {
          setAnimatedTitle(finalTitle);
          setIsComplete(true);
        }
        return;
      }

      await wait(1100);

      for (let index = 1; index < titleVariants.length; index += 1) {
        if (!(await erase(titleVariants[index - 1]))) return;
        await wait(160);
        if (!(await type(titleVariants[index]))) return;

        if (index < titleVariants.length - 1) {
          await wait(900);
        }
      }

      if (!cancelled) setIsComplete(true);
    }

    void playAnimation();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <h1 className="hero-title">
      <span className="sr-only">Bem-vindo ao Horizoncraft</span>
      <span className="hero-title-prefix" aria-hidden="true">
        Bem-vindo ao
      </span>
      <span
        className={`hero-title-line${isComplete ? " is-complete" : ""}`}
        aria-hidden="true"
      >
        {titleVariants.slice(0, -1).map((title) => (
          <span
            className="hero-title-reserve hero-title-reserve-animated"
            key={title}
          >
            {title}
          </span>
        ))}
        <span className="hero-title-reserve hero-title-reserve-final">
          {finalTitle}
        </span>
        <span className="hero-title-live">
          <span className="hero-title-text">{animatedTitle}</span>
          {!isComplete && <span className="hero-title-cursor" />}
        </span>
      </span>
    </h1>
  );
}
