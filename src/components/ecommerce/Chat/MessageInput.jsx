import React, { useState } from "react";
import { MdAttachFile, MdSend, MdCamera, MdPhoto } from "react-icons/md";
import styles from "./MessageInput.module.css";

const MessageInput = ({ input, setInput, handleSend, onPhotosSelect }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleCameraClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.click();
    setShowOptions(false);
  };

  const handlePhotosClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0 && onPhotosSelect) {
        onPhotosSelect(files);
      }
    };
    input.click();
    setShowOptions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.messageInputContainer}>
      {showOptions && (
        <div className={styles.attachmentMenu}>
          <button className={styles.menuItem} onClick={handlePhotosClick}>
            <MdPhoto size={24} />
            <span>Photos</span>
          </button>

          <button className={styles.menuItem} onClick={handleCameraClick}>
            <MdCamera size={24} />
            <span>Camera</span>
          </button>
        </div>
      )}

      <div className={styles.inputWrapper}>
        <button
          className={styles.attachBtn}
          onClick={() => setShowOptions(!showOptions)}
          title="Attach files"
        >
          <MdAttachFile size={24} />
        </button>

        <textarea
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        />

        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!input.trim()}
          title="Send message"
        >
          <MdSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
