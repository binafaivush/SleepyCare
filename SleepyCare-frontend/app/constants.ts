/*On this page we will define constant variables 
that will repeat themselves in the code. */
// ../styles/LoginSignup.ts (או קובץ נפרד כמו ../constants/colors.ts)

export const COLORS = {
  primary: '#4DB6AC',       // Teal color for buttons, active elements
  textPrimary: '#263238',   // Dark grey for main text
  textSecondary: '#757575', // Lighter grey for placeholder or secondary text
  inputBackground: '#F7F9FC', // Very light grey, almost white for input field background
  background: '#FFFFFF',     // White background for the screen
  border: '#CFD8DC',        // Border color for input fields (when not focused or in error)
  error: '#D32F2F',         // Red for error messages
  white: '#FFFFFF',
  icon: '#B0BEC5',          // Light grey for input icons
  inputBorderFocused: '#4DB6AC', // Teal border for focused input
};
export const colors = {
  appBar: "#E0FFFF",
  background: "rgb(255, 259, 244)",
  pink: "rgb(252, 200, 214)",
  home: "rgb(242, 245, 246)",
  // home: "rgb(251, 237, 209)"    
  torkis: "rgb(7, 70, 66)",
};

export const cloudColors
 = {
  primary: '#4DB6AC',
  textPrimary: '#263238',
  textSecondary: '#757575',
  inputBackground: '#F7F9FC',
  background: '#FFFFFF',
  border: '#CFD8DC',
  error: '#D32F2F',
  white: '#FFFFFF',
  icon: '#B0BEC5',
  appBar: '#E0FFFF',
  backgroundAlt: '#FFFBF4',
  pink: '#FCC8D6',
  home: '#F2F5F6',
  torkis: '#074642',
  success: '#4CAF50',
  warning: '#FF9800',
  blue: '#1976D2',
  blueHover: '#1565C0',
};
export const commonColor={
   PRIMARY_GREEN : '#4EB6AC',
 WHITE :'#FFFFFF',
 BLACK : '#000000',
breastmilk: '#4EB6AC',
  formula: '#FFD700',
  solid: '#FF7F50',
}

export const url = "http://10.0.2.2:5000/api/" //android emulator
// export const url = "http://localhost:3000/api/"; //web


export type AppointmentType = {
  creator_id: string
  client_id: string
  counselor_id: string,
  date: string,
  start_time: string,
  end_time: string,
  zoom_link: string | null,
  status: string
}

export type ClientType = {

  _id: string
  user_id: string,
  notes: string,
  counselor_id: string,
  child_name: string,
  child_birthdate: string

}

export type ResTypes = "article" | "video" | "link";

export type ResourceType = {
  _id: string
  title: string
  description: string
  type: ResTypes
  url: string
  uploaded_by: string
  visible_to_clients: boolean
}

export type TimeRangeType = {
  start_time: Date; // שעת התחלה בפורמט Date
  end_time: Date;   // שעת סיום בפורמט Date
}

export type DailyWorkingHours =  {
  // counselor_id: string; // Foreign key to users collection
  date: string; // תאריך בפורמט YYYY-MM-DD
  time_ranges: TimeRangeType[]; // מערך של רצפי שעות
}

export type SleepAnalyticsSuccessType = {
  message: string;
  average_sleep_hours: string;
  average_nap_count: string;
  summary_text: string;
};

export type SleepAnalyticsErrorType = {
  status: number;
  message: string;
};

export type SleepAnalyticsResponseType = SleepAnalyticsSuccessType | SleepAnalyticsErrorType;
