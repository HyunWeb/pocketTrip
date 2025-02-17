import { createSlice } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";

interface WebSocketState {
  connected: boolean;
}

const initialState: WebSocketState = {
  connected: false,
};
const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { setConnected } = webSocketSlice.actions;
export default webSocketSlice.reducer;
