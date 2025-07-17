import axios from "axios";
// import { ClientType } from "../constants";
import { url } from "../constants";

const baseUrl = url + "SleepJournals";
export const getSleepJournalsByClient = async (clientId: string) => {
  return axios.get(`${baseUrl}/SleepJournals/${clientId}`);
};
