import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import DWebView from './components/dwebview/DWebView';
// eslint-disable-next-line import/no-named-as-default
import store, { useAppDispatch, useAppSelector } from './store/store';
import { loadSessions } from './store/sessionSlice';
import TopNavigation from './components/top-navigation/TopNavigation';
import SideNavigation from './components/side-navigation/SideNavigation';
import SessionForm from './components/sessionForm/SessionForm';

function Hello() {
  const ref: any = useRef();
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.session);

  const loadSession = async () => {
    dispatch(loadSessions());
  };

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return (
    <div className="rootCon">
      <TopNavigation />
      <div className="contentBody">
        <SideNavigation />
        <div className="content">
          {state.tab === '' && (
            <div className="sessionInfo">
              <h2>Welcome to CDS Browser</h2>
              <p>
                Select a session from the sidebar or create a new one to get
                started.
              </p>
            </div>
          )}
          {state.tab === '0' && (
            <div className="sessionInfo">
              <SessionForm />
            </div>
          )}
          {state.openSession.map((session) => {
            return (
              <div
                className={`session ${
                  state.tab === session.id ? 'active' : ''
                }`}
                // eslint-disable-next-line react/no-array-index-key
                key={session.id}
              >
                <DWebView webSession={session} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </Provider>
  );
}
