import React, { useEffect, useMemo, useRef, useState } from "react";
import sample1 from "./assets/videos/sample1.mp4";
import sample2 from "./assets/videos/sample2.mp4";

const Feed: React.FC = () => {
  const videos = useMemo(() => [sample1, sample2], []);
  const [idx, setIdx] = useState<number>(0);
  const vidRef = useRef<HTMLVideoElement | null>(null);

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
        className="feed-video"
        muted
        loop
        playsInline
        autoPlay
      />
      <div className="overlay">
        <div className="badge">/feed</div>
        <div className="hint">↑ / ↓ to switch</div>
      </div>
    </div>
  );
};

export default Feed;
