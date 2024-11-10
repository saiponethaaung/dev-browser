import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface SessionObject {
  id: string;
  name: string;
  host: string;
  username: string;
  password: string;
}

export interface SessionState {
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  tab: string;
  selectedSession?: SessionObject;
  sessions: SessionObject[];
  openSession: SessionObject[];
}

const initialState: SessionState = {
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  tab: '',
  selectedSession: undefined,
  sessions: [],
  openSession: [],
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    openSession: (state, action: PayloadAction<SessionObject>) => {
      if (!state.openSession.find((s) => s.id === action.payload.id)) {
        state.openSession = [...state.openSession, action.payload];
      }

      state.tab = action.payload.id;
    },
    openTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
    selectSession: (
      state,
      action: PayloadAction<SessionObject | undefined>,
    ) => {
      state.tab = '0';
      state.selectedSession = action.payload;
    },
    closeTab: (state, action: PayloadAction<string>) => {
      if (state.tab === action.payload) {
        state.tab = '0';
      }

      state.openSession.splice(
        state.openSession.indexOf(
          state.openSession.filter(
            (session) => session.id === action.payload,
          )[0],
        ),
        1,
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(loadSessions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadSessions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessions = action.payload;

      let hasSelected = false;
      let closeSession: string[] = [];

      action.payload.forEach((session: SessionObject) => {
        if (!hasSelected) {
          hasSelected = state.selectedSession?.id === action.payload;
        }

        for (let s in state.openSession) {
          if (state.openSession[s].id === session.id) {
            state.openSession[s] = session;
          }
        }

        if (state.selectedSession && session.id === state.selectedSession.id) {
          state.selectedSession = session;
        }
      });

      // Remove selected session
      if (!hasSelected) {
        state.selectedSession = undefined;
      }
    });
    builder.addCase(loadSessions.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createSession.pending, (state) => {
      state.isCreating = true;
    });
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.isCreating = false;
    });
    builder.addCase(createSession.rejected, (state) => {
      state.isCreating = false;
    });
    builder.addCase(deleteSession.pending, (state) => {
      state.isDeleting = true;
    });
    builder.addCase(deleteSession.fulfilled, (state, action) => {
      state.isDeleting = false;
      const index = state.openSession.findIndex((s) => s.id === action.payload);

      if (index > -1) {
        state.openSession.splice(index, 1);
      }
    });
    builder.addCase(deleteSession.rejected, (state) => {
      state.isDeleting = false;
    });
  },
});

export const loadSessions = createAsyncThunk('session/list', async () => {
  return await window.electron.ipcRenderer.runQuery(
    'SELECT * FROM session;',
    [],
  );
});

export const createSession = createAsyncThunk(
  'session/create',
  async (values: any) => {
    return await window.electron.ipcRenderer.runQuery(
      'INSERT INTO session (name, host, username, password) VALUES (:name, :host, :username, :password);',
      values,
    );
  },
);

export const updateSession = createAsyncThunk(
  'session/update',
  async (values: any) => {
    return await window.electron.ipcRenderer.runQuery(
      'UPDATE session SET name=:name, host=:host, username=:username, password=:password WHERE id=:id',
      values,
    );
  },
);

export const deleteSession = createAsyncThunk(
  'session/delete',
  async (id: any) => {
    await window.electron.ipcRenderer.runQuery(
      'DELETE FROM session WHERE id=:id;',
      {
        id,
      },
    );
    return id;
  },
);

export const { openSession, openTab, closeTab, selectSession } =
  sessionSlice.actions;

export default sessionSlice.reducer;
