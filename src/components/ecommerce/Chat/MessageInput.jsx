import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { MdAttachFile, MdSend, MdCamera, MdClose, MdPhoto } from "react-icons/md";

const MessageInput = ({ input, setInput, handleSend, onPhotosSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const attachButtonRef = useRef(null);

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
    <div className="modern-message-input">
      <div className="input-container">
        <div className="input-wrapper">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-textarea"
          />

          <Button
            ref={attachButtonRef}
            className="attach-btn"
            onClick={() => setShowOptions(!showOptions)}
            variant="link"
          >
            <MdAttachFile size={20} />
          </Button>
        </div>

        <Button
          className={`send-btn ${input.trim() ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!input.trim()}
          variant="link"
        >
          <MdSend size={20} />
        </Button>
      </div>

      {showOptions && (
        <div className="attachment-menu-dropdown">
          <div className="menu-header">
            <span>Share</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowOptions(false)}
              className="close-menu-btn"
            >
              <MdClose size={16} />
            </Button>
          </div>

          <div className="menu-options">
            <button className="menu-option" onClick={handlePhotosClick}>
              <MdPhoto size={24} />
              <span>Photos</span>
            </button>

            <button className="menu-option" onClick={handleCameraClick}>
              <MdCamera size={24} />
              <span>Camera</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .modern-message-input {
          background: rgba(15, 26, 36, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(100, 255, 218, 0.1);
          padding: 16px 20px;
          position: relative;
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          max-width: 100%;
        }



        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 22px;
          padding: 4px;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .input-wrapper:focus-within {
          border-color: #64ffda;
          background: rgba(100, 255, 218, 0.08);
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.15);
        }

        .message-textarea {
          flex: 1;
          border: none !important;
          background: transparent !important;
          color: #ffffff !important;
          font-size: 0.95rem;
          line-height: 1.4;
          resize: none;
          min-height: 20px;
          max-height: 120px;
          padding: 8px 12px;
          overflow-y: auto;
        }

        .message-textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .message-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .attach-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          margin-right: 4px;
        }

        .attach-btn:hover {
          color: #64ffda;
          background: rgba(100, 255, 218, 0.1);
          transform: rotate(45deg);
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          flex-shrink: 0;
        }

        .send-btn.active {
          color: #64ffda;
          background: rgba(100, 255, 218, 0.1);
        }

        .send-btn.active:hover {
          background: rgba(100, 255, 218, 0.2);
          transform: scale(1.1);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .attachment-menu-dropdown {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: rgba(26, 44, 58, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          min-width: 200px;
          animation: menuSlideIn 0.2s ease-out;
          z-index: 1050;
          margin-bottom: 8px;
        }

        @keyframes menuSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .menu-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(100, 255, 218, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: #64ffda;
        }

        .close-menu-btn {
          color: rgba(255, 255, 255, 0.7);
          padding: 0;
          border: none;
          background: transparent;
        }

        .close-menu-btn:hover {
          color: #64ffda;
        }

        .menu-options {
          padding: 8px;
        }

        .menu-option {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 4px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          text-align: left;
        }

        .menu-option:hover {
          background: rgba(100, 255, 218, 0.1);
          color: #64ffda;
          transform: translateX(5px);
        }

        .menu-option span {
          font-size: 0.9rem;
        }

        .message-textarea::-webkit-scrollbar {
          width: 4px;
        }

        .message-textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        .message-textarea::-webkit-scrollbar-thumb {
          background: rgba(100, 255, 218, 0.3);
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .modern-message-input { padding: 12px 16px; }
          .input-container { gap: 8px; }
          .send-btn { width: 40px; height: 40px; }
          .attach-btn { width: 32px; height: 32px; }
          .message-textarea { font-size: 0.9rem; padding: 6px 10px; }
        }

        /* Light Mode Support */
        [data-theme='light'] .modern-message-input {
          background: rgba(255, 255, 255, 0.98);
          border-top: 1px solid rgba(0, 180, 216, 0.15);
        }

        [data-theme='light'] .input-wrapper {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 180, 216, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        [data-theme='light'] .input-wrapper:focus-within {
          border-color: #00b4d8;
          background: rgba(0, 180, 216, 0.05);
          box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15);
        }

        [data-theme='light'] .message-textarea {
          color: #000000 !important;
          background: transparent !important;
        }

        [data-theme='light'] .message-textarea::placeholder {
          color: rgba(0, 0, 0, 0.7) !important;
        }

        [data-theme='light'] .attach-btn {
          color: rgba(0, 0, 0, 0.6);
        }

        [data-theme='light'] .attach-btn:hover {
          color: #00b4d8;
          background: rgba(0, 180, 216, 0.1);
        }

        [data-theme='light'] .send-btn {
          color: rgba(0, 0, 0, 0.4);
        }

        [data-theme='light'] .send-btn.active {
          color: #00b4d8;
          background: rgba(0, 180, 216, 0.1);
        }

        [data-theme='light'] .send-btn.active:hover {
          background: rgba(0, 180, 216, 0.2);
        }

        [data-theme='light'] .attachment-menu-dropdown {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(0, 180, 216, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        [data-theme='light'] .menu-header {
          border-bottom-color: rgba(0, 180, 216, 0.1);
          color: #0077b6;
        }

        [data-theme='light'] .close-menu-btn {
          color: rgba(0, 0, 0, 0.6);
        }

        [data-theme='light'] .close-menu-btn:hover {
          color: #00b4d8;
        }

        [data-theme='light'] .menu-option {
          color: rgba(0, 0, 0, 0.7);
        }

        [data-theme='light'] .menu-option:hover {
          background: rgba(0, 180, 216, 0.1);
          color: #00b4d8;
        }

        [data-theme='light'] .message-textarea::-webkit-scrollbar-thumb {
          background: rgba(0, 180, 216, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
