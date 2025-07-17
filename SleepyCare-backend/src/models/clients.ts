import mongooseEncryption from "mongoose-encryption";
import Types, { model, Schema, Document } from 'mongoose';

export interface IClient extends Document {
  user_id: Types.ObjectId;      
  counselor_id: Types.ObjectId; 
  child_name: string;            
  child_birthdate: Date;         
  notes?: string;                
}

const clientSchema = new Schema<IClient>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users', 
    required: true
  },
  counselor_id: {
    type: Schema.Types.ObjectId,
    ref: 'users', 
    required: true
  },
  child_name: {
    type: String,
    required: true
  },
  child_birthdate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    required: false
  }
});

// הצפנת שדות רגישים במודל לקוח (GDPR)
clientSchema.plugin(mongooseEncryption, {
  secret: process.env.MONGO_ENCRYPTION_KEY || 'default_key',
  encryptedFields: ['child_name', 'child_birthdate', 'notes']
});

export const clientModel = model<IClient>('clients', clientSchema);