import axios from "axios";
import { ResourceType } from "../constants";
import { url } from "../constants";

let baseUrl = url + "resources";

export const httpGetAllResource = () : Promise <ResourceType> => {
    return axios.get(baseUrl);
  }

export const httpAddResource = (resource: ResourceType) : Promise <any> => {
  return axios.post(baseUrl, resource);
}

export const httpUpdateResource = (resource: ResourceType) : Promise <any> => {
  return axios.put(`${baseUrl}/${resource._id}`, resource);
}

export const httpDeleteResource = (id: string, token: string) : Promise <any> => {
    console.log(`resource: ${id} token: ${token}`);
    return axios.delete(`${baseUrl}/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}


