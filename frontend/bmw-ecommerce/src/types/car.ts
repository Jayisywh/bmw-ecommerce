export interface Car {
  _id: string;
  name: string;
  series: string;
  price: number;
  categroyId: string | Category;
  engineType: string;
  horsePower: string;
  colors: string[];
  images: string[];
  isFeatured: boolean;
}

export interface Category {
  name: string;
  description: string;
  image: string;
}
