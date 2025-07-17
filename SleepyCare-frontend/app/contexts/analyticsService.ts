import axios from "axios";
import { SleepAnalyticsResponseType } from "../constants";

const baseUrl = "http://localhost:3000/api/analytic";

// Get latest analytics for a client
export const httpGetLatestClientAnalytics = async(clientId: string): Promise<SleepAnalyticsResponseType> => {
  return axios.get(`${baseUrl}/latest/${clientId}`).then(res => res.data);
};

// Get all analytics for a client
export const httpGetClientAnalytics =async (clientId: string): Promise<SleepAnalyticsResponseType[]> => {
  return axios.get(`${baseUrl}/${clientId}`).then(res => res.data);
};

// Generate new analytics summary for a client
export const httpGenerateClientAnalytics = async(
  clientId: string,
  start_date: string,  // string in format yyyy-mm-dd or ISO date
  end_date: string
): Promise<SleepAnalyticsResponseType> => {
  return axios.post(`${baseUrl}/${clientId}`, { start_date, end_date }).then(res => res.data);
};
