import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, ArrowUp, Mic, FileText } from 'lucide-react';

interface ComposerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const Composer: React.FC<ComposerProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea vertically as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      // Demo simulated voice input
      const timer = setTimeout(() => {
        setInputText((prev) => (prev ? prev + ' ' : '') + 'How to apply for PM-Kisan subsidy online?');
        setIsListening(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsListening(false);
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
      {/* File attachment preview badge */}
      {selectedFile && (
        <div
          style={{
            position: 'absolute',
            top: '-34px',
            left: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '12px',
            color: 'var(--workspace-text-main)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FileText size={13} color="var(--accent-blue)" />
          <span>Attached: <strong>{selectedFile}</strong> (Demo)</span>
          <button
            onClick={() => setSelectedFile(null)}
            style={{ marginLeft: '4px', color: '#94a3b8', fontSize: '13px' }}
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
          borderRadius: '30px',
          padding: '8px 10px 8px 14px',
          boxShadow: 'var(--shadow-composer)',
          border: '1px solid rgba(220, 226, 240, 0.9)',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        {/* Hidden File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach document / ID proof for verification"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            flexShrink: 0,
            marginBottom: '1px',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <Paperclip size={18} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a government scheme, eligibility or documents..."
          style={{
            flex: 1,
            maxHeight: '180px',
            resize: 'none',
            fontSize: '14.5px',
            lineHeight: '1.45',
            color: 'var(--workspace-text-main)',
            backgroundColor: 'transparent',
            padding: '8px 4px',
            fontFamily: 'inherit',
          }}
        />

        {/* Voice Input Mic Button */}
        <button
          onClick={toggleMic}
          title={isListening ? 'Listening...' : 'Dictate question (Speech to Text)'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isListening ? '#ef4444' : '#64748b',
            flexShrink: 0,
            marginBottom: '1px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isListening) {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }
          }}
          onMouseLeave={(e) => {
            if (!isListening) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }
          }}
        >
          <Mic size={18} />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || disabled}
          title="Send message (Enter)"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? '#bbf7d0' : '#e2e8f0',
            color: inputText.trim() ? '#14532d' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            marginBottom: '1px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = '#86efac';
            }
          }}
          onMouseLeave={(e) => {
            if (inputText.trim()) {
              e.currentTarget.style.backgroundColor = '#bbf7d0';
            }
          }}
        >
          <ArrowUp size={18} strokeWidth={2.4} />
        </button>
      </div>

      {/* Keyboard Hint below composer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '7px',
          fontSize: '11px',
          color: 'var(--workspace-text-subtle)',
        }}
      >
        <span>
          Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: '#e2e8f0', fontSize: '10px' }}>Enter ↵</kbd> to ask
        </span>
        <span>•</span>
        <span>
          <kbd style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: '#e2e8f0', fontSize: '10px' }}>Shift + Enter</kbd> for new line
        </span>
        <span>•</span>
        <span>Demonstration prototype for citizen services</span>
      </div>
    </div>
  );
};
