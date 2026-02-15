import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Image, X, FileText, ChevronDown } from 'lucide-react';
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
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const { selectedUser, sendMessage } = useChatStore();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    // Add event listener only if emoji picker is open
    if (showEmojiPicker && document) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (document) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [showEmojiPicker]);

  const handleSend = async () => {
    if ((!text.trim() && !image && !document) || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({
        text: text.trim(),
        image,
        document,
        documentName,
        recipientId: selectedUser._id,
      });
      setText('');
      setImage(null);
      setDocument(null);
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

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setDocument(reader.result);
      setDocumentName(file.name);
    };
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    setDocumentName('');
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div className="p-4 border-t border-surface-200 bg-white">
      {/* Document Preview */}
      {document && (
        <div className="relative inline-flex items-center gap-2 mb-3 px-3 py-2 bg-surface-100 rounded-lg">
          <FileText className="w-5 h-5 text-surface-500" />
          <span className="text-sm text-surface-700 truncate max-w-32">{documentName}</span>
          <button
            onClick={handleRemoveDocument}
            className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Image Preview */}
      {image && (
        <div className="relative inline-block mb-3">
          <img
            src={image}
            alt="Preview"
            className="h-24 rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                     flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-3">
        {/* Attachment Buttons */}
        <div className="relative flex items-center gap-1">
          <button
            onClick={() => documentInputRef.current?.click()}
            className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                     hover:bg-surface-50 transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                     hover:bg-surface-50 transition-colors"
            title="Send image"
          >
            <Image className="w-5 h-5" />
          </button>
          
          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 
                       hover:bg-surface-50 transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full left-0 mb-2 w-64 md:w-72 bg-white rounded-xl shadow-lg border border-surface-200 overflow-hidden z-50"
              >
                <div className="p-2 border-b border-surface-100">
                  <div className="flex gap-1">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                      <button
                        key={category}
                        className="px-2 py-1 text-xs font-medium text-surface-500 hover:bg-surface-100 rounded capitalize"
                      >
                        {category === 'frequently' ? '⭐' : category === 'smileys' ? '😀' : category === 'gestures' ? '👋' : '❤️'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-2 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJI_CATEGORIES.frequently.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-8 h-8 text-xl hover:bg-surface-100 rounded flex items-center justify-center transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="w-full py-1 text-xs text-surface-400 hover:bg-surface-50 border-t border-surface-100 flex items-center justify-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" /> Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Text Input */}
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl
                     text-surface-800 placeholder:text-surface-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     focus:border-primary-500 transition-all max-h-32"
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!text.trim() && !image && !document) || isSending}
          className={`p-3 rounded-2xl transition-all ${
            text.trim() || image || document
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-surface-100 text-surface-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={documentInputRef}
        onChange={handleDocumentSelect}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
}

export default MessageInput;
