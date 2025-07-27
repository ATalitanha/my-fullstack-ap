// const CosmicLoader = () => (
//   <div className="flex flex-col items-center justify-center h-40 bg-black rounded-xl p-8 select-none">
//     <div className="relative w-24 h-24 perspective-1000">
//       {/* حلقه سه بعدی چرخان */}
//       <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin-3d shadow-neon"></div>
//       <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-purple-400 animate-spin-3d-reverse shadow-neon-soft"></div>
//       {/* مرکز ضربان دار */}
//       <div className="absolute inset-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse shadow-glow-pulse"></div>
//       {/* ذرات نوری پراکنده */}
//       <Particles />
//     </div>

//     <span className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-2xl font-extrabold animate-text-glow">
//       Preparing the Universe...
//     </span>

//     <style>{`
//       .perspective-1000 {
//         perspective: 1000px;
//       }
//       @keyframes spin3d {
//         0% {
//           transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
//         }
//         100% {
//           transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
//         }
//       }
//       @keyframes spin3dReverse {
//         0% {
//           transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
//         }
//         100% {
//           transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
//         }
//       }
//       .animate-spin-3d {
//         animation: spin3d 4s linear infinite;
//         border-top-color: #60a5fa; /* blue-400 */
//       }
//       .animate-spin-3d-reverse {
//         animation: spin3dReverse 6s linear infinite;
//         border-top-color: #a78bfa; /* purple-400 */
//       }
//       @keyframes textGlow {
//         0%, 100% {
//           filter: drop-shadow(0 0 10px #ec4899) drop-shadow(0 0 20px #8b5cf6);
//         }
//         50% {
//           filter: drop-shadow(0 0 20px #f472b6) drop-shadow(0 0 30px #c084fc);
//         }
//       }
//       .animate-text-glow {
//         animation: textGlow 3s ease-in-out infinite;
//       }
//       @keyframes pulseGlow {
//         0%, 100% {
//           box-shadow:
//             0 0 10px 3px #ec4899,
//             0 0 20px 6px #8b5cf6;
//           transform: scale(1);
//         }
//         50% {
//           box-shadow:
//             0 0 15px 6px #f472b6,
//             0 0 25px 10px #c084fc;
//           transform: scale(1.15);
//         }
//       }
//       .shadow-neon {
//         box-shadow:
//           0 0 12px 3px #3b82f6,
//           0 0 25px 6px #60a5fa;
//       }
//       .shadow-neon-soft {
//         box-shadow:
//           0 0 10px 2px #a78bfa,
//           0 0 20px 4px #c084fc;
//       }
//       .shadow-glow-pulse {
//         animation: pulseGlow 2.5s ease-in-out infinite;
//       }
//     `}</style>
//   </div>
// );

// // ذرات نورانی پراکنده — یه کامپوننت ساده با چند دایره متحرک
// const Particles = () => {
//   const particleCount = 10;
//   const particles = Array.from({ length: particleCount });

//   return (
//     <>
//       {particles.map((_, i) => (
//         <div
//           key={i}
//           className="absolute bg-pink-400 rounded-full opacity-70"
//           style={{
//             width: 6,
//             height: 6,
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//             animation: `particleMove${i} 4s ease-in-out infinite alternate`,
//             animationDelay: `${i * 0.4}s`,
//             boxShadow: "0 0 8px 2px #ec4899",
//           }}
//         />
//       ))}

//       <style>
//         {Array.from({ length: particleCount })
//           .map(
//             (_, i) => `
//           @keyframes particleMove${i} {
//             0% { transform: translate(0, 0); opacity: 0.7; }
//             50% { transform: translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px); opacity: 1; }
//             100% { transform: translate(0, 0); opacity: 0.7; }
//           }
//         `
//           )
//           .join("\n")}
//       </style>
//     </>
//   );
// };

// export default CosmicLoader;

// const AlienImpossibleLoader = () => (
//   <div className="flex flex-col items-center justify-center h-44 bg-gradient-to-tr from-black via-gray-900 to-black rounded-3xl p-10 select-none overflow-hidden relative">
//     {/* پس زمینه نوری متحرک */}
//     <div className="absolute inset-0 bg-gradient-radial from-purple-900 via-black to-transparent opacity-60 animate-backgroundGlow"></div>

//     <div className="relative w-28 h-28">
//       {/* شکل مرکزی — چندضلعی غیرمنظم با انیمیشن چرخش و تغییر شکل */}
//       <div className="absolute inset-0">
//         <svg
//           viewBox="0 0 100 100"
//           className="w-full h-full animate-rotateAlien"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <polygon
//             points="50,10 85,30 90,70 60,90 30,85 15,50 30,15"
//             fill="url(#gradientAlien)"
//             filter="url(#glowAlien)"
//           />
//           <defs>
//             <radialGradient id="gradientAlien" cx="50%" cy="50%" r="50%">
//               <stop offset="0%" stopColor="#00ffea" />
//               <stop offset="100%" stopColor="#00474f" />
//             </radialGradient>
//             <filter id="glowAlien" x="-50%" y="-50%" width="200%" height="200%">
//               <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00fff9" floodOpacity="0.8" />
//               <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#00a8b5" floodOpacity="0.6" />
//             </filter>
//           </defs>
//         </svg>
//       </div>

//       {/* چند دایره نئونی با انیمیشن‌های نامتقارن */}
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute rounded-full border-2 border-[#00fff9] opacity-70"
//           style={{
//             width: 48 - i * 10,
//             height: 48 - i * 10,
//             top: (i * 10) / 2,
//             left: (i * 10) / 2,
//             animation: `alienPulse${i} ${2 + i * 0.5}s ease-in-out infinite alternate`,
//             borderColor: `hsl(${(i * 90) % 360}, 100%, 60%)`,
//           }}
//         />
//       ))}
//     </div>

//     {/* متن با افکت glitch و انیمیشن */}
//     <div className="mt-8 relative text-cyan-400 font-extrabold text-3xl tracking-wide glitch-text select-none">
//       <span>Loading...</span>
//       <span aria-hidden="true" className="glitch-copy">
//         Loading...
//       </span>
//       <span aria-hidden="true" className="glitch-copy glitch-copy-2">
//         Loading...
//       </span>
//     </div>

//     <style>{`
//       /* انیمیشن چرخش شکل مرکزی */
//       @keyframes rotateAlien {
//         0% { transform: rotate3d(1, 1, 0, 0deg) scale(1); }
//         50% { transform: rotate3d(1, 1, 0, 180deg) scale(1.1); }
//         100% { transform: rotate3d(1, 1, 0, 360deg) scale(1); }
//       }
//       .animate-rotateAlien {
//         animation: rotateAlien 8s ease-in-out infinite;
//         transform-origin: 50% 50%;
//       }

//       /* پالس دایره‌ها */
//       ${[...Array(4)]
//         .map(
//           (_, i) => `
//           @keyframes alienPulse${i} {
//             0%, 100% {
//               opacity: 0.7;
//               transform: scale(1);
//               box-shadow: 0 0 ${4 + i * 4}px ${2 + i}px hsl(${(i * 90) % 360}, 100%, 70%);
//             }
//             50% {
//               opacity: 1;
//               transform: scale(1.15);
//               box-shadow: 0 0 ${8 + i * 8}px ${4 + i * 2}px hsl(${(i * 90 + 45) % 360}, 100%, 80%);
//             }
//           }
//         `
//         )
//         .join("\n")}

//       /* پس زمینه نوری متحرک */
//       @keyframes backgroundGlow {
//         0%, 100% { background-position: 0% 50%; }
//         50% { background-position: 100% 50%; }
//       }
//       .animate-backgroundGlow {
//         background-size: 200% 200%;
//         animation: backgroundGlow 12s ease-in-out infinite;
//       }

//       /* افکت glitch متن */
//       .glitch-text {
//         position: relative;
//         color: #00fff9;
//         text-transform: uppercase;
//         letter-spacing: 0.15em;
//       }
//       .glitch-text .glitch-copy {
//         position: absolute;
//         top: 0; left: 0;
//         width: 100%;
//         height: 100%;
//         color: #00fff9;
//         overflow: hidden;
//         clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
//         animation: glitch 2s infinite;
//       }
//       .glitch-text .glitch-copy-2 {
//         clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
//         animation-delay: 1s;
//       }
//       @keyframes glitch {
//         0% {
//           transform: translate(0);
//           opacity: 1;
//         }
//         20% {
//           transform: translate(-2px, 2px);
//           opacity: 0.8;
//         }
//         40% {
//           transform: translate(2px, -2px);
//           opacity: 1;
//         }
//         60% {
//           transform: translate(-2px, 2px);
//           opacity: 0.9;
//         }
//         80% {
//           transform: translate(2px, -2px);
//           opacity: 1;
//         }
//         100% {
//           transform: translate(0);
//           opacity: 1;
//         }
//       }
//     `}</style>
//   </div>
// );

// export default AlienImpossibleLoader;


// const DivineAweLoader = () => (
//   <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-black via-purple-900 to-black rounded-3xl p-12 select-none relative overflow-hidden">
//     {/* حلقه‌های درخشان و متحرک */}
//     <svg
//       className="absolute inset-0 w-full h-full"
//       viewBox="0 0 200 200"
//       xmlns="http://www.w3.org/2000/svg"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       <defs>
//         <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
//           <stop offset="0%" stopColor="#fff" stopOpacity="1" />
//           <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
//         </radialGradient>
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
//           <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#a78bfa" floodOpacity="0.7" />
//           <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#c4b5fd" floodOpacity="0.5" />
//           <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#d8b4fe" floodOpacity="0.3" />
//         </filter>
//       </defs>

//       {/* لایه‌های پیچیده دایره‌ای */}
//       {[...Array(5)].map((_, i) => {
//         const r = 20 + i * 15;
//         return (
//           <circle
//             key={i}
//             cx="100"
//             cy="100"
//             r={r}
//             stroke="url(#glowGradient)"
//             strokeWidth={2 + i}
//             fill="none"
//             filter="url(#glow)"
//             style={{
//               animation: `divineSpin${i} ${8 + i * 3}s linear infinite`,
//               transformOrigin: "100px 100px",
//             }}
//           />
//         );
//       })}

//       {/* خطوط شعاعی پراکنده */}
//       {[...Array(12)].map((_, i) => {
//         const angle = (360 / 12) * i;
//         return (
//           <line
//             key={i}
//             x1="100"
//             y1="100"
//             x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
//             y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
//             stroke="#d8b4fe"
//             strokeWidth="1"
//             strokeLinecap="round"
//             style={{
//               opacity: 0.6,
//               animation: `pulseLine${i} 3s ease-in-out infinite`,
//               animationDelay: `${(i * 0.25)}s`,
//               transformOrigin: "100px 100px",
//             }}
//           />
//         );
//       })}
//     </svg>

//     {/* متن زیبا و متحرک */}
//     <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-3xl font-extrabold tracking-widest animate-divineTextGlow">
//       انتظار معجزه...
//     </span>

//     <style>{`
//       ${[...Array(5)]
//         .map(
//           (_, i) => `
//           @keyframes divineSpin${i} {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(${i % 2 === 0 ? 360 : -360}deg); }
//           }
//         `
//         )
//         .join("\n")}

//       ${[...Array(12)]
//         .map(
//           (_, i) => `
//           @keyframes pulseLine${i} {
//             0%, 100% { opacity: 0.6; stroke-width: 1; }
//             50% { opacity: 1; stroke-width: 2; }
//           }
//         `
//         )
//         .join("\n")}

//       @keyframes divineTextGlow {
//         0%, 100% {
//           filter: drop-shadow(0 0 10px #ec4899)
//                   drop-shadow(0 0 20px #8b5cf6)
//                   drop-shadow(0 0 30px #facc15);
//           transform: scale(1);
//         }
//         50% {
//           filter: drop-shadow(0 0 20px #f472b6)
//                   drop-shadow(0 0 30px #c084fc)
//                   drop-shadow(0 0 40px #fde68a);
//           transform: scale(1.05);
//         }
//       }

//       .animate-divineTextGlow {
//         animation: divineTextGlow 4s ease-in-out infinite;
//       }
//     `}</style>
//   </div>
// );

// export default DivineAweLoader;


import React from "react";

const UltraProLoader = () => {
  const circles = [...Array(6)];
  const rays = [...Array(16)];

  return (
    <div className="relative flex flex-col items-center justify-center h-52 w-52 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-8 select-none overflow-hidden">
      {/* SVG پیشرفته */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="ultraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffe7" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#7f00ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="ultraGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00ffe7" floodOpacity="0.6" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#7f00ff" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* حلقه‌های متعدد با انیمیشن‌های چرخش متفاوت */}
        {circles.map((_, i) => {
          const r = 18 + i * 12;
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={r}
              stroke="url(#ultraGlow)"
              strokeWidth={2 + i * 0.5}
              fill="none"
              filter="url(#ultraGlowFilter)"
              style={{
                animation: `ultraSpin${i} ${6 + i * 2}s linear infinite`,
                transformOrigin: "100px 100px",
              }}
            />
          );
        })}

        {/* پرتوهای نوری */}
        {rays.map((_, i) => {
          const angle = (360 / rays.length) * i;
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
              stroke="#7f00ff"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{
                opacity: 0.7,
                animation: `rayPulse${i} 3.2s ease-in-out infinite`,
                animationDelay: `${(i * 0.2)}s`,
                transformOrigin: "100px 100px",
              }}
            />
          );
        })}
      </svg>

      {/* مرکز پالس‌دار */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-ultraPulse animate-ultraPulse"></div>

      {/* متن درخشان و متحرک */}
      <span className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-3xl font-black tracking-widest animate-textGlow select-none">
        Infinity Loading...
      </span>

      <style>{`
        ${circles
          .map(
            (_, i) => `
            @keyframes ultraSpin${i} {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(${i % 2 === 0 ? 360 : -360}deg); }
            }
          `
          )
          .join("\n")}

        ${rays
          .map(
            (_, i) => `
            @keyframes rayPulse${i} {
              0%, 100% { opacity: 0.7; stroke-width: 1.2; }
              50% { opacity: 1; stroke-width: 2.2; }
            }
          `
          )
          .join("\n")}

        @keyframes ultraPulse {
          0%, 100% {
            box-shadow:
              0 0 10px 4px #00ffe7,
              0 0 20px 8px #7f00ff,
              0 0 30px 12px #e63eff;
            transform: scale(1);
          }
          50% {
            box-shadow:
              0 0 20px 8px #00ffe7,
              0 0 40px 14px #7f00ff,
              0 0 60px 20px #e63eff;
            transform: scale(1.2);
          }
        }

        .animate-ultraPulse {
          animation: ultraPulse 3.5s ease-in-out infinite;
        }

        @keyframes textGlow {
          0%, 100% {
            filter:
              drop-shadow(0 0 10px #00ffe7)
              drop-shadow(0 0 20px #7f00ff)
              drop-shadow(0 0 30px #e63eff);
            transform: scale(1);
          }
          50% {
            filter:
              drop-shadow(0 0 15px #00ffe7)
              drop-shadow(0 0 30px #7f00ff)
              drop-shadow(0 0 40px #e63eff);
            transform: scale(1.05);
          }
        }

        .animate-textGlow {
          animation: textGlow 4s ease-in-out infinite;
        }

        .shadow-ultraPulse {
          box-shadow:
            0 0 10px 4px #00ffe7,
            0 0 20px 8px #7f00ff,
            0 0 30px 12px #e63eff;
        }
      `}</style>
    </div>
  );
};

export default UltraProLoader;
