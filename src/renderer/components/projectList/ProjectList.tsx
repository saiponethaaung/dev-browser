import {
  SessionObject,
  openSession,
  selectSession,
} from '../../store/sessionSlice';
import { useAppDispatch } from '../../store/store';
import styles from './ProjectList.module.scss';

interface IProps {
  session: SessionObject;
}

const ProjectListComponent = ({ session }: IProps) => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(selectSession(session));
      }}
      onDoubleClick={() => {
        dispatch(openSession(session));
      }}
      className={styles.listItem}
    >
      {session.name}
    </div>
  );
};

export default ProjectListComponent;
