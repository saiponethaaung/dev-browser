import { openTab, selectSession } from '../../store/sessionSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import ProjectListComponent from '../projectList/ProjectList';
import styles from './SessionList.module.scss';

function SessionList() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const state = useAppSelector((state) => state.session);

  const createSession = () => {
    dispatch(selectSession(undefined));
  };

  return (
    <div className={styles.infoCon}>
      <div className={styles.sessionList}>
        <ul className={styles.sessions}>
          <li>
            <h2 className={styles.sessionHeading}>Sessions</h2>
          </li>
          {state.sessions.map((session: any, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>
              <ProjectListComponent session={session} />
            </li>
          ))}
        </ul>
        <div className={styles.createSession}>
          <button
            type="button"
            className={styles.createSessionButton}
            onClick={createSession}
          >
            + New Session
          </button>
        </div>
        <button
          type="button"
          className={styles.records}
          onClick={() => dispatch(openTab('sessions'))}
        >
          Recorded Session
        </button>
      </div>
    </div>
  );
}

export default SessionList;
