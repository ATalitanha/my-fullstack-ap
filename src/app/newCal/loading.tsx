const LoadingDots = () => (
  <div className="flex justify-center items-center h-24 space-x-2">
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export default LoadingDots;