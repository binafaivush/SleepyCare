
export type SleepJurnal={
    client_id: string;
    date: Date;
    bed_time: string;
    wake_time: string;
    nap_times: number;
    wake_ups_count: number;
    mood: string;
    notes: string;
    submitted_by_voice: boolean,
}