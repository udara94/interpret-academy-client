import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MembershipStatus } from "@/lib/api/payments-api";

interface MembershipState {
  status: MembershipStatus | null;
  isLoading: boolean;
  lastChecked: number | null;
}

const initialState: MembershipState = {
  status: null,
  isLoading: false,
  lastChecked: null,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    setMembershipStatus: (state, action: PayloadAction<MembershipStatus>) => {
      state.status = action.payload;
      state.isLoading = false;
      state.lastChecked = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMembership: (state) => {
      state.status = null;
      state.isLoading = false;
      state.lastChecked = null;
    },
  },
});

export const { setMembershipStatus, setLoading, clearMembership } = membershipSlice.actions;
export default membershipSlice.reducer;

