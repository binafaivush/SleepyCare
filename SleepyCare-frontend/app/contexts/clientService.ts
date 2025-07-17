import axios from "axios";
import { ClientType } from "../constants";
import { url } from "../constants";
import { AxiosResponse } from 'axios';

interface PersonalDetails {
  name?: string;
  phone?: string;
  email?: string;
}
let baseUrl = url + "client";

export const httpGetAllClient = (): Promise<ClientType> => {
  return axios.get(baseUrl);
}

export const httpGetClientsByUser = (userId: string): Promise<ClientType[]> => {
  return axios.get(`${baseUrl}/user/${userId}`);
}

export const httpAddClient = (client: ClientType): Promise<any> => {
  return axios.post(baseUrl, client);
}

export const httpUpdateClient = (client: ClientType): Promise<any> => {
  return axios.put(`${baseUrl}/${client._id}`, client);
}

export const httpUpdatePersonalDetails = (clientId: String, Details: PersonalDetails): Promise<any> => {
  return axios.put(`${baseUrl}/${clientId}`, Details);
}

// export const httpDeleteClient = (id: string, token: string): Promise<any> => {
//   console.log(`client: ${id} token: ${token}`);
//   return axios.delete(`${baseUrl}/${id}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });
// }
export const httpGetClientsByCounselor = async(counselorId: string, token: string): Promise<ClientType[]> => {
  return axios.get(`${baseUrl}/counselor/${counselorId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => {
    // Axios עוטף את הנתונים בתגובה במאפיין 'data'.
    // אנו מוודאים שאנו מחזירים רק את הנתונים עצמם.
    return response.data as ClientType[];
  })
  .catch(error => {
    // טיפול בשגיאות מה-API
    console.error("Error in httpGetClientsByCounselor:", error.response?.data || error.message);
    throw error; // זרוק את השגיאה הלאה לטיפול בקומפוננטה הקוראת
  });
}

// יועצים -> ילדים
export const httpGetClientByCounselorId = (counselorId: string,token: string): Promise<AxiosResponse<ClientType[]>> => {
  console.log(`${baseUrl}/counselor/${counselorId}`);
  return axios.get(`${baseUrl}/counselor/${counselorId}`,{
    headers: {
          "Authorization": `Bearer ${token}`
      }
  });
};



// export const httpGetClientsByCounselor = (counselorId: string, token: string): Promise<ClientType[]> => {
//   return axios.get(`${baseUrl}/counselor/${counselorId}`, {
//     headers: {
//       "Authorization": `Bearer ${token}`
//     }
//   });
// }

export const httpGetClientsByCounselorTry =async (counselor_id: string): Promise<ClientType[]> => {
  return axios.get(`${baseUrl}/counselor/${counselor_id}`)
  .then(response => {
    return response.data as ClientType[];
  })
  .catch(error => {
    console.error("Error in httpGetClientsByCounselorTry:", error.response?.data || error.message);
    throw error; 
  });
}
