import type { Language, Message } from '../types';
import { translate } from '../i18n';

const SERVER_DOWN = 'Could not reach the Vaidha AI server. Make sure the backend is running.';

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
  const t = (text: string, vars?: Record<string, string | number>) => translate(language, text, vars);
  const errorReply = (detail: string): AssistantReply => ({
    content: `### ${t("Sorry, I couldn't get an answer")}\n\n${detail}`,
  });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (typeof body?.detail === 'string') return errorReply(body.detail);
      // No JSON body means the request never reached FastAPI (the dev proxy answers 502 when it is down).
      return errorReply(res.status >= 500 ? t(SERVER_DOWN) : t('The server returned an error ({status}).', { status: res.status }));
    }

    const data: ChatResponse = await res.json();
    return {
      content: data.content,
      citations: data.citations.map((c, i) => ({ id: `cit-${Date.now()}-${i}`, ...c })),
      followUps: data.followUps,
    };
  } catch {
    return errorReply(t(SERVER_DOWN));
  }
}
