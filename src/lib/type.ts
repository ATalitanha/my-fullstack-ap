import { ReactNode } from "react";

/**
 * Represents a changelog entry.
 * @property {string} version - The version number.
 * @property {string[]} changes - An array of changes for the version.
 */
export interface ChangeLog {
    version: string,
    changes: string[],
};

/**
 * Represents a unit of measurement.
 * @property {string} category - The category of the unit (e.g., "length", "weight").
 * @property {string} label - The display label for the unit.
 * @property {string} value - The value of the unit.
 * @property {number} [factor] - The conversion factor for the unit.
 */
export type Unit = {
  category: string;
  label: string;
  value: string;
  factor?: number;
};

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}