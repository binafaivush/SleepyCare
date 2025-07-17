// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export type Slot = {
//   timeRange: string;
//   // start: string; // זמן התחלה
//   // end: string; // זמן סיום
// };

// interface AvailabilityState {
//   availableTimes: Slot[]; 
//   selectedSlot: Slot | null; 
// }

// const initialState: AvailabilityState = {
//   availableTimes: [], 
//   selectedSlot: null, 
// };

// export const availabilitySlice = createSlice({
//   name: 'availability', 
//   initialState,
//   reducers: {
//     setAvailableTimes: (state, action: PayloadAction<Slot[]>) => {
//       state.availableTimes = action.payload; 
//     },
//     selectSlot: (state, action: PayloadAction<Slot>) => {
//       state.selectedSlot = action.payload; 
//     },
//     clearSelectedSlot: (state) => {
//       state.selectedSlot = null; 
//     },
//   },
// });


// export const { setAvailableTimes, selectSlot, clearSelectedSlot } = availabilitySlice.actions;


// export default availabilitySlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// נייצא את מבנה ה-Slot כדי שנוכל להשתמש בו בקומפוננטה
export interface Slot {
  timeRange: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

interface AvailabilityState {
  availableTimes: Slot[];
  selectedSlots: Slot[]; // נשמור מערך של פגישות שנבחרו
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AvailabilityState = {
  availableTimes: [],
  selectedSlots: [], // המצב ההתחלתי הוא מערך ריק
  status: 'idle',
};

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    setAvailableTimes: (state, action: PayloadAction<Slot[]>) => {
      state.availableTimes = action.payload;
    },
    // הפעולה החדשה שמקבלת מערך של פגישות
    selectSlots: (state, action: PayloadAction<Slot[]>) => {
      state.selectedSlots = action.payload;
    },
    // אפשר להוסיף פעולה לאיפוס הבחירה אם צריך
    clearSelectedSlots: (state) => {
        state.selectedSlots = [];
    }
  },
});

export const { setAvailableTimes, selectSlots, clearSelectedSlots } = availabilitySlice.actions;

// סלקטורים מעודכנים
export const selectAllAvailableTimes = (state: RootState) => state.availability.availableTimes;
export const selectCurrentSelectedSlots = (state: RootState) => state.availability.selectedSlots;

export default availabilitySlice.reducer;