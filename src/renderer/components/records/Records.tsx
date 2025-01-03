import { useEffect } from 'react';
import styles from './Records.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { loadRecords } from './record.slice';

export function Records() {
  const state = useAppSelector((s) => s.record);
  const dispatch = useAppDispatch();

  const loadData = async () => {
    dispatch(loadRecords());
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.recordCon}>
      {state.isLoading ?? <div>Loading...</div>}
      <ul className={styles.recordList}>
        {state.records.map((record) => (
          <li className={styles.recordItem}>
            <div>Ref: {record.ref}</div>
            <div>Duration: {record.duration}</div>
            <div>Start: {record.startTimestamp.toDateString()}</div>
            <div>End: {record.endTimestamp.toDateString()}</div>
          </li>
        ))}
      </ul>
      <div>
        Showing {state.page - 1} of {state.totalPages}
      </div>
    </div>
  );
}
