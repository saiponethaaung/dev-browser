/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';
import { TbCaptureFilled } from 'react-icons/tb';
import { FaRegCircleStop } from 'react-icons/fa6';
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoReload,
} from 'react-icons/io5';
import './DWebView.scss';

function DWebView({ webSession }: any) {
  const ref: any = useRef();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  let recordChunk: any = [];
  const [timestamp, setTimestamp] = useState(`${new Date().getTime()}`);
  const [recording, setRecording] = useState(false);
  const sesssionName = webSession.id.toString();

  const [webInfo, setWebInfo] = useState({
    url: webSession.host,
    canGoBack: false,
    canGoForward: false,
  });

  const updateWebInfo = () => {
    setWebInfo({
      ...webInfo,
      canGoBack: ref.current.canGoBack(),
      canGoForward: ref.current.canGoForward(),
    });
  };

  const stopRecord = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const stopNetworkHandler = () => {
    window.electron.ipcRenderer.stopRecordSession({
      id: sesssionName,
      ref: timestamp,
    });
    stopRecord();
    setRecording(false);
  };

  useEffect(() => {
    if (ref.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ref.current.addEventListener('dom-ready', (w: any) => {
        if (!ref.current.isDevToolsOpened()) {
          // ref.current.openDevTools();
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
        setWebInfo({ ...webInfo, url });
        updateWebInfo();
      });
    }

    return () => {
      stopNetworkHandler();
    };
  }, [ref]);

  const ondataavailable = (e: any) => {
    recordChunk.push(e.data);
  };

  const stoprecording = async (t: string) => {
    const blob = new Blob(recordChunk, {
      type: 'video/webm',
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    await window.electron.ipcRenderer.showSaveDialog(buffer, {
      id: sesssionName,
      ref: t,
    });
    recordChunk = [];
  };

  const recordSession = async (t: string) => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          width: window.outerWidth,
          height: window.outerHeight,
          frameRate: 30,
        },
      })
      // eslint-disable-next-line promise/always-return
      .then((stream) => {
        // eslint-disable-next-line promise/always-return
        const mrStream = new MediaRecorder(stream, {
          mimeType: 'video/webm',
        });

        mrStream.ondataavailable = ondataavailable;
        mrStream.onstop = () => stoprecording(t);
        mrStream.start(1000);

        setMediaRecorder(mrStream);
      })
      .catch((e) => console.log(e));
  };

  const networkHandler = () => {
    const refTimestamp = `${new Date().getTime()}`;

    setTimestamp(refTimestamp);
    window.electron.ipcRenderer.recordSession({
      id: sesssionName,
      ref: refTimestamp,
    });
    recordSession(refTimestamp);
    setRecording(true);
  };

  const changeUrl = (e: any) => {
    e.preventDefault();

    let { url } = webInfo;
    if (url.indexOf('://') === -1) {
      url = `https://${url}`;
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
                <IoArrowBackOutline size={20} />
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (webInfo.canGoForward) {
                    ref.current.goForward();
                  }
                }}
              >
                <IoArrowForwardOutline size={20} />
              </div>
            </div>
            <div onClick={() => ref.current.reload()}>
              <IoReload size={18} />
            </div>
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
              style={{ flex: 1, width: '100%' }}
            />
          </form>
        </div>

        {!recording && (
          <div style={{ cursor: 'pointer' }} onClick={networkHandler}>
            <TbCaptureFilled size={20} />
          </div>
        )}
        {recording && (
          <div style={{ cursor: 'pointer' }} onClick={stopNetworkHandler}>
            <FaRegCircleStop size={20} />
          </div>
        )}
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
