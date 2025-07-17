import { ImageSourcePropType } from "react-native";

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: ImageSourcePropType;
  purchaseUrl: string;
  category: "sleep" | "feeding" | "gear";
}
