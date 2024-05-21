import { useEffect, useRef, useState } from 'react';
import './DWebView.scss';

function DWebView({ webSession }: any) {
  let ref: any = useRef();
  const sesssionName = webSession.id.toString();
  const [webInfo, setWebInfo] = useState({
    url: webSession.host,
    canGoBack: false,
    canGoForward: false,
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('dom-ready', (w: any) => {
        if (!ref.current.isDevToolsOpened()) {
          ref.current.openDevTools();
        }
        ref.current.executeJavaScript(`
          let hasUsername = false;
          const username = document.getElementsByName("username");
          if(username && username[0]) {
            username[0].value = "${webSession.username}"
            hasUsername = true;
          }

          const email = document.getElementsByName("email");
          if(email && email[0]) {
            email[0].value = "${webSession.username}"
            hasUsername = true;
          }

          let hasPassword = false;
          const password = document.getElementsByName("password");
          if(password && password[0]) {
            password[0].value = "${webSession.password}"
            hasPassword = true
          }

          if(hasUsername && hasPassword) {
            const submitButton = document.querySelector("button[type=submit]")
            if(submitButton) {
              submitButton.click()
            }
          }
        `);
      });
      ref.current.addEventListener('did-navigate', ({ url }: any) => {
        setWebInfo({ ...webInfo, url });
        updateWebInfo();
      });
      ref.current.addEventListener('did-navigate-in-page', ({ url }: any) => {
        setWebInfo({ ...webInfo, url: url });
        updateWebInfo();
      });
    }

    return () => {
      stopNetworkHandler();
    };
  }, [ref]);

  const updateWebInfo = () => {
    setWebInfo({
      ...webInfo,
      canGoBack: ref.current.canGoBack(),
      canGoForward: ref.current.canGoForward(),
    });
  };

  const networkHandler = () => {
    window.electron.ipcRenderer.recordSession(sesssionName);
  };

  const stopNetworkHandler = () => {
    window.electron.ipcRenderer.stopRecordSession(sesssionName);
  };

  const changeUrl = (e: any) => {
    e.preventDefault();
    console.log('ref.current.loadURL', ref.current.loadURL);
    console.log('webinfo.url', webInfo.url);
    let url = webInfo.url;
    if (url.indexOf('://') === -1) {
      url = 'https://' + url;
    }
    ref.current.loadURL(url);
  };

  return (
    <div className="content-container">
      <div className="navigation">
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (webInfo.canGoBack) {
                    ref.current.goBack();
                  }
                }}
              >
                Back
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (webInfo.canGoForward) {
                    ref.current.goForward();
                  }
                }}
              >
                Forward
              </div>
            </div>
            <div onClick={() => ref.current.reload()}>Reload</div>
          </div>
          <form onSubmitCapture={changeUrl} style={{ flex: 1 }}>
            <input
              value={webInfo.url}
              onChange={(e) => {
                setWebInfo({
                  ...webInfo,
                  url: e.target.value,
                });
              }}
              style={{ flex: 1, width: '80%' }}
            />
          </form>
        </div>
        <div className="session-info">
          <div>Host: {webSession.host}</div>
          <div>Username: {webSession.username}</div>
          <div>Password: {webSession.password}</div>
        </div>
        <div onClick={networkHandler}>record session</div>
        <div onClick={stopNetworkHandler}>stop record session</div>
      </div>
      <webview
        ref={ref}
        style={{ width: '100vw', height: '100vh' }}
        src={webSession.host}
        partition={sesssionName}
        contextMenu=""
        allowFullScreen={true}
      ></webview>
    </div>
  );
}

export default DWebView;
