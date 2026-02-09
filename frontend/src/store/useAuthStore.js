// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// // const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
// // const BASE_URL = import.meta.env.MODE === "development" ? "https://real-time-chat1-8hhq.onrender.com" : "/";
// const BASE_URL = "https://real-time-chat1-8hhq.onrender.com";

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,
//   socket: null,
//   onlineUsers: [],

//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });
//       get().connectSocket();
//     } catch (error) {
//       console.log("Error in authCheck:", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });

//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       toast.success("Logged in successfully");

//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error("Error logging out");
//       console.log("Logout error:", error);
//     }
//   },

//   updateProfile: async (data) => {
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("Error in update profile:", error);
//       toast.error(error.response.data.message);
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       withCredentials: true, // this ensures cookies are sent with the connection
//     });

//     socket.connect();

//     set({ socket });

//     // listen for online users event
//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },

//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },
// }));


// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = "https://real-time-chat1-8hhq.onrender.com";

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,
//   socket: null,
//   onlineUsers: [],

//   /* ===================== CHECK AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });

//       // connect socket ONLY if user is authenticated
//       get().connectSocket();
//     } catch (error) {
//       // ❗ 401 here is NORMAL (user not logged in)
//       // ❌ DO NOT show toast
//       // ❌ DO NOT treat as real error
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   /* ===================== SIGNUP ===================== */
//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });

//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   /* ===================== LOGIN ===================== */
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   /* ===================== LOGOUT ===================== */
//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });

//       get().disconnectSocket();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       toast.error("Error logging out");
//       console.log("Logout error:", error);
//     }
//   },

//   /* ===================== UPDATE PROFILE ===================== */
//   updateProfile: async (data) => {
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Update failed");
//     }
//   },

//   /* ===================== SOCKET ===================== */
//   connectSocket: () => {
//     const { authUser, socket } = get();
//     if (!authUser || socket?.connected) return;

//     const newSocket = io(BASE_URL, {
//       withCredentials: true,
//     });

//     newSocket.connect();

//     newSocket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });

//     set({ socket: newSocket });
//   },

//   disconnectSocket: () => {
//     const { socket } = get();
//     if (socket?.connected) socket.disconnect();
//   },
// }));


// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = "https://real-time-chat1-8hhq.onrender.com";

// export const useAuthStore = create((set, get) => ({
//   /* ===================== AUTH STATE ===================== */
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,

//   /* ===================== SOCKET STATE ===================== */
//   socket: null,
//   onlineUsers: [],

//   /* ===================== VIDEO CALL STATE ===================== */
//   incomingCall: null, // { fromUserId, offer, isGroup }
//   activeCall: null,   // { withUserId }

//   /* ===================== CHECK AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });

//       if (res.data) {
//         get().connectSocket();
//       }
//     } catch {
//       // user not logged in → NORMAL
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   /* ===================== SIGNUP ===================== */
//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });

//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   /* ===================== LOGIN ===================== */
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   /* ===================== LOGOUT ===================== */
//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({
//         authUser: null,
//         incomingCall: null,
//         activeCall: null,
//       });

//       get().disconnectSocket();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       toast.error("Error logging out");
//     }
//   },

//   /* ===================== UPDATE PROFILE ===================== */
//   updateProfile: async (data) => {
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Update failed");
//     }
//   },

//   /* ===================== SOCKET ===================== */
//   connectSocket: () => {
//     const { authUser, socket } = get();
//     if (!authUser || socket?.connected) return;

//     const newSocket = io(BASE_URL, {
//       withCredentials: true,
//     });

//     newSocket.connect();

//     /* ===== ONLINE USERS ===== */
//     newSocket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });

//     /* ===== VIDEO CALL EVENTS ===== */

//     // Incoming call
//     newSocket.on("incoming-call", ({ fromUserId, offer, isGroup }) => {
//       set({
//         incomingCall: { fromUserId, offer, isGroup },
//       });
//     });

//     // Call answered
//     newSocket.on("call-answered", ({ answer }) => {
//       // peerRef is attached by WebRTC logic (ChatHeader / hook)
//       newSocket.peerRef?.setRemoteDescription(answer);
//     });

//     // ICE candidate received
//     newSocket.on("ice-candidate", ({ candidate }) => {
//       newSocket.peerRef?.addIceCandidate(candidate);
//     });

//     // Call ended
//     newSocket.on("call-ended", () => {
//       set({
//         activeCall: null,
//         incomingCall: null,
//       });
//     });

//     set({ socket: newSocket });
//   },

//   disconnectSocket: () => {
//     const { socket } = get();
//     if (socket?.connected) socket.disconnect();
//     set({ socket: null });
//   },
// }));


// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// /* ===================== BASE URL (AUTO-DETECT) ===================== */
// const isLocalhost =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1";

// const BASE_URL = isLocalhost
//   ? "http://localhost:3000"
//   : "https://real-time-chat1-8hhq.onrender.com";

// /* ===================== AUTH STORE ===================== */
// export const useAuthStore = create((set, get) => ({
//   /* ===================== AUTH STATE ===================== */
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,

//   /* ===================== SOCKET STATE ===================== */
//   socket: null,
//   onlineUsers: [],

//   /* ===================== VIDEO CALL STATE ===================== */
//   incomingCall: null,
//   activeCall: null,

//   /* ===================== CHECK AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });

//       if (res.data) {
//         get().connectSocket();
//       }
//     } catch {
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   /* ===================== SIGNUP ===================== */
//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });
//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   /* ===================== LOGIN ===================== */
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   /* ===================== LOGOUT ===================== */
//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({
//         authUser: null,
//         incomingCall: null,
//         activeCall: null,
//       });

//       get().disconnectSocket();
//       toast.success("Logged out successfully");
//     } catch {
//       toast.error("Error logging out");
//     }
//   },

//   /* ===================== UPDATE PROFILE ===================== */
//   updateProfile: async (data) => {
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Update failed");
//     }
//   },

//   /* ===================== SOCKET ===================== */
//   connectSocket: () => {
//     const { authUser, socket } = get();
//     if (!authUser || socket?.connected) return;

//     const newSocket = io(BASE_URL, {
//       withCredentials: true,
//     });

//     /* ===== ONLINE USERS ===== */
//     newSocket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });

//     /* ===== VIDEO CALL EVENTS ===== */
//     newSocket.on("incoming-call", ({ fromUserId, offer }) => {
//       set({
//         incomingCall: {
//           fromUserId,
//           offer,
//           status: "ringing",
//         },
//       });
//     });


//     newSocket.on("call-answered", ({ answer }) => {
//       newSocket.peerRef?.setRemoteDescription(answer);
//     });

//     newSocket.on("ice-candidate", ({ candidate }) => {
//       newSocket.peerRef?.addIceCandidate(candidate);
//     });

//     newSocket.on("call-ended", () => {
//       set({ activeCall: null, incomingCall: null });
//     });

//     set({ socket: newSocket });
//   },

//   disconnectSocket: () => {
//     const { socket } = get();
//     if (socket?.connected) socket.disconnect();
//     set({ socket: null });
//   },
// }));

// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// /* ===================== BASE URL ===================== */
// const isLocalhost =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1";

// const BASE_URL = isLocalhost
//   ? "http://localhost:3000"
//   : "https://real-time-chat1-8hhq.onrender.com";

// /* ===================== AUTH STORE ===================== */
// export const useAuthStore = create((set, get) => ({
//   /* ===================== AUTH STATE ===================== */
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,

//   /* ===================== SOCKET STATE ===================== */
//   socket: null,
//   onlineUsers: [],

//   /* ===================== VIDEO CALL STATE ===================== */
//   incomingCall: null, // { fromUserId, offer, status }
//   activeCall: null,   // { withUserId }
//   localStream: null,
//   remoteStream: null,

//   /* ===================== CHECK AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });
//       if (res.data) get().connectSocket();
//     } catch {
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   /* ===================== SIGNUP ===================== */
//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });
//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   /* ===================== LOGIN ===================== */
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   /* ===================== LOGOUT ===================== */
//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       get().endCall();
//       get().disconnectSocket();
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//     } catch {
//       toast.error("Error logging out");
//     }
//   },

//   /* ===================== SOCKET ===================== */
//   connectSocket: () => {
//     const { authUser, socket } = get();
//     if (!authUser || socket?.connected) return;

//     const newSocket = io(BASE_URL, { withCredentials: true });

//     /* ===== ONLINE USERS ===== */
//     newSocket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });

//     /* ===== INCOMING CALL ===== */
//     newSocket.on("incoming-call", ({ fromUserId, offer }) => {
//       set({
//         incomingCall: {
//           fromUserId,
//           offer,
//           status: "ringing",
//         },
//       });
//     });

//     /* ===== CALL ANSWERED ===== */
//     newSocket.on("call-answered", async ({ answer }) => {
//       await newSocket.peerRef?.setRemoteDescription(answer);
//     });

//     /* ===== ICE CANDIDATES ===== */
//     newSocket.on("ice-candidate", async ({ candidate }) => {
//       try {
//         await newSocket.peerRef?.addIceCandidate(candidate);
//       } catch (e) {
//         console.error("ICE error:", e);
//       }
//     });

//     /* ===== CALL ENDED ===== */
//     newSocket.on("call-ended", () => {
//       get().endCall();
//     });

//     set({ socket: newSocket });
//   },

//   disconnectSocket: () => {
//     const { socket } = get();
//     if (socket?.connected) socket.disconnect();
//     set({ socket: null });
//   },

//   /* ===================== ACCEPT CALL (RECEIVER SIDE) ===================== */
//   acceptCall: async () => {
//     const { socket, incomingCall } = get();
//     if (!socket || !incomingCall) return;

//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     stream.getTracks().forEach((track) => peer.addTrack(track, stream));

//     peer.ontrack = (event) => {
//       set({ remoteStream: event.streams[0] });
//     };

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           toUserId: incomingCall.fromUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     await peer.setRemoteDescription(incomingCall.offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     socket.emit("answer-call", {
//       toUserId: incomingCall.fromUserId,
//       answer,
//     });

//     socket.peerRef = peer;

//     set({
//       localStream: stream,
//       activeCall: { withUserId: incomingCall.fromUserId },
//       incomingCall: null,
//     });
//   },

//   /* ===================== END CALL ===================== */
//   endCall: () => {
//     const { socket, localStream } = get();

//     localStream?.getTracks().forEach((t) => t.stop());
//     socket?.peerRef?.close();

//     set({
//       activeCall: null,
//       incomingCall: null,
//       localStream: null,
//       remoteStream: null,
//     });
//   },
// }));



// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// /* ===================== BASE URL ===================== */
// const isLocalhost =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1";

// const BASE_URL = isLocalhost
//   ? "http://localhost:3000"
//   : "https://real-time-chat1-8hhq.onrender.com";

// /* ===================== STORE ===================== */
// export const useAuthStore = create((set, get) => ({
//   /* ===== AUTH ===== */
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,

//   /* ===== SOCKET ===== */
//   socket: null,
//   onlineUsers: [],

//   /* ===== CALL STATE ===== */
//   incomingCall: null,
//   activeCall: null,
//   localStream: null,
//   remoteStream: null,
//   pendingIce: [],

//   /* ===================== AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });
//       if (res.data) get().connectSocket();
//     } catch {
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (e) {
//       toast.error("Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     await axiosInstance.post("/auth/logout");
//     get().endCall();
//     get().disconnectSocket();
//     set({ authUser: null });
//   },

//   /* ===================== SOCKET ===================== */
//   connectSocket: () => {
//     const { authUser, socket } = get();
//     if (!authUser || socket?.connected) return;

//     const s = io(BASE_URL, { withCredentials: true });

//     s.on("getOnlineUsers", (users) => set({ onlineUsers: users }));

//     s.on("incoming-call", ({ fromUserId, offer }) => {
//       set({ incomingCall: { fromUserId, offer } });
//     });

//     s.on("call-answered", async ({ answer }) => {
//       const peer = s.peer;
//       if (!peer) return;

//       await peer.setRemoteDescription(answer);

//       get().pendingIce.forEach((c) => peer.addIceCandidate(c));
//       set({ pendingIce: [] });
//     });

//     s.on("ice-candidate", ({ candidate }) => {
//       const peer = s.peer;
//       if (peer?.remoteDescription) {
//         peer.addIceCandidate(candidate);
//       } else {
//         set((st) => ({ pendingIce: [...st.pendingIce, candidate] }));
//       }
//     });

//     s.on("call-ended", get().endCall);

//     set({ socket: s });
//   },

//   disconnectSocket: () => {
//     const s = get().socket;
//     if (s?.connected) s.disconnect();
//     set({ socket: null });
//   },

//   /* ===================== START CALL (CALLER) ===================== */
//   startCall: async (toUserId) => {
//     const { socket } = get();
//     if (!socket) return;

//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     stream.getTracks().forEach((t) => peer.addTrack(t, stream));

//     peer.ontrack = (e) => set({ remoteStream: e.streams[0] });

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", { toUserId, candidate: e.candidate });
//       }
//     };

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);

//     socket.emit("call-user", { toUserId, offer });

//     socket.peer = peer;

//     set({
//       localStream: stream,
//       activeCall: { withUserId: toUserId },
//     });
//   },

//   /* ===================== ACCEPT CALL (RECEIVER) ===================== */
//   acceptCall: async () => {
//     const { socket, incomingCall } = get();
//     if (!socket || !incomingCall) return;

//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     stream.getTracks().forEach((t) => peer.addTrack(t, stream));

//     peer.ontrack = (e) => set({ remoteStream: e.streams[0] });

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           toUserId: incomingCall.fromUserId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     await peer.setRemoteDescription(incomingCall.offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     socket.emit("answer-call", {
//       toUserId: incomingCall.fromUserId,
//       answer,
//     });

//     socket.peer = peer;

//     set({
//       localStream: stream,
//       activeCall: { withUserId: incomingCall.fromUserId },
//       incomingCall: null,
//     });
//   },

//   /* ===================== END CALL ===================== */
//   endCall: () => {
//     const { socket, localStream } = get();
//     localStream?.getTracks().forEach((t) => t.stop());
//     socket?.peer?.close();

//     set({
//       activeCall: null,
//       incomingCall: null,
//       localStream: null,
//       remoteStream: null,
//       pendingIce: [],
//     });
//   },
// }));









// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { socket, connectSocket, disconnectSocket } from "../lib/socket";

// export const useAuthStore = create((set, get) => ({
//   /* ===================== AUTH ===================== */
//   authUser: null,
//   isCheckingAuth: true,
//   isLoggingIn: false,

//   /* ===================== SOCKET ===================== */
//   onlineUsers: [],

//   /* ===================== CALL STATE ===================== */
//   incomingCall: null, // { fromUserId, fromUser }
//   activeCall: null,   // { withUserId }
//   localStream: null,
//   remoteStream: null,
//   peer: null,
//   pendingIce: [],

//   /* ===================== AUTH ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });

//       if (res.data?.token) {
//         connectSocket(res.data.token);
//         get().registerSocketEvents();
//       }
//     } catch {
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       connectSocket(res.data.token);
//       get().registerSocketEvents();

//       toast.success("Logged in");
//     } catch {
//       toast.error("Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     await axiosInstance.post("/auth/logout");
//     get().endCall();
//     disconnectSocket();
//     set({ authUser: null });
//   },

//   /* ===================== SOCKET EVENTS ===================== */
//   registerSocketEvents: () => {
//     socket.on("getOnlineUsers", (users) =>
//       set({ onlineUsers: users })
//     );

//     socket.on("video-call:incoming", ({ fromUserId, fromUser }) => {
//       set({ incomingCall: { fromUserId, fromUser } });
//     });

//     socket.on("video-call:accepted", async ({ byUserId }) => {
//       await get().createOffer(byUserId);
//     });

//     socket.on("webrtc:offer", async ({ fromUserId, offer }) => {
//       await get().handleOffer(fromUserId, offer);
//     });

//     socket.on("webrtc:answer", async ({ answer }) => {
//       const peer = get().peer;
//       if (peer) await peer.setRemoteDescription(answer);
//     });

//     socket.on("webrtc:ice-candidate", ({ candidate }) => {
//       const peer = get().peer;
//       if (peer?.remoteDescription) {
//         peer.addIceCandidate(candidate);
//       } else {
//         set((s) => ({ pendingIce: [...s.pendingIce, candidate] }));
//       }
//     });

//     socket.on("video-call:ended", get().endCall);
//   },

//   /* ===================== CALLER ===================== */
//   startCall: (toUserId) => {
//     socket.emit("video-call:initiate", { toUserId });
//     set({ activeCall: { withUserId: toUserId } });
//   },

//   createOffer: async (toUserId) => {
//     const peer = get().createPeer(toUserId);

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);

//     socket.emit("webrtc:offer", { toUserId, offer });
//   },

//   /* ===================== RECEIVER ===================== */
//   acceptCall: async () => {
//     const { incomingCall } = get();
//     if (!incomingCall) return;

//     socket.emit("video-call:accept", {
//       toUserId: incomingCall.fromUserId,
//     });

//     set({
//       activeCall: { withUserId: incomingCall.fromUserId },
//       incomingCall: null,
//     });
//   },

//   handleOffer: async (fromUserId, offer) => {
//     const peer = get().createPeer(fromUserId);

//     await peer.setRemoteDescription(offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     socket.emit("webrtc:answer", {
//       toUserId: fromUserId,
//       answer,
//     });

//     get().pendingIce.forEach((c) => peer.addIceCandidate(c));
//     set({ pendingIce: [] });
//   },

//   /* ===================== PEER ===================== */
//   createPeer: async (withUserId) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     stream.getTracks().forEach((t) => peer.addTrack(t, stream));

//     peer.ontrack = (e) => set({ remoteStream: e.streams[0] });

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("webrtc:ice-candidate", {
//           toUserId: withUserId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     set({ peer, localStream: stream });
//     return peer;
//   },

//   /* ===================== END CALL ===================== */
//   endCall: () => {
//     const { peer, localStream, activeCall } = get();

//     localStream?.getTracks().forEach((t) => t.stop());
//     peer?.close();

//     if (activeCall) {
//       socket.emit("video-call:end", {
//         toUserId: activeCall.withUserId,
//       });
//     }

//     set({
//       activeCall: null,
//       incomingCall: null,
//       localStream: null,
//       remoteStream: null,
//       peer: null,
//       pendingIce: [],
//     });
//   },
// }));


// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { io } from "socket.io-client";

// /* =====================
//    SOCKET URL
// ===================== */
// const isLocalhost =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1";

// const SOCKET_URL = isLocalhost
//   ? "http://localhost:3000"
//   : "https://real-time-chat1-8hhq.onrender.com";

// /* =====================
//    AUTH STORE
// ===================== */
// export const useAuthStore = create((set, get) => ({
//   /* ===================== AUTH ===================== */
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,

//   /* ===================== SOCKET ===================== */
//   socket: null,
//   onlineUsers: [],

//   /* ===================== CALL STATE ===================== */
//   incomingCall: null, // { fromUserId, fromUser }
//   activeCall: null,   // { withUserId }
//   localStream: null,
//   remoteStream: null,
//   peer: null,
//   pendingIce: [],

//   /* =====================
//      AUTH CHECK
//   ===================== */
//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });

//       if (res.data) {
//         get().connectSocket();
//       }
//     } catch {
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   /* =====================
//      SIGNUP ✅ FIXED
//   ===================== */
//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });

//       toast.success("Account created successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Signup failed"
//       );
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   /* =====================
//      LOGIN
//   ===================== */
//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       toast.success("Logged in");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Login failed"
//       );
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   /* =====================
//      LOGOUT
//   ===================== */
//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//     } catch {}

//     get().endCall();
//     get().disconnectSocket();
//     set({ authUser: null });
//   },

//   /* =====================
//      SOCKET CONNECT
//   ===================== */
//   connectSocket: () => {
//     const { socket } = get();
//     if (socket?.connected) return;

//     const s = io(SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("getOnlineUsers", (users) =>
//       set({ onlineUsers: users })
//     );

//     /* ===== VIDEO CALL EVENTS ===== */
//     s.on("video-call:incoming", ({ fromUserId, fromUser }) => {
//       set({ incomingCall: { fromUserId, fromUser } });
//     });

//     s.on("video-call:accepted", ({ byUserId }) => {
//       get().createOffer(byUserId);
//     });

//     s.on("webrtc:offer", ({ fromUserId, offer }) => {
//       get().handleOffer(fromUserId, offer);
//     });

//     s.on("webrtc:answer", async ({ answer }) => {
//       const peer = get().peer;
//       if (peer) await peer.setRemoteDescription(answer);
//     });

//     s.on("webrtc:ice-candidate", ({ candidate }) => {
//       const peer = get().peer;
//       if (peer?.remoteDescription) {
//         peer.addIceCandidate(candidate);
//       } else {
//         set((s) => ({
//           pendingIce: [...s.pendingIce, candidate],
//         }));
//       }
//     });

//     s.on("video-call:ended", get().endCall);

//     set({ socket: s });
//   },

//   disconnectSocket: () => {
//     const s = get().socket;
//     if (s?.connected) s.disconnect();
//     set({ socket: null, onlineUsers: [] });
//   },

//   /* =====================
//      CALLER
//   ===================== */
//   startCall: (toUserId) => {
//     const { socket } = get();
//     socket.emit("video-call:initiate", { toUserId });
//     set({ activeCall: { withUserId: toUserId } });
//   },

//   createOffer: async (toUserId) => {
//     const peer = await get().createPeer(toUserId);
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);

//     get().socket.emit("webrtc:offer", { toUserId, offer });
//   },

//   /* =====================
//      RECEIVER
//   ===================== */
//   acceptCall: async () => {
//     const { incomingCall, socket } = get();
//     if (!incomingCall) return;

//     socket.emit("video-call:accept", {
//       toUserId: incomingCall.fromUserId,
//     });

//     set({
//       activeCall: { withUserId: incomingCall.fromUserId },
//       incomingCall: null,
//     });
//   },

//   handleOffer: async (fromUserId, offer) => {
//     const peer = await get().createPeer(fromUserId);

//     await peer.setRemoteDescription(offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     get().socket.emit("webrtc:answer", {
//       toUserId: fromUserId,
//       answer,
//     });

//     get().pendingIce.forEach((c) => peer.addIceCandidate(c));
//     set({ pendingIce: [] });
//   },

//   /* =====================
//      PEER
//   ===================== */
//   createPeer: async (withUserId) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     stream.getTracks().forEach((t) =>
//       peer.addTrack(t, stream)
//     );

//     peer.ontrack = (e) =>
//       set({ remoteStream: e.streams[0] });

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         get().socket.emit("webrtc:ice-candidate", {
//           toUserId: withUserId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     set({ peer, localStream: stream });
//     return peer;
//   },

//   /* =====================
//      END CALL
//   ===================== */
//   endCall: () => {
//     const { peer, localStream, activeCall, socket } = get();

//     localStream?.getTracks().forEach((t) => t.stop());
//     peer?.close();

//     if (activeCall) {
//       socket.emit("video-call:end", {
//         toUserId: activeCall.withUserId,
//       });
//     }

//     set({
//       activeCall: null,
//       incomingCall: null,
//       localStream: null,
//       remoteStream: null,
//       peer: null,
//       pendingIce: [],
//     });
//   },
// }));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://real-time-chat-video-call-3n4r.onrender.com";

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

    const s = io(SOCKET_URL, { withCredentials: true });

    // Get token from localStorage for cross-domain auth
    const token = localStorage.getItem("authToken");
    if (token) {
      s.auth.token = token;
    }

    s.on("getOnlineUsers", (users) => set({ onlineUsers: users }));

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
