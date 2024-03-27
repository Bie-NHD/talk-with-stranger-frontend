"use strict";

class Media {
  constructor(config) {
    this.config = config;
  }

  setConfig(config) {
    this.config = config;
  }

  async openStream() {
    const stream = await navigator.mediaDevices.getUserMedia(this.config);
    this.stream = stream;
  }

  muteMic() {
    if (!this.stream) return;

    const audioTrack = this.stream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack?.enabled === true) {
      audioTrack.enabled = false;
    }
  }

  openMic() {
    if (!this.stream) return;

    const audioTrack = this.stream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack?.enabled === false) {
      audioTrack.enabled = true;
    }
  }

  openWebcam() {
    if (!this.stream) return;

    const videoTrack = this.stream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack?.enabled === false) {
      videoTrack.enabled = true;
    }
  }

  closeWebcam() {
    if (!this.stream) return;

    const videoTrack = this.stream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack?.enabled === true) {
      videoTrack.enabled = false;
    }
  }

  clearStream() {
    if (!this.stream) return;

    this.stream.getTracks().forEach((track) => track.stop());
  }

  getStream() {
    return this.stream;
  }
}

export default Media;
