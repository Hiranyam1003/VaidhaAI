import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, ArrowUp, FileText } from 'lucide-react';

interface ChatComposerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
      el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden';
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setInputText('');
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
      }}
    >
      {/* File attachment preview */}
      {selectedFile && (
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '11.5px',
            color: 'var(--workspace-text-main)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FileText size={12} color="var(--brand-sun)" />
          <span>Attached: <strong>{selectedFile}</strong> (Demo)</span>
          <button
            onClick={() => setSelectedFile(null)}
            aria-label="Remove attachment"
            style={{ marginLeft: '4px', color: '#888', fontSize: '13px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Pill-shaped Composer Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          padding: '8px 10px 8px 14px',
          boxShadow: 'var(--shadow-composer)',
          border: '1px solid var(--workspace-border)',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach document for verification (Demo)"
          aria-label="Attach document"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--workspace-text-subtle)',
            flexShrink: 0,
            marginBottom: '1px',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f4f3ef';
            e.currentTarget.style.color = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--workspace-text-subtle)';
          }}
        >
          <Paperclip size={17} />
        </button>

        {/* Multiline input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about schemes, eligibility or required documents…"
          aria-label="Message Vaidha AI"
          style={{
            flex: 1,
            maxHeight: '160px',
            resize: 'none',
            fontSize: '14px',
            lineHeight: '1.45',
            color: 'var(--workspace-text-main)',
            backgroundColor: 'transparent',
            padding: '7px 4px',
            fontFamily: 'inherit',
          }}
        />

        {/* Primary Send Button styled with brand accent */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || disabled}
          title="Send message (Enter)"
          aria-label="Send message"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? 'var(--brand-sun)' : '#ece9e2',
            color: inputText.trim() ? '#ffffff' : '#a39f96',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            marginBottom: '1px',
            transition: 'all 0.15s ease',
            boxShadow: inputText.trim() ? '0 2px 6px rgba(217, 72, 43, 0.35)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = '#c43e22';
            }
          }}
          onMouseLeave={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--brand-sun)';
            }
          }}
        >
          <ArrowUp size={17} strokeWidth={2.4} />
        </button>
      </div>

      {/* Subtle Hint */}
      <div
        className="composer-hint"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '6px',
          fontSize: '11px',
          color: 'var(--workspace-text-subtle)',
        }}
      >
        <span>Press <kbd style={{ padding: '1px 4px', borderRadius: '4px', backgroundColor: '#e8e5dc', fontSize: '10px' }}>Enter ↵</kbd> to ask</span>
        <span>•</span>
        <span><kbd style={{ padding: '1px 4px', borderRadius: '4px', backgroundColor: '#e8e5dc', fontSize: '10px' }}>Shift + Enter</kbd> for new line</span>
      </div>
    </div>
  );
};
