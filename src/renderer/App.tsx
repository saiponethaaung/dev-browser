import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { MdClear } from 'react-icons/md';
import './App.scss';
import { useEffect, useRef, useState } from 'react';
import { HiMiniHome } from 'react-icons/hi2';
import DWebView from './components/dwebview/DWebView';
import { Provider } from 'react-redux';
import store, { useAppDispatch, useAppSelector } from './store/store';
import {
  closeTab,
  createSession,
  loadSessions,
  openTab,
  selectSession,
} from './store/sessionSlice';
import ProjectListComponent from './components/projectList/ProjectList';
import SessionForm from './components/sessionForm/SessionForm';

function Hello() {
  let ref: any = useRef();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.session);

  useEffect(() => {
    loadSession();
  }, [ref]);

  const loadSession = async () => {
    dispatch(loadSessions());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topNavigation">
        <div onClick={() => dispatch(openTab('0'))} className="home">
          <HiMiniHome />
        </div>
        {state.openSession.map((session: any, i) => {
          return (
            <div
              onClick={() => dispatch(openTab(session.id))}
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px;',
              }}
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
      <div
        style={{ display: 'flex', flex: 1, width: '100%', overflow: 'auto' }}
      >
        {state.tab === '0' && (
          <div className="infoCon">
            <div className="sessionList">
              <ul>
                {state.sessions.map((session: any, i) => (
                  <li key={i}>
                    <ProjectListComponent session={session} />
                  </li>
                ))}
                <li
                  onClick={() => {
                    dispatch(selectSession(undefined));
                  }}
                >
                  Create new one
                </li>
              </ul>
            </div>
            <div className="sessionInfo">
              <SessionForm />
            </div>
          </div>
        )}
        {state.openSession.map((session, i) => {
          return (
            <div
              style={{ display: state.tab !== session.id ? 'none' : 'flex' }}
              key={i}
            >
              <DWebView webSession={session} />
            </div>
          );
        })}
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
