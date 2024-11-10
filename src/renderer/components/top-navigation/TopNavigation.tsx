import { HiMiniHome } from 'react-icons/hi2';
import { closeTab, openTab } from '../../store/sessionSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { MdClear } from 'react-icons/md';
import styles from './TopNavigation.module.scss';

function TopNavigation() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.session);

  return (
    <div className={styles.topNavigation}>
      <div onClick={() => dispatch(openTab('0'))} className="home">
        <HiMiniHome />
      </div>
      {state.openSession.map((session: any, i) => {
        return (
          <div
            onClick={() => dispatch(openTab(session.id))}
            key={i}
            className={`${styles.tab} ${
              session.id == state.tab ? styles.tabActive : ''
            }`}
          >
            <div>{session.name}</div>
            <MdClear
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(closeTab(session.id));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default TopNavigation;
