import { Product } from "../types/productList.type";

const PRODUCTS: Product[] = [
  {
    id: 2,
    name: "בקבוק ורוד",
    description: "בקבוק אנטי-קוליק עם עיצוב ורוד.",
    imageUrl: require("../../assets/images/buttlePink.gif"), // עדכנתי לגרסה החדשה יותר
    purchaseUrl: "https://example.com/buy-pink-bottle",
    category: "feeding",
  },
  {
    id: 3,
    name: "בקבוק קלאסי",
    description: "בקבוק פשוט ונוח לשימוש.",
    imageUrl: require("../../assets/images/buttleNone.jpg"),
    purchaseUrl: "https://example.com/buy-classic-bottle",
    category: "feeding",
  },
  {
    id: 4,
    name: "מוצץ לתינוק",
    description: "מוצץ סיליקון איכותי עם מגן.",
    imageUrl: require("../../assets/images/motezz.png"),
    purchaseUrl: "https://example.com/buy-pacifier",
    category: "gear",
  },
];

export const getProducts = (): Product[] => PRODUCTS;
