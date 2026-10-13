import { translate } from '../i18n';
import type { Language, Message } from '../types';

type AssistantReply = Pick<Message, 'content' | 'citations' | 'followUps'>;

interface ChatResponse {
  content: string;
  citations: { title: string; department: string; documentType: string }[];
  followUps: string[];
}

// Sends the question to the backend (/api is proxied to FastAPI in dev; see vite.config.ts).
// Never throws: failures come back as an assistant message explaining what went wrong.
export async function askVaidha(
  message: string,
  history: { role: Message['sender']; content: string }[],
  language: Language,
): Promise<AssistantReply> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      // No JSON body means the request never reached FastAPI (the dev proxy answers 502 when it is down).
      if (!body) return errorReply(language, 'chat.serverDown');
      // Backend details are English and aimed at developers, so log them and show a translated message.
      console.warn('Vaidha AI chat error:', res.status, body.detail);
      return errorReply(language, res.status === 503 ? 'chat.busy' : 'chat.failed');
    }

    const data: ChatResponse = await res.json();
    return {
      content: data.content,
      citations: data.citations.map((c, i) => ({ id: `cit-${Date.now()}-${i}`, ...c })),
      followUps: data.followUps,
    };
  } catch {
    return errorReply(language, 'chat.serverDown');
  }
}

function errorReply(language: Language, key: 'chat.serverDown' | 'chat.busy' | 'chat.failed'): AssistantReply {
  return { content: `### ${translate(language, 'chat.errorTitle')}\n\n${translate(language, key)}` };
}
