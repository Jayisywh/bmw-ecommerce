export type ColorOption = {
  name: string;
  hex?: string;
  price: number;
};

export type WheelOption = {
  size: string;
  type: string;
  price: number;
};

export type InteriorOption = {
  name: string;
  color: string;
  price: number;
};

export type TrimOption = {
  name: string;
  price: number;
};

export type PackageOption = {
  name: string;
  price: number;
};

export type Config = {
  color?: ColorOption;
  wheels?: WheelOption;
  interior?: InteriorOption;
  trim?: TrimOption;
  packages: PackageOption[];
};

export type CarOptions = {
  colors: { color: string; price: number }[];
  interior: { name: string; color: string; price: number }[];
  size: { size: string; type: string; price: number }[];
  trims: { name: string; price: number }[];
  package: { name: string; price: number }[];
};
