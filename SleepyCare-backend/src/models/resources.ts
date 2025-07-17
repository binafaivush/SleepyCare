import mongoose, { Schema, model, Document } from "mongoose";

// Interface עבור המודל, מגדיר את המבנה של Resource
interface IResource extends Document {
  title: string;
  description: string;
  type: "article" | "video" | "link"; // סוגי התוכן
  url: string;
  uploaded_by:
  mongoose.Types.ObjectId; // מזהה המשתמש שהעלה את התוכן (FK)
  visible_to_clients: boolean; // האם התוכן גלוי ללקוחות
}

// הגדרת הסכימה של המודל
const resourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["article", "video", "link"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploaded_by: {
    type: Schema.Types.ObjectId,
    ref: "User", // קשר למודל המשתמש
    // required: true, //את השורה הזו יש להחזיר לפעולה כשיחברו את כל חלקי השרת
  },
  visible_to_clients: {
    type: Boolean,
    default: true, // ברירת מחדל היא שהתוכן יהיה גלוי
  },
});

// יצירת המודל
const Resource = model<IResource>("Resource", resourceSchema);

export { Resource, IResource };
