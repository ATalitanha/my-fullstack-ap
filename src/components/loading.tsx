/**
 * A component that displays a loading animation with bouncing dots.
 * @returns {JSX.Element} The loading dots component.
 */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
const LoadingDots = () => (
  <div className="flex justify-center items-center h-24 space-x-2 rtl:space-x-reverse">
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
        style={{
          animationDelay: `${i * 0.3}s`,
          animationDuration: '1.4s',
        }}
      />
    ))}
  </div>
);

export default LoadingDots;