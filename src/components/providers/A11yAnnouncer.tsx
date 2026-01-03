"use client";
import { useEffect, useState } from "react";

export default function A11yAnnouncer() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    function onAnnounce(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setMessage(detail || "");
    }
    window.addEventListener("announce", onAnnounce as EventListener);
    return () => window.removeEventListener("announce", onAnnounce as EventListener);
  }, []);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

