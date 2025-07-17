export interface AppointmentType {
  id: string;
  client_id: string;
  counselor_id: string;
  start_time: number;
  end_time: number;
  zoom_link: string;
  status: string;
}