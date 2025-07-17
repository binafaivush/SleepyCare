import { AppointmentType } from "../constants"; 
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


type FormData = {
  creator_id: string;
  client_id: string;
  counselor_id: string;
  date: string;
  time: string;
};


const conversion = (data: FormData): AppointmentType => {
    const [start, end] = data.time.split('-');
    // Convert date from DD-MM-YYYY to YYYY-MM-DD
    const formattedDate = dayjs(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const start_time = `${formattedDate} ${start}`;
    const end_time = `${formattedDate} ${end}`;
    console.log(`start_time: ${start_time}, end_time: ${end_time}`);

    return {
        creator_id: data.creator_id,
        client_id: data.client_id,
        counselor_id: data.counselor_id,
        date: data.date,
        start_time, // string in correct format
        end_time,   // string in correct format
        zoom_link: null,
        status: 'pending',
    };
};

export default conversion;
