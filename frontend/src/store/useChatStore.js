// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   allContacts: [],
//   chats: [],
//   messages: [],
//   activeTab: "chats",
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

//   toggleSound: () => {
//     localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
//     set({ isSoundEnabled: !get().isSoundEnabled });
//   },

//   setActiveTab: (tab) => set({ activeTab: tab }),
//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   getAllContacts: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/contacts");
//       set({ allContacts: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },
//   getMyChatPartners: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/chats");
//       set({ chats: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessagesByUserId: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     const { authUser } = useAuthStore.getState();

//     const tempId = `temp-${Date.now()}`;

//     const optimisticMessage = {
//       _id: tempId,
//       senderId: authUser._id,
//       receiverId: selectedUser._id,
//       text: messageData.text,
//       image: messageData.image,
//       createdAt: new Date().toISOString(),
//       isOptimistic: true, // flag to identify optimistic messages (optional)
//     };
//     // immidetaly update the ui by adding the message
//     set({ messages: [...messages, optimisticMessage] });

//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({ messages: messages.concat(res.data) });
//     } catch (error) {
//       // remove optimistic message on failure
//       set({ messages: messages });
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser, isSoundEnabled } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return;

//       const currentMessages = get().messages;
//       set({ messages: [...currentMessages, newMessage] });

//       if (isSoundEnabled) {
//         const notificationSound = new Audio("/sounds/notification.mp3");

//         notificationSound.currentTime = 0; // reset to start
//         notificationSound.play().catch((e) => console.log("Audio play failed:", e));
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//   },
// }));

// // frontend/src/store/useChatStore.js
// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { socket } from "../lib/socket"; // ✅ SINGLE SOURCE OF SOCKET
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   /* ===================== STATE ===================== */
//   allContacts: [],
//   chats: [],
//   messages: [],
//   activeTab: "chats",
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

//   /* ===================== UI HELPERS ===================== */
//   toggleSound: () => {
//     const next = !get().isSoundEnabled;
//     localStorage.setItem("isSoundEnabled", JSON.stringify(next));
//     set({ isSoundEnabled: next });
//   },

//   setActiveTab: (tab) => set({ activeTab: tab }),
//   setSelectedUser: (selectedUser) => set({ selectedUser, messages: [] }),

//   /* ===================== USERS / CHATS ===================== */
//   getAllContacts: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/contacts");
//       set({ allContacts: res.data });
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Failed to load contacts");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMyChatPartners: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/chats");
//       set({ chats: res.data });
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Failed to load chats");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   /* ===================== MESSAGES ===================== */
//   getMessagesByUserId: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Failed to load messages");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     const { authUser } = useAuthStore.getState();
//     if (!selectedUser || !authUser) return;

//     const optimisticMessage = {
//       _id: `temp-${Date.now()}`,
//       senderId: authUser._id,
//       receiverId: selectedUser._id,
//       text: messageData.text,
//       image: messageData.image,
//       createdAt: new Date().toISOString(),
//       isOptimistic: true,
//     };

//     set({ messages: [...messages, optimisticMessage] });

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         messageData
//       );

//       set((state) => ({
//         messages: state.messages
//           .filter((m) => !m.isOptimistic)
//           .concat(res.data),
//       }));
//     } catch (e) {
//       set({ messages });
//       toast.error(e.response?.data?.message || "Message send failed");
//     }
//   },

//   /* ===================== SOCKET (REALTIME) ===================== */
//   subscribeToMessages: () => {
//     const { selectedUser, isSoundEnabled } = get();
//     if (!selectedUser || !socket?.connected) return;

//     socket.off("newMessage"); // 🔑 prevent duplicate listeners

//     socket.on("newMessage", (newMessage) => {
//       if (newMessage.senderId !== selectedUser._id) return;

//       set((state) => ({
//         messages: [...state.messages, newMessage],
//       }));

//       if (isSoundEnabled) {
//         const audio = new Audio("/sounds/notification.mp3");
//         audio.currentTime = 0;
//         audio.play().catch(() => {});
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     if (!socket) return;
//     socket.off("newMessage");
//   },
// }));

// frontend/src/store/useChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  /* ===================== STATE ===================== */
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  /* ===================== UI HELPERS ===================== */
  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(next));
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) =>
    set({ selectedUser, messages: [] }),

  /* ===================== USERS / CHATS ===================== */
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ===================== MESSAGES ===================== */
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedUser || !authUser) return;

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      document: messageData.document,
      documentName: messageData.documentName,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messages: state.messages
          .filter((m) => !m.isOptimistic)
          .concat(res.data),
      }));
    } catch (e) {
      set({ messages });
      toast.error(e.response?.data?.message || "Message send failed");
    }
  },

  /* ===================== REALTIME SOCKET ===================== */
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    socket.off("newMessage"); // prevent duplicates

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      if (isSoundEnabled) {
        const audio = new Audio("/sounds/notification.mp3");
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
