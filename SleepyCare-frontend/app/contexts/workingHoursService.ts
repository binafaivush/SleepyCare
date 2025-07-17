import axios from "axios";
import { DailyWorkingHours } from "../constants";
import { url } from "../constants";

let baseUrl = url+"working-hours";

export const httpGetWorkingDatesAndHoursByCounselor = (id: string) : Promise <DailyWorkingHours[]> => {
    return axios.get(`${baseUrl}/${id}`);
  }
