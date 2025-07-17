import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  name: string;
  token: string;
  role: string;
}

const initialState: UserState = {
  id: '',
  name: '',
  token: '',
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ id: string; name: string; token: string; role: string }>) {
      console.log('Login action payload:', action.payload);
      
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },  

    signUp(state, action: PayloadAction<{ id: string; name: string; token: string; role: string }>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout(state) {
      state.id = '';
      state.name = '';
      state.token = '';
      state.role = '';
    },
    clearUserData(state) {
      state.id = '';
      state.token = '';
      state.role = '';
      state.name = '';
    },
  },
});

export const { login, signUp, logout, clearUserData } = userSlice.actions;
export default userSlice.reducer;
