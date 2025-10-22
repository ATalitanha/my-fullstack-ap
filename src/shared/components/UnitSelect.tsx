"use client";

import { Unit } from "@/shared/types/type";

interface UnitSelectProps {
  units: Unit[];
  selectedUnit: string;
  onChange: (value: string) => void;
}

const UnitSelect = ({ units, selectedUnit, onChange }: UnitSelectProps) => {
  return (
    <select
      value={selectedUnit}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded"
    >
      {units.map((unit) => (
        <option key={unit.symbol} value={unit.symbol}>
          {unit.name}
        </option>
      ))}
    </select>
  );
};

export default UnitSelect;
