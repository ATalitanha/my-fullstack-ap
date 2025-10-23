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
        <option key={unit.value} value={unit.value}>
          {unit.label}
        </option>
      ))}
    </select>
  );
};

export default UnitSelect;
