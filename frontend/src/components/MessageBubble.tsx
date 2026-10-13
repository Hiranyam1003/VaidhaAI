import React, { useState } from 'react';
import { Copy, Check, FileText, ExternalLink, Sparkles } from 'lucide-react';
import type { Message } from '../types';
import { useT } from '../i18n';

interface MessageBubbleProps {
  message: Message;
  onSelectFollowUp?: (followUp: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onSelectFollowUp,
}) => {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
        className="fade-in"
      >
        <div
          style={{
            maxWidth: '78%',
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            borderRadius: '18px 18px 4px 18px',
            padding: '12px 18px',
            color: 'var(--workspace-text-main)',
            fontSize: '14px',
            lineHeight: '1.5',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>{message.content}</div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--workspace-text-subtle)',
              marginTop: '5px',
              textAlign: 'right',
            }}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '100%',
      }}
      className="fade-in"
    >
      {/* Assistant metadata header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#faf8f5',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <img src="/assets/vaidha-logo.jpeg" alt="Vaidha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>Vaidha AI</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--brand-sun-light)',
              color: 'var(--brand-sun)',
              fontWeight: 600,
            }}
          >
            {t(message.isDemo ? 'Demo Response' : 'AI answer')}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--workspace-text-subtle)' }}>{message.timestamp}</span>
        </div>

        <button
          onClick={handleCopy}
          title={t('Copy response')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            color: 'var(--workspace-text-muted)',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid var(--workspace-border)',
            backgroundColor: '#ffffff',
          }}
        >
          {copied ? (
            <>
              <Check size={12} color="#16a34a" /> <span style={{ color: '#16a34a' }}>{t('Copied')}</span>
            </>
          ) : (
            <>
              <Copy size={12} /> <span>{t('Copy')}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Assistant Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--workspace-border)',
          borderRadius: '16px',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-sm)',
          lineHeight: '1.65',
          fontSize: '14px',
          color: 'var(--workspace-text-main)',
        }}
      >
        {renderFormattedText(message.content)}

        {/* Citations Card Block */}
        {message.citations && message.citations.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #f1eee7',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--workspace-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}
            >
              <FileText size={13} color="var(--brand-sun)" />
              <span>{t('Referenced Official Documentation')}{message.isDemo ? ` ${t('(Demo)')}` : ''}</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
                gap: '10px',
              }}
            >
              {message.citations.map((cit) => (
                <div
                  key={cit.id}
                  style={{
                    backgroundColor: '#fbfaf8',
                    border: '1px solid var(--workspace-border)',
                    borderRadius: '9px',
                    padding: '11px 13px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'var(--brand-sun)',
                        backgroundColor: 'var(--brand-sun-light)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      {cit.badge || t('Source')}
                    </span>
                    <ExternalLink size={12} color="var(--workspace-text-subtle)" />
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {cit.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--workspace-text-muted)' }}>
                    {cit.department} • <em>{cit.documentType}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Follow-up suggestions */}
      {message.followUps && message.followUps.length > 0 && onSelectFollowUp && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '2px' }}>
          {message.followUps.map((fu, i) => (
            <button
              key={i}
              onClick={() => onSelectFollowUp(fu)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--workspace-border)',
                borderRadius: '16px',
                padding: '5px 12px',
                fontSize: '12px',
                color: 'var(--workspace-text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-sun-border)';
                e.currentTarget.style.backgroundColor = 'var(--brand-sun-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--workspace-border)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <Sparkles size={11} color="var(--brand-sun)" />
              <span>{fu}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  function renderFormattedText(text: string) {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3
            key={idx}
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginTop: idx === 0 ? '0' : '14px',
              marginBottom: '6px',
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
              fontSize: '14.5px',
              fontWeight: 600,
              color: '#262626',
              marginTop: '12px',
              marginBottom: '4px',
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
              paddingLeft: line.startsWith('  - ') ? '20px' : '6px',
              margin: '3px 0',
            }}
          >
            <span style={{ color: 'var(--brand-sun)' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: formatBold(line.replace(/^(\s*-\s*)/, '')) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div
            key={idx}
            style={{ paddingLeft: '4px', marginTop: '8px', marginBottom: '3px' }}
            dangerouslySetInnerHTML={{ __html: formatBold(line) }}
          />
        );
      }
      if (!line.trim()) {
        return <div key={idx} style={{ height: '6px' }} />;
      }
      return (
        <p key={idx} style={{ marginBottom: '5px' }} dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    });
  }

  // Answers come from Gemini, so escape any HTML before adding the <strong> and <a> tags we render.
  function formatBold(str: string) {
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--brand-sun); text-decoration: underline;">$1</a>',
      );
  }
};
