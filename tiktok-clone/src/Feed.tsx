// import React, { useEffect, useMemo, useRef, useState } from "react";
// import sample1 from "./assets/videos/sample1.mp4";
// import sample2 from "./assets/videos/sample2.mp4";
// import sample3 from "./assets/videos/sample3.mp4";
// import sample4 from "./assets/videos/sample4.mp4";
// import sample5 from "./assets/videos/sample5.mp4";
// import sample6 from "./assets/videos/sample6.mp4";

// const Feed: React.FC = () => {
//   const videos = useMemo(
//     () => [sample1, sample2, sample3, sample4, sample5, sample6],
//     []
//   );

//   const containerRef = useRef<HTMLDivElement>(null);
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

//   const [zoomed, setZoomed] = useState<number | null>(null); // index of zoomed video
//   const [origin, setOrigin] = useState<{ x: string; y: string }>({
//     x: "50%",
//     y: "50%",
//   });

//   const clickTimeout = useRef<number | null>(null);

//   // Handle single click (pause/play)
//   const handleClick = (index: number) => (e: React.MouseEvent<HTMLVideoElement>) => {
//     if (clickTimeout.current) clearTimeout(clickTimeout.current);

//     clickTimeout.current = window.setTimeout(() => {
//       const video = videoRefs.current[index];
//       if (!video) return;

//       if (video.paused) {
//         video.play().catch((err) => console.warn("Play failed:", err));
//       } else {
//         video.pause();
//       }
//     }, 200);
//   };

//   // Handle double click → zoom at position
//   const handleDoubleClick = (index: number) => (e: React.MouseEvent<HTMLVideoElement>) => {
//     if (clickTimeout.current) clearTimeout(clickTimeout.current);

//     const target = e.target as HTMLVideoElement;
//     const rect = target.getBoundingClientRect();
//     const offsetX = e.clientX - rect.left;
//     const offsetY = e.clientY - rect.top;

//     const xPercent = (offsetX / rect.width) * 100;
//     const yPercent = (offsetY / rect.height) * 100;

//     setOrigin({ x: `${xPercent}%`, y: `${yPercent}%` });
//     setZoomed(zoomed === index ? null : index); // toggle zoom only for this video
//   };

//   // Observe which video is in view
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const index = Number(entry.target.getAttribute("data-index"));
//           const video = videoRefs.current[index];
//           if (!video) return;

//           if (entry.isIntersecting) {
//             // Play this video
//             video.muted = false; // unmute when in view
//             video.play().catch((err) => console.warn("Auto-play failed:", err));
//           } else {
//             // Pause others
//             video.pause();
//           }
//         });
//       },
//       {
//         threshold: 0.8, // 80% visible to trigger
//       }
//     );

//     const currentRefs = videoRefs.current;
//     currentRefs.forEach((video) => {
//       if (video) observer.observe(video);
//     });

//     return () => {
//       currentRefs.forEach((video) => {
//         if (video) observer.unobserve(video);
//       });
//     };
//   }, []);

//   // Scroll to video on wheel/touch
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     let isScrolling = false;

//     const onWheel = (e: WheelEvent) => {
//       if (isScrolling) return;
//       e.preventDefault();

//       const index = Math.round(container.scrollTop / window.innerHeight);
//       let nextIndex = index;

//       if (e.deltaY > 0) {
//         nextIndex = Math.min(videos.length - 1, index + 1);
//       } else {
//         nextIndex = Math.max(0, index - 1);
//       }

//       isScrolling = true;
//       container.scrollTo({
//         top: nextIndex * window.innerHeight,
//         behavior: "smooth",
//       });

//       setTimeout(() => {
//         isScrolling = false;
//       }, 500); // prevent rapid scroll
//     };

//     container.addEventListener("wheel", onWheel, { passive: false });
//     return () => container.removeEventListener("wheel", onWheel);
//   }, [videos.length]);

//   return (
//     <div
//       ref={containerRef}
//       className="feed-container"
//       style={{
//         height: "100vh",
//         overflowY: "auto",
//         scrollSnapType: "y mandatory",
//         scrollBehavior: "smooth",
//         position: "relative",
//       }}
//     >
//       {videos.map((src, index) => (
//         <div
//           key={index}
//           data-index={index}
//           style={{
//             height: "100vh",
//             scrollSnapAlign: "start",
//             position: "relative",
//             backgroundColor: "#000",
//           }}
//         >
//           <video
//             ref={(el) => {
//               videoRefs.current[index] = el;
//             }}
//             src={src}
//             data-index={index}
//             className={`feed-video ${zoomed === index ? "zoomed" : ""}`}
//             muted={true} // mute initially; unmuted on view
//             loop
//             playsInline
//             onClick={handleClick(index)}
//             onDoubleClick={handleDoubleClick(index)}
//             style={{
//               width: "30%",
//               height: "100%",
//               objectFit: "cover",
//               transformOrigin: `${origin.x} ${origin.y}`,
//               transform: zoomed === index ? "scale(2)" : "scale(1)",
//               transition: "transform 0.3s ease",
//               cursor: "pointer",
//             }}
//           />

//           {/* Overlay UI */}
//           <div
//             className="overlay"
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               pointerEvents: "none",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//               padding: "16px",
//               color: "white",
//               fontSize: "14px",
//               fontFamily: "sans-serif",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <div className="badge" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "4px" }}>
//                 /feed
//               </div>
//               <div className="hint" style={{ background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "4px" }}>
//                 {zoomed === index ? "Tap to exit zoom" : "Double tap to zoom"}
//               </div>
//             </div>
//             <div className="hint" style={{ textAlign: "center" }}>
//               Swipe or scroll ▼
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Feed;