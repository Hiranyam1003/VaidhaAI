import { useState } from 'react';
import {
  Copy,
  Check,
  FileText,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { Message } from '../types';

interface ConversationViewProps {
  messages: Message[];
  onSelectFollowUp: (followUpText: string) => void;
  isLoading?: boolean;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  onSelectFollowUp,
  isLoading = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '840px',
        width: '100%',
        margin: '0 auto',
        padding: '20px 16px 40px 16px',
      }}
    >
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';

        if (isUser) {
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: '10px',
              }}
              className="fade-in"
            >
              <div
                style={{
                  maxWidth: '75%',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px 20px 4px 20px',
                  padding: '12px 18px',
                  color: '#0f172a',
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>{msg.content}</div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: '#94a3b8',
                    marginTop: '6px',
                    textAlign: 'right',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              maxWidth: '100%',
            }}
            className="fade-in"
          >
            {/* Header info with AI tag & Copy */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: '#111215',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f97316',
                    overflow: 'hidden',
                  }}
                >
                  <img src="/vaidha-logo.jpeg" alt="Vaidha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                  Vaidha AI
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 600,
                  }}
                >
                  Demonstration Response
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.timestamp}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  title="Copy response"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#64748b',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check size={13} color="#16a34a" /> <span style={{ color: '#16a34a' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Assistant Body Container */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
                lineHeight: '1.65',
                fontSize: '14.5px',
                color: '#1e293b',
              }}
            >
              {renderFormattedContent(msg.content)}

              {/* Source Citations Block */}
              {msg.citations && msg.citations.length > 0 && (
                <div
                  style={{
                    marginTop: '22px',
                    paddingTop: '18px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '10px',
                    }}
                  >
                    <FileText size={14} color="#3b82f6" />
                    <span>Referenced Official Documentation & Citations (Mock)</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {msg.citations.map((cit) => (
                      <div
                        key={cit.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'border-color 0.15s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => alert(`Opening citation: ${cit.title} (${cit.department})`)}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#93c5fd')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 600,
                              color: '#2563eb',
                              backgroundColor: '#eff6ff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {cit.badge || 'Official Source'}
                          </span>
                          <ExternalLink size={13} color="#94a3b8" />
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                          {cit.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {cit.department} • <span style={{ fontStyle: 'italic' }}>{cit.documentType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Follow-ups */}
            {msg.followUps && msg.followUps.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                  Suggested next questions:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {msg.followUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectFollowUp(fu)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Sparkles size={13} color="#f97316" />
                      <span>{fu}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Loading indicator if assistant is typing */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            maxWidth: '240px',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="fade-in"
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              animation: 'pulseGlow 1s infinite',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#f97316',
              animation: 'pulseGlow 1s infinite 0.2s',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulseGlow 1s infinite 0.4s',
            }}
          />
          <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '6px' }}>Vaidha AI is researching...</span>
        </div>
      )}
    </div>
  );

  // Helper to format simulated markdown headers, lists and bold words cleanly
  function renderFormattedContent(text: string) {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3
            key={idx}
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: idx === 0 ? '0' : '16px',
              marginBottom: '8px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4
            key={idx}
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1e293b',
              marginTop: '14px',
              marginBottom: '6px',
            }}
          >
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('  - ')) {
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '8px',
              paddingLeft: line.startsWith('  - ') ? '24px' : '8px',
              margin: '3px 0',
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^(\s*-\s*)/, '')) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div
            key={idx}
            style={{
              paddingLeft: '4px',
              marginTop: '10px',
              marginBottom: '4px',
            }}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
      }
      if (!line.trim()) {
        return <div key={idx} style={{ height: '8px' }} />;
      }
      return (
        <p
          key={idx}
          style={{ marginBottom: '6px' }}
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    });
  }

  function formatInline(str: string) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
};
