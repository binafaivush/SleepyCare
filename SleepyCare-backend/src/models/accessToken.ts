import {Schema, model,Types} from "mongoose";

export interface IToken extends Document {
  user_id: Types.ObjectId; // מפתח זר למשתמש
  access_token: String;
  refresh_token: String;
  expires_in: Number;
  expires_at : Number;
  scope: String;
  token_type: String;             
}

const tokenSchema = new Schema<IToken>({
  user_id: {type: Schema.Types.ObjectId, ref: 'users', required: true},
  access_token: String,
  refresh_token: String,
  expires_in: Number,
  expires_at : Number,
  scope: String,
  token_type: String, 
});

export const tokenModel = model<IToken>('access_token', tokenSchema);
