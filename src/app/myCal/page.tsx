'use client';

import { useEffect, useState } from "react";

interface Item {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
}

export default function Ab() {
  const [dat, setDat] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/history");
      const data = await res.json();

      if (Array.isArray(data)) {
        setDat(data);
      } else {
        console.warn("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>History</h2>
      {dat.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul>
          {dat.map((item: Item) => (
            <li key={item.id}>
              {item.expression} {item.result}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
