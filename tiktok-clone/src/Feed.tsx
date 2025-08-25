import React, { useEffect, useMemo, useRef, useState } from "react";
import sample1 from "./assets/videos/sample1.mp4";
import sample2 from "./assets/videos/sample2.mp4";
import sample3 from "./assets/videos/sample3.mp4";
import sample4 from "./assets/videos/sample4.mp4";
import sample5 from "./assets/videos/sample5.mp4";
import sample6 from "./assets/videos/sample6.mp4";

const Feed: React.FC = () => {
  const videos = useMemo(
    () => [sample1, sample2, sample3, sample4, sample5, sample6],
    []
  );
  const [idx, setIdx] = useState<number>(0);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState<{ x: string; y: string }>({
    x: "50%",
    y: "50%",
  });
  const [paused, setPaused] = useState(false);
  const clickTimeout = useRef<number | null>(null);

  // Single click → pause/play
  const handleClick = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = window.setTimeout(() => {
      if (!vidRef.current) return;
      if (paused) {
        vidRef.current.play();
      } else {
        vidRef.current.pause();
      }
      setPaused(!paused);
    }, 200); // delay to distinguish from double click
  };

  // Double click → zoom at click position
  const handleDoubleClick = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    const rect = (e.target as HTMLVideoElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    setOrigin({ x: `${xPercent}%`, y: `${yPercent}%` });
    setZoomed((z) => !z);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => (i + 1) % videos.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => (i - 1 + videos.length) % videos.length);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [videos.length]);

  // Auto-play video on idx change
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();
    return () => v.removeEventListener("canplay", tryPlay);
  }, [idx]);

  return (
    <div className="feed-shell">
      <video
        key={idx}
        ref={vidRef}
        src={videos[idx]}
        className={`feed-video ${zoomed ? "zoomed" : ""}`}
        muted={false} // allow sound
        loop
        playsInline
        autoPlay
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          transformOrigin: `${origin.x} ${origin.y}`,
        }}
      />
      <div className="overlay">
        <div className="badge">/feed</div>
        <div className="hint">↑ / ↓ to switch</div>
        <div className="hint">{paused ? "Paused ⏸" : "Playing ▶️"}</div>
      </div>
    </div>
  );
};

export default Feed;
