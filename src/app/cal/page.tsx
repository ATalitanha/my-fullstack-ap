// components/HistoryPanel.tsx
"use client"

import { useEffect, useState } from "react";

interface Calculation {
    id: string;
    expression: string;
    result: string;
}

export default function HistoryPanel() {
    const [history, setHistory] = useState<Calculation[]>([]);

    async function fetchHistory() {
        const res = await fetch("http://localhost:3000/api/history");
        const data = await res.json();
        setHistory(data);
    }

    async function deleteCalculation(id: string) {
        await fetch(`http://localhost:3000/api/history/${id}`, {
            method: "DELETE",
        });
        setHistory(prev => prev.filter(item => item.id !== id));
    }

    useEffect(() => {
        fetchHistory();
    }, []);
    return (
        <div className="mt-4 border rounded-md p-2 max-h-64 overflow-y-auto">
            <h2 className="font-semibold mb-2">History</h2>
            {history.length === 0 && <p className="text-sm">No calculations yet.</p>}
            <ul className="text-sm space-y-1">
                {history.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                        <span>{item.expression} = {item.result}</span>
                        <button
                            onClick={() => deleteCalculation(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );


}
