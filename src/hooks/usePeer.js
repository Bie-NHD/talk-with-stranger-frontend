"use strict";

import { useEffect, useState } from "react";
import { Peer } from "peerjs";

const usePeer = (onCall) => {
  const [peerInstance, setPeerInstance] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!peerInstance) {
      setPeerInstance(new Peer());
      setLoading(true);
    }

    if (peerInstance) {
      peerInstance.on("open", () => {
        setLoading(false);
      });
    }

    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
  }, [peerInstance]);

  useEffect(() => {
    let callEventSubscription;
    if (peerInstance) {
      callEventSubscription = peerInstance.on("call", onCall);
    }

    return () => {
      if (callEventSubscription) {
        callEventSubscription.off("call", onCall);
      }
    };
  }, [peerInstance, onCall]);

  return [peerInstance, loading];
};

export default usePeer;
