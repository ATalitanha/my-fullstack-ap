"use client";

import { Dispatch, SetStateAction } from "react";

interface CategorySelectProps {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const CategorySelect = ({ category, setCategory }: CategorySelectProps) => {
  const categories = ["length", "weight", "volume", "temperature", "time"];

  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="p-2 border rounded w-full"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
