import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RecordItem {
  createdAt: Date;
  endTimestamp: Date;
  id: number;
  name: string;
  ref: string;
  sessionId: number;
  duration: number;
  startTimestamp: Date;
  updatedAt: Date;
  username: string;
}

interface RecordState {
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  records: RecordItem[];
}

const initialState: RecordState = {
  isLoading: false,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  records: [],
};

export const loadRecords = createAsyncThunk(
  'record/list',
  async (args, { getState }) => {
    const state: RecordState = (getState() as any).record;

    const total = await window.electron.ipcRenderer.runQuery(
      'SELECT COUNT(*) as count FROM record;',
      {},
    );

    const offset = state.page === 1 ? 0 : state.page * state.limit;

    const items = await window.electron.ipcRenderer.runQuery(
      'SELECT r.*, s.name, s.username FROM record r LEFT JOIN session s ON r.session_id=s.id ORDER BY id DESC LIMIT :limit OFFSET :offset ',
      { limit: state.limit, offset },
    );

    return {
      total: total[0].count,
      page: state.page + 1,
      items,
    };
  },
);

const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadRecords.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadRecords.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loadRecords.fulfilled, (state, action) => {
      if (action.payload.items.length === 0) return;

      const items: RecordItem[] = [];

      action.payload.items.forEach((item: any) => {
        const startTimestamp = new Date(item.start_timestamp);
        const endTimestamp = new Date(item.end_timestamp);
        const duration = endTimestamp.getTime() - startTimestamp.getTime();

        items.push({
          createdAt: new Date(item.created_at),
          endTimestamp,
          id: item.id,
          name: item.name,
          ref: item.ref,
          sessionId: item.session_id,
          duration,
          startTimestamp,
          updatedAt: new Date(item.updated_at),
          username: item.username,
        });
      });

      state.isLoading = false;
      state.page = action.payload.page;
      state.total = action.payload.total;
      state.totalPages = Math.ceil(action.payload.total / state.limit);
      state.records = items;
    });
  },
});

export default recordSlice.reducer;
