import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';

// Common emojis for the picker
const EMOJI_CATEGORIES = {
  frequently: ['😀', '😂', '🥰', '😍', '😊', '🤔', '😎', '😭', '😡', '👍', '👎', '❤️', '🔥', '✨', '🎉'],
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
  objects: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💍', '💎', '👑', '🎀', '🎁', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
};

function MessageInput() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const { selectedUser, sendMessage } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSend = async () => {
    if ((!text.trim() && !image && !documentContent) || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({
        text: text.trim(),
        image,
        document: documentContent,
        documentName,
        recipientId: selectedUser._id,
      });
      setText('');
      setImage(null);
      setDocumentContent(null);
      setDocumentName('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleDocumentSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setDocumentContent(reader.result);
      setDocumentName(file.name);
    };
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleRemoveDocument = () => {
    setDocumentContent(null);
    setDocumentName('');
    if (documentInputRef.current) documentInputRef.current.value = '';
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-4 md:px-10 bg-[#111316]/60 backdrop-blur-2xl border-t border-[rgba(255,255,255,0.12)] shrink-0 z-30 relative shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      
      {/* Previews */}
      {(documentContent || image) && (
        <div className="flex gap-2 mb-4 max-w-5xl mx-auto">
          {documentContent && (
            <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-xl" style={{ backdropFilter: 'blur(10px)' }}>
              <span className="material-symbols-outlined text-[#c2c6d5]">description</span>
              <span className="text-sm text-[#e2e2e6] truncate max-w-32">{documentName}</span>
              <button
                onClick={handleRemoveDocument}
                className="w-5 h-5 bg-[#ffb4ab]/20 text-[#ffb4ab] rounded-full flex items-center justify-center hover:bg-[#ffb4ab]/30 transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}
          
          {image && (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="h-24 rounded-xl border border-[rgba(255,255,255,0.12)] object-cover shadow-md" />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#ffb4ab] text-[#93000a] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[14px] font-bold">close</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-end gap-3 max-w-5xl mx-auto relative">
        {/* Attachment Actions */}
        <div className="flex gap-1 mb-1 shrink-0 bg-[rgba(255,255,255,0.08)] rounded-full p-1 border border-[rgba(255,255,255,0.12)]">
          <button onClick={() => documentInputRef.current?.click()} className="w-10 h-10 rounded-full text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[#333538] transition-colors flex items-center justify-center group" title="Attach File">
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">attach_file</span>
          </button>
          <button onClick={() => imageInputRef.current?.click()} className="w-10 h-10 rounded-full text-[#c2c6d5] hover:text-[#e2e2e6] hover:bg-[#333538] transition-colors flex items-center justify-center group" title="Send Image">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">image</span>
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative bg-[#282a2d]/80 backdrop-blur-md border border-[rgba(255,255,255,0.12)] rounded-[24px] focus-within:border-[#aec6ff] focus-within:ring-1 focus-within:ring-[#aec6ff] transition-all shadow-inner group">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              adjustTextareaHeight(e);
            }}
            onKeyDown={handleKeyPress}
            className="w-full bg-transparent border-none focus:ring-0 text-[#e2e2e6] text-base px-5 py-3.5 max-h-32 resize-none placeholder:text-[#c2c6d5]/70 block"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            placeholder="Type a secure message..."
            rows={1}
          />
          <div className="absolute inset-0 rounded-[24px] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] opacity-100 transition-opacity"></div>
          
          {/* Emoji Picker Button */}
          <div className="absolute right-3 bottom-2 flex items-center">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-8 h-8 rounded-full text-[#c2c6d5] hover:text-[#aec6ff] transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mood</span>
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!text.trim() && !image && !documentContent) || isSending}
          className="w-14 h-14 mb-0.5 bg-gradient-to-br from-[#3578E5] to-[#7B61FF] text-white rounded-full shadow-[0_4px_16px_rgba(53,120,229,0.4)] hover:shadow-[0_8px_24px_rgba(53,120,229,0.6)] transition-all shrink-0 flex items-center justify-center hover:scale-[1.02] active:scale-95 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </button>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-[4.5rem] right-14 w-64 md:w-72 bg-[#282a2d] rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.12)] overflow-hidden z-50">
            <div className="p-2 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                  <button key={category} className="px-3 py-1.5 text-xs font-medium text-[#c2c6d5] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e2e2e6] rounded-lg capitalize whitespace-nowrap transition-colors">
                    {category === 'frequently' ? '⭐' : category === 'smileys' ? '😀' : category === 'gestures' ? '👋' : '❤️'}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES.frequently.map((emoji) => (
                  <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="w-8 h-8 text-xl hover:bg-[rgba(255,255,255,0.08)] rounded-lg flex items-center justify-center transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowEmojiPicker(false)} className="w-full py-2 text-xs font-bold uppercase tracking-wider text-[#c2c6d5] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e2e2e6] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[14px]">expand_more</span> Close
            </button>
          </div>
        )}
      </div>

      <input type="file" ref={documentInputRef} onChange={handleDocumentSelect} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageSelect} className="hidden" />
    </div>
  );
}

export default MessageInput;
