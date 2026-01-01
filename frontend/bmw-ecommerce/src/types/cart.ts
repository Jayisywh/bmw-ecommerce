export interface CartItem {
  carId: string;
  image: string;
  selectOptions?: {
    color: string;
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
