import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClientState {
  _id: string;
  user_id: string;
  notes: string;
  counselor_id: string;
  child_name: string;
  child_birthdate: string;
  image:string;
}

const initialState: ClientState = {
  _id: "",
  user_id: "",
  notes: "",
  counselor_id: "",
  child_name: "",
  child_birthdate: "",
  image:"",
};
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    //  בעת בחירת ההורה ילד מסוים
    choose(
      state,
      action: PayloadAction<{
        _id: string;
        user_id: string;
        notes: string;
        counselor_id: string;
        child_name: string;
        child_birthdate: string;
        image: string;
      }>
    ) {
      (state._id = action.payload._id),
        (state.user_id = action.payload.user_id),
        (state.notes = action.payload.notes),
        (state.counselor_id = action.payload.counselor_id),
        (state.child_name = action.payload.child_name),
        (state.child_birthdate = action.payload.child_birthdate),
        (state.image = action.payload.image);
    },
    // בעת הוספת ילד חדש הוא ברירת המחדל
    clearClientData(state) {
      state._id = "";
      state.user_id = "";
      state.notes = "";
      state.counselor_id = "";
      state.child_name = "";
      state.child_birthdate = "";
      state.image = "";
    },
    updateChildImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    }
    
  },
});

export const { choose, clearClientData ,updateChildImage} = clientSlice.actions;
export default clientSlice.reducer;
