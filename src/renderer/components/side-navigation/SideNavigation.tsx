import { useAppSelector } from '../../store/store';
import SessionList from '../session-list/SessionList';

function SideNavigation() {
  const state = useAppSelector((s) => s.session);

  if (state.tab === '0' || state.tab === '') {
    return (
      <div>
        <SessionList />
      </div>
    );
  }

  // eslint-disable-next-line react/self-closing-comp
  return <div></div>;
}

export default SideNavigation;
