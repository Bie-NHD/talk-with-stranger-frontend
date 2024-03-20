"use strict";

import { useEffect, useRef, useState } from "react";
import Media from "../utils/Media";

const useMedia = (defaultConfig = { audio: true, video: true }, videoRef) => {
  const [options, setOptions] = useState(defaultConfig);
  const [localStream, setLocalStream] = useState();
  const mediaObj = useRef();
  const [volume, setVolume] = useState(videoRef.current?.volume * 100 || 100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!mediaObj.current) {
        mediaObj.current = new Media(options);
        setLoading(true);
        await mediaObj.current.openStream();
        setLoading(false);
        videoRef.current.srcObject = mediaObj.current.getStream();
        setLocalStream(mediaObj.current.getStream());
      }
    })();

    const handleLocalVolume = (e) => {
      setVolume(videoRef.current.volume * 100);

      if (videoRef.current.volume === 0) {
        setOptions((prev) => ({ ...prev, audio: false }));
      } else {
        setOptions((prev) => ({ ...prev, audio: true }));
      }
    };

    videoRef.current?.addEventListener("volumechange", handleLocalVolume);

    return () => {
      if (mediaObj.current) {
        videoRef?.current?.removeEventListener(
          "volumechange",
          handleLocalVolume
        );
        mediaObj.current.clearStream();
      }
    };
  }, [videoRef]);

  useEffect(() => {
    if (options.video) {
      mediaObj.current.openWebcam();
    } else {
      mediaObj.current.closeWebcam();
    }

    if (options.audio) {
      mediaObj.current.openMic();
      videoRef.current.volume = 1;
    } else {
      mediaObj.current.muteMic();
      videoRef.current.volume = 0;
    }
  }, [options.audio, options.video, videoRef]);

  return [volume, setOptions, options, localStream, loading];
};

export default useMedia;
