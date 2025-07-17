import  {Types } from "mongoose";

import { getSleepJournalsByClientId } from "./sleepJournalService";
import { getClientNotesByClientId } from "./clientService";
import { getParentAudiosByClientId } from "./parentsAudioService";

//פונקציה המחזירה dashboard לפי client_id
export const getClientDashboardData = async (
  clientId: string,
  dateRange?: { start_date?: string; end_date?: string }
): Promise<any> => {
  if (!Types.ObjectId.isValid(clientId)) {
    throw new Error("Invalid client ID");
  }

  try {
    const [sleepJournals, notes, audioFiles] = await Promise.all([
      getSleepJournalsByClientId(clientId, dateRange),
      getClientNotesByClientId(clientId),
      getParentAudiosByClientId(clientId, dateRange)
    ]);
    return {
      sleepJournals,
      notes,
      audioFiles
    };
  } catch (error: any) {
    console.error('Error in getClientDashboardData:', error);
    throw new Error(error.message || 'Unknown error fetching dashboard data');
  }
};
