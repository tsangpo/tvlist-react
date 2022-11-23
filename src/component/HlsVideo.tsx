import Hls from 'hls.js';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  src: string;
};

export const HlsVideo: React.FunctionComponent<Props> = ({ src }) => {
  const [hls] = useState(() => new Hls());

  const callbackRef = useCallback((video: HTMLVideoElement) => {
    if (video) {
      hls.attachMedia(video);
    } else {
      hls.detachMedia();
    }
  }, []);

  useEffect(() => {
    hls.loadSource(src);
  }, [src]);

  return <video ref={callbackRef} src={src} autoPlay controls style={{ width: '100%' }}></video>;
};
