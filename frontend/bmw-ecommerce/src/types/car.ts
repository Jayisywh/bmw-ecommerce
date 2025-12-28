interface CarImages {
  [color: string]: string[];
}

export interface Car {
  _id: string;
  name: string;
  series: string;
  price: number;
  categroyId: string | Category;
  engineType: string;
  horsePower: string;
  colors: string[];
  images: CarImages;
  defaultColor: string;
  isFeatured: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}
