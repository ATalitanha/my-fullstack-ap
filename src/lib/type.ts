export interface ChangeLog {
    version: string,
    changes: string[],
};

export type Unit = {
  category: string;
  label: string;
  value: string;
  factor?: number;
};