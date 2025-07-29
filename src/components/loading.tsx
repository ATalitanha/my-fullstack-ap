// const LoadingDots = () => (
//   <div className="flex justify-center items-center h-24 space-x-2">
//     {[...Array(3)].map((_, i) => (
//       <span
//         key={i}
//         className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
//         style={{ animationDelay: `${i * 0.2}s` }}
//       />
//     ))}
//   </div>
// );

// export default LoadingDots;

const LoadingDots = () => (
  <div className="flex justify-center items-center h-24 space-x-2">
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-4 h-4 bg-blue-500 rounded-full"
        style={{
          animation: `bounce 1.4s infinite ease-in-out`,
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ))}
    <style jsx>{`
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.3;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

export default LoadingDots;