// import { useRef } from "react";

// export function useWebRTC(socket, remoteUserId) {
//   const peerRef = useRef(null);
//   const localStreamRef = useRef(null);

//   const createPeer = (onTrack) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     peer.ontrack = onTrack;

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           toUserId: remoteUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerRef.current = peer;
//     return peer;
//   };

//   const getMedia = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStreamRef.current = stream;
//     return stream;
//   };

//   return {
//     peerRef,
//     localStreamRef,
//     createPeer,
//     getMedia,
//   };
// }



// import { useRef, useState } from "react";

// export function useWebRTC(socket, remoteUserId) {
//   /* ===================== REFS ===================== */
//   const peerRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(new MediaStream());
//   const recorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   /* ===================== STATE ===================== */
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   /* ===================== CREATE PEER ===================== */
//   const createPeer = () => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     // receive remote tracks
//     peer.ontrack = (event) => {
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStreamRef.current.addTrack(track);
//       });
//     };

//     // send ICE candidates
//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           toUserId: remoteUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerRef.current = peer;
//     return peer;
//   };

//   /* ===================== GET MEDIA ===================== */
//   const getMedia = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     localStreamRef.current = stream;
//     return stream;
//   };

//   /* ===================== MUTE / UNMUTE ===================== */
//   const toggleMute = () => {
//     if (!localStreamRef.current) return;

//     localStreamRef.current.getAudioTracks().forEach((track) => {
//       track.enabled = isMuted;
//     });

//     setIsMuted(!isMuted);
//   };

//   /* ===================== CAMERA ON / OFF ===================== */
//   const toggleCamera = () => {
//     if (!localStreamRef.current) return;

//     localStreamRef.current.getVideoTracks().forEach((track) => {
//       track.enabled = isCameraOff;
//     });

//     setIsCameraOff(!isCameraOff);
//   };

//   /* ===================== RECORDING ===================== */
//   const startRecording = () => {
//     if (!localStreamRef.current || isRecording) return;

//     recordedChunksRef.current = [];
//     const recorder = new MediaRecorder(localStreamRef.current);

//     recorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(event.data);
//       }
//     };

//     recorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, {
//         type: "video/webm",
//       });

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `call-recording-${Date.now()}.webm`;
//       a.click();
//       URL.revokeObjectURL(url);
//     };

//     recorder.start();
//     recorderRef.current = recorder;
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     if (!recorderRef.current || !isRecording) return;

//     recorderRef.current.stop();
//     recorderRef.current = null;
//     setIsRecording(false);
//   };

//   /* ===================== CLEANUP ===================== */
//   const cleanup = () => {
//     peerRef.current?.close();
//     peerRef.current = null;

//     localStreamRef.current?.getTracks().forEach((track) => track.stop());
//     localStreamRef.current = null;

//     remoteStreamRef.current = new MediaStream();
//     setIsMuted(false);
//     setIsCameraOff(false);
//     setIsRecording(false);
//   };

//   /* ===================== EXPORT ===================== */
//   return {
//     peerRef,
//     localStreamRef,
//     remoteStreamRef,
//     createPeer,
//     getMedia,
//     toggleMute,
//     toggleCamera,
//     startRecording,
//     stopRecording,
//     cleanup,
//     isMuted,
//     isCameraOff,
//     isRecording,
//   };
// }


// import { useRef, useState, useEffect } from "react";
// import { socket } from "../lib/socket";

// const ICE_SERVERS = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// export function useWebRTC(activeCall) {
//   /* ===================== REFS ===================== */
//   const peerRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const recorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   /* ===================== STATE ===================== */
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   /* ===================== CREATE PEER ===================== */
//   const createPeer = async (remoteUserId) => {
//     if (peerRef.current) return peerRef.current;

//     const peer = new RTCPeerConnection(ICE_SERVERS);

//     // get user media
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     localStreamRef.current = stream;
//     localVideoRef.current.srcObject = stream;

//     stream.getTracks().forEach((track) =>
//       peer.addTrack(track, stream)
//     );

//     // receive remote stream
//     peer.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     // ICE candidates
//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("webrtc:ice-candidate", {
//           toUserId: remoteUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerRef.current = peer;
//     return peer;
//   };

//   /* ===================== MUTE ===================== */
//   const toggleMute = () => {
//     if (!localStreamRef.current) return;

//     localStreamRef.current.getAudioTracks().forEach(
//       (track) => (track.enabled = !isMuted)
//     );

//     setIsMuted(!isMuted);
//   };

//   /* ===================== CAMERA ===================== */
//   const toggleCamera = () => {
//     if (!localStreamRef.current) return;

//     localStreamRef.current.getVideoTracks().forEach(
//       (track) => (track.enabled = !isCameraOff)
//     );

//     setIsCameraOff(!isCameraOff);
//   };

//   /* ===================== RECORDING ===================== */
//   const startRecording = () => {
//     if (!localStreamRef.current || isRecording) return;

//     recordedChunksRef.current = [];
//     const recorder = new MediaRecorder(localStreamRef.current);

//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) recordedChunksRef.current.push(e.data);
//     };

//     recorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, {
//         type: "video/webm",
//       });
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `call-${Date.now()}.webm`;
//       a.click();

//       URL.revokeObjectURL(url);
//     };

//     recorder.start();
//     recorderRef.current = recorder;
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     recorderRef.current?.stop();
//     recorderRef.current = null;
//     setIsRecording(false);
//   };

//   /* ===================== CLEANUP ===================== */
//   const cleanup = () => {
//     peerRef.current?.close();
//     peerRef.current = null;

//     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     localStreamRef.current = null;

//     if (localVideoRef.current) localVideoRef.current.srcObject = null;
//     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

//     setIsMuted(false);
//     setIsCameraOff(false);
//     setIsRecording(false);
//   };

//   /* ===================== AUTO CLEAN ===================== */
//   useEffect(() => {
//     if (!activeCall) cleanup();
//   }, [activeCall]);

//   /* ===================== EXPORT ===================== */
//   return {
//     createPeer,
//     localVideoRef,
//     remoteVideoRef,
//     toggleMute,
//     toggleCamera,
//     startRecording,
//     stopRecording,
//     cleanup,
//     isMuted,
//     isCameraOff,
//     isRecording,
//   };
// }


import { useRef, useState, useEffect } from "react";
import { socket } from "../lib/socket";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC(activeCall) {
  /* ===================== REFS ===================== */
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  /* ===================== STATE ===================== */
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  /* ===================== CREATE PEER ===================== */
  const createPeer = async (remoteUserId) => {
    if (peerRef.current) return peerRef.current;

    const peer = new RTCPeerConnection(ICE_SERVERS);

    // 🎥 Get media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    // attach local stream to video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.muted = true; // prevent echo
    }

    // add tracks to peer
    stream.getTracks().forEach((track) =>
      peer.addTrack(track, stream)
    );

    // receive remote stream
    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:ice-candidate", {
          toUserId: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    peerRef.current = peer;
    return peer;
  };

  /* ===================== MIC TOGGLE ===================== */
  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // 🔑 IMPORTANT FIX
    });

    setIsMuted((prev) => !prev);
  };

  /* ===================== CAMERA TOGGLE ===================== */
  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff; // 🔑 IMPORTANT FIX
    });

    setIsCameraOff((prev) => !prev);
  };

  /* ===================== RECORDING ===================== */
  const startRecording = () => {
    if (!localStreamRef.current || isRecording) return;

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(localStreamRef.current, {
      mimeType: "video/webm",
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `call-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  /* ===================== CLEANUP ===================== */
  const cleanup = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;

    peerRef.current?.getSenders().forEach((s) => s.track?.stop());
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setIsMuted(false);
    setIsCameraOff(false);
    setIsRecording(false);
  };

  /* ===================== AUTO CLEAN ===================== */
  useEffect(() => {
    if (!activeCall) cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCall]);

  /* ===================== EXPORT ===================== */
  return {
    createPeer,
    localVideoRef,
    remoteVideoRef,
    toggleMute,
    toggleCamera,
    startRecording,
    stopRecording,
    cleanup,
    isMuted,
    isCameraOff,
    isRecording,
  };
}
