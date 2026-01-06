export interface CartItem {
  carId: string;
  image: string;
  selectOptions?: {
    // color can be a simple string or an object depending on where the item was added
    color?:
      | string
      | { name?: string; color?: string; price?: number; hex?: string };
    interior?: {
      name: string;
      color: string;
      price: number;
    };
    wheels?: {
      size: string;
      type: string;
      price: number;
    };
    trim?: { name: string; price: number };
    packages?: {
      name: string;
      price: number;
    }[];
  };
  quantity: number;
  unitPrice: number;
}
