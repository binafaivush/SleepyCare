export type Note={
title: string;
content : string;
};
export type SleepJournalType = {
id :string;
 client_id :string;
 date: Date;
 bed_time: string;
 wake_time: string;
 nap_times: Number[];
 wake_ups_count: number;
 mood: string;
 notes:Note[];
 submitted_by_voice: boolean;
};