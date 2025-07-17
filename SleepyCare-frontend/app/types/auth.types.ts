export type roleType = "parent" | "counselor" | "admin";

export type FormData = {
  email: string;
  password: string;
  phone?: string;
  full_name?: string;
  confirmPassword?: string;
  isAdvisor?: boolean;
  role?: roleType;
  specialization?: string;
  experienceYears?: string;
  pushToken?: string; // ← הוספנו את זה!
};  

export type AuthResponse = {
  token: string;
  user: {
  _id: string;
  full_name: string;
  role: string;
  email: string;
  }
};
export interface User {
  _id: string;
  full_name: string;
  role: 'parent' | 'counselor' | 'admin'; // הגדרה מדויקת של התפקידים האפשריים
}

// 2. הגדרת טיפוס עבור תשובת ה-API המלאה
// export interface AuthResponse {
//   token: string;
//   user: User;
// }

