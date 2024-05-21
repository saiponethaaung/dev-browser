import { useEffect, useState } from 'react';
import {
  createSession,
  deleteSession,
  loadSessions,
  openSession,
  updateSession,
} from '../../store/sessionSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import styles from './SessionForm.module.scss';
import { Button } from '@mui/material';

const SessionForm = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.session);
  const [formState, setFormState] = useState({
    host: '',
    name: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    if (state.selectedSession) {
      setFormState({
        host: state.selectedSession.host,
        name: state.selectedSession.name,
        username: state.selectedSession.username,
        password: state.selectedSession.password,
      });
    } else {
      setFormState({
        host: '',
        name: '',
        username: '',
        password: '',
      });
    }

    return () => {};
  }, [state.selectedSession]);

  const saveSession = async (e: any) => {
    e.preventDefault();

    if (state.selectedSession) {
      await dispatch(
        updateSession({ ...formState, id: state.selectedSession.id }),
      );
    } else {
      await dispatch(createSession(formState));
      setFormState({
        host: '',
        name: '',
        username: '',
        password: '',
      });
    }

    dispatch(loadSessions());
  };

  const inputValueChanged = (e: any) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <form className={styles.sessionForm} onSubmitCapture={saveSession}>
      <h4>{state.selectedSession ? `Edit Session` : 'Create Session'}</h4>
      <label>
        <span>Name</span>
        <input
          type="text"
          name="name"
          onChange={inputValueChanged}
          value={formState.name}
          required
        />
      </label>
      <label>
        <span>URL</span>
        <input
          type="text"
          name="host"
          onChange={inputValueChanged}
          value={formState.host}
          required
        />
      </label>
      <label>
        <span>Username</span>
        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={inputValueChanged}
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="text"
          name="password"
          value={formState.password}
          onChange={inputValueChanged}
          required
        />
      </label>
      <div style={{ display: 'flex', gap: '10px' }}>
        {state.selectedSession && (
          <>
            <Button
              type="button"
              variant="contained"
              size="small"
              onClick={() =>
                dispatch(openSession(state.selectedSession as any))
              }
            >
              Open
            </Button>
            <Button
              type="button"
              variant="contained"
              size="small"
              color="error"
              onClick={async () => {
                await dispatch(deleteSession(state.selectedSession?.id));
                dispatch(loadSessions());
              }}
            >
              Delete
            </Button>
          </>
        )}
        <Button type="submit" variant="contained" size="small">
          {state.selectedSession ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
