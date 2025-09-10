// کامپوننت LoadingDots برای نمایش انیمیشن بارگذاری
const LoadingDots = () => (
  // کانتینر دایره‌ها با فلکس برای چینش افقی و وسط‌چین
  <div className="flex justify-center items-center h-24 space-x-2">
    {/* سه دایره که انیمیشن bounce دارند */}
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-4 h-4 bg-blue-500 rounded-full" // اندازه و رنگ و شکل دایره
        style={{
          animation: `bounce 1.4s infinite ease-in-out`, // اعمال انیمیشن bounce
          animationDelay: `${i * 0.3}s`, // تاخیر برای ایجاد افکت پیوسته
        }}
      />
    ))}
    {/* تعریف keyframes برای انیمیشن bounce */}
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
