export interface Reminder {
    id: string;
    title: string;
    time: Date;
    description: string;
    zoomLink?: string;
    clientName?: string;
}
export interface Reminders {
  id: string;
  title: string;
  time: string;
}