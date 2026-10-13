import React from 'react';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { MessageBubble } from '../components/MessageBubble';
import { ChatComposer } from '../components/ChatComposer';
import { useT } from '../i18n';
import type { Message } from '../types';

interface HomeProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onNavigateTab?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  messages,
  onSendMessage,
  isLoading,
  scrollRef,
  onNavigateTab,
}) => {
  const t = useT();
  const isWelcome = messages.length === 0;

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient treatment derived from the logo's terracotta dot and warm parchment base */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '380px',
          background:
            'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(217, 72, 43, 0.04), rgba(250, 248, 245, 0) 80%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '124px',
          zIndex: 10,
        }}
      >
        {isWelcome ? (
          <div style={{ margin: 'auto 0' }}>
            <WelcomeScreen
              onSelectPrompt={onSendMessage}
              onNavigateTab={onNavigateTab}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto',
              padding: '24px 16px',
            }}
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onSelectFollowUp={onSendMessage}
              />
            ))}

            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--workspace-border)',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  maxWidth: '220px',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="fade-in"
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-sun)',
                  }}
                />
                <span style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)' }}>
                  {t('home.researching')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Anchored Persistent Composer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 20px 18px 20px',
          background: 'linear-gradient(to top, rgba(250, 248, 245, 0.98) 75%, rgba(250, 248, 245, 0))',
          zIndex: 30,
        }}
      >
        <ChatComposer onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
