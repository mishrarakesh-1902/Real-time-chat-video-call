


import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

// Get socket URL from environment or fallback based on environment
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return import.meta.env.PROD
    ? "https://real-time-chat-video-call-3n4r.onrender.com"
    : "http://localhost:3000";
};

const SOCKET_URL = getSocketUrl();

export const useAuthStore = create((set, get) => ({
  /* ================= AUTH ================= */
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  /* ================= SOCKET ================= */
  socket: null,
  onlineUsers: [],

  /* ================= CALL ================= */
  incomingCall: null,
  activeCall: null,
  peer: null,
  localStream: null,
  remoteStream: null,

  isMuted: false,
  isCameraOff: false,
  isAudioCall: false, // Track if current call is audio-only

  /* ================= AUTH ================= */
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      if (res.data) get().connectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      
      // Store token in localStorage for cross-domain auth fallback
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created");
    } catch (e) {
      toast.error(e.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      // Store token in localStorage for cross-domain auth fallback
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged in");
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    get().endCall();
    get().disconnectSocket();
    set({ authUser: null });
  },

  /* ================= SOCKET ================= */
  connectSocket: () => {
    if (get().socket?.connected) return;

    // Get token from localStorage for socket authentication
    const token = localStorage.getItem("authToken");

    const s = io(SOCKET_URL, { 
      withCredentials: true,
      timeout: 30000,
      reconnectionAttempts: 5,
      auth: token ? { token } : {},  // Send token with initial connection
    });

    // Connection error handling
    s.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (error.message.includes("CORS")) {
        toast.error("Connection blocked by CORS policy. Check server configuration.");
      } else if (error.message.includes("timeout")) {
        toast.error("Connection timeout. Please check your network.");
      }
    });

    s.on("connect", () => {
      console.log("Socket connected successfully");
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        s.connect();
      }
    });

    // Get token from localStorage for cross-domain auth (for reconnect)
    s.on("reconnect", () => {
      console.log("✅ Socket reconnected after reconnect");
      const token = localStorage.getItem("authToken");
      if (token) {
        s.auth.token = token;
      }
    });

    // Listen for online users updates
    s.on("getOnlineUsers", (users) => {
      console.log("📡 Received online users:", users);
      set({ onlineUsers: users });
    });

    s.on("video-call:incoming", ({ fromUserId, fromUser }) =>
      set({ incomingCall: { fromUserId, fromUser } })
    );

    s.on("video-call:accepted", ({ byUserId }) =>
      get().createOffer(byUserId)
    );

    s.on("webrtc:offer", ({ fromUserId, offer }) =>
      get().handleOffer(fromUserId, offer)
    );

    s.on("webrtc:answer", async ({ answer }) => {
      await get().peer?.setRemoteDescription(answer);
    });

    s.on("webrtc:ice-candidate", ({ candidate }) => {
      get().peer?.addIceCandidate(candidate);
    });

    s.on("video-call:ended", get().endCall);

    s.on("video-call:rejected", () => {
      set({ incomingCall: null, activeCall: null });
    });

    set({ socket: s });
    
    // Actually connect the socket
    s.connect();
  },

  disconnectSocket: () => {
    localStorage.removeItem("authToken");
    get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },

  /* ================= CALL ================= */
  startCall: (toUserId) => {
    get().socket.emit("video-call:initiate", { toUserId });
    set({ activeCall: { withUserId: toUserId } });
  },

  acceptCall: async () => {
    const { incomingCall } = get();
    if (!incomingCall) return;

    get().socket.emit("video-call:accept", {
      toUserId: incomingCall.fromUserId,
    });

    set({
      activeCall: { withUserId: incomingCall.fromUserId },
      incomingCall: null,
    });
  },

  rejectCall: () => {
    const { incomingCall } = get();
    if (!incomingCall) return;

    get().socket.emit("video-call:reject", {
      toUserId: incomingCall.fromUserId,
    });

    set({ incomingCall: null });
  },

  createOffer: async (toUserId) => {
    const peer = await get().createPeer(toUserId);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    get().socket.emit("webrtc:offer", { toUserId, offer });
  },

  handleOffer: async (fromUserId, offer) => {
    const peer = await get().createPeer(fromUserId);
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    get().socket.emit("webrtc:answer", {
      toUserId: fromUserId,
      answer,
    });
  },

  createPeer: async (withUserId) => {
    if (get().peer) return get().peer;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((t) => peer.addTrack(t, stream));

    peer.ontrack = (e) =>
      set({ remoteStream: e.streams[0] });

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        get().socket.emit("webrtc:ice-candidate", {
          toUserId: withUserId,
          candidate: e.candidate,
        });
      }
    };

    set({ peer, localStream: stream });
    return peer;
  },

  // Helper to restart a track type
  restartTrack: async (type) => {
    const peer = get().peer;
    if (!peer) return;
    
    try {
      const constraints = type === "audio" ? { audio: true } : { video: true };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = newStream.getTracks()[0];
      
      // Replace track in peer connection
      const sender = peer.getSenders().find(s => {
        if (type === "audio") return s.track?.kind === "audio";
        return s.track?.kind === "video";
      });
      
      if (sender) {
        await sender.replaceTrack(newTrack);
      }
      
      // Update local stream
      const oldStream = get().localStream;
      const newLocalStream = new MediaStream([...oldStream.getTracks(), newTrack]);
      set({ localStream: newLocalStream });
    } catch (err) {
      console.error(`Error restarting ${type}:`, err);
    }
  },

  toggleMute: () => {
    const stream = get().localStream;
    const isMuted = get().isMuted;
    
    if (isMuted) {
      // Unmute - restart audio track
      get().restartTrack("audio");
    } else {
      // Mute - stop all audio tracks and remove from stream
      stream?.getAudioTracks().forEach((t) => {
        t.stop();
        stream.removeTrack(t);
      });
    }
    
    set((s) => ({ isMuted: !s.isMuted }));
  },

  toggleCamera: () => {
    const stream = get().localStream;
    const isCameraOff = get().isCameraOff;
    
    if (isCameraOff) {
      // Turn on camera - restart video track
      get().restartTrack("video");
    } else {
      // Turn off camera - stop all video tracks and remove from stream
      stream?.getVideoTracks().forEach((t) => {
        t.stop();
        stream.removeTrack(t);
      });
    }
    
    set((s) => ({ isCameraOff: !s.isCameraOff }));
  },

  endCall: () => {
    get().localStream?.getTracks().forEach((t) => t.stop());
    get().peer?.close();

    if (get().activeCall) {
      get().socket.emit("video-call:end", {
        toUserId: get().activeCall.withUserId,
      });
    }

    set({
      activeCall: null,
      peer: null,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isCameraOff: false,
    });
  },
}));
