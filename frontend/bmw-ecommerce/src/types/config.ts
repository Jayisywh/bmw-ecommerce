export interface Config {
  color: string | null;
  interior: string | null;
  size: string | null;
  trims: string | null;
  packages: string[];
}

export type CarOptions = {
  colors: { color: string; price: number }[];
  interior: { name: string; color: string; price: number }[];
  size: { size: string; type: string; price: number }[];
  trims: { name: string; price: number }[];
  package: { name: string; price: number }[];
};
