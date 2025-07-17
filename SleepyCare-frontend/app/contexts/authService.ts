import axios from "axios";
import { url } from "../constants";

export const httpChangePassword = (
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<any> => {
  return axios.post(
    `${url}auth/change-password`,
    {
      currentPassword,
      newPassword
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};
