import axios from "axios";
import { AppointmentType } from "../constants";
import { url } from "../constants";

let baseUrl = url+"appointment";

export const httpGetAllAppointment = () : Promise <AppointmentType[]> => {
    return axios.get(baseUrl);
  }

  export const httpGetAppointmentById = (id : string) : Promise <AppointmentType> => {
    return axios.get(`${baseUrl}/${id}`);
  }

export const httpAddAppointment = (appointment: AppointmentType) : Promise <any> => {
  return axios.post(baseUrl, appointment);
}

export const httpUpdateAppointment = (appointment: AppointmentType) : Promise <any> => {
  return axios.put(baseUrl, appointment);
}

export const httpDeleteAppointment = (id: string, token: string) : Promise <any> => {
    console.log(`appointment: ${id} token: ${token}`);
    return axios.delete(`${baseUrl}/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

}

