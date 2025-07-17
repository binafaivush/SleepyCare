// services/childrenService.ts

import axios from "axios";
import { ClientType } from "../constants";
import { url } from "../constants";

const baseUrl = url + "client";

// הורים -> ילדים
export const httpGetChildrenByParentId = (parentId: string): Promise<any> => {
  console.log(`Fetching children for parent ID: ${parentId}`);
  return axios.get(`${baseUrl}/parent/${parentId}`);
};

// יועצים -> ילדים
export const httpGetChildrenByCounselorId = (counselorId: string): Promise<ClientType[]> => {
  return axios.get(`${baseUrl}/counselor/${counselorId}`);
};

// כל היועצים (עבור הורה שרוצה לבחור יועץ)
export const httpGetAllCounselors = (): Promise<[]> => {
  return axios.get(`${baseUrl}/users/counselors`);
};

// לקוחות לפי מזהה הורה
export const httpGetClientsByParentId = async (parentId: string): Promise<ClientType[]> => {
  return axios.get(`${baseUrl}/parent/${parentId}`)
    .then(response => {
      return response.data as ClientType[];
    })
    .catch(error => {
      console.error("Error in httpGetClientsByCounselorTry:", error.response?.data || error.message);
      throw error;
    });
}
