import type { Language, Message } from '../types';

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
      return errorReply(res.status >= 500 ? SERVER_DOWN : `The server returned an error (${res.status}).`);
    }

    const data: ChatResponse = await res.json();
    return {
      content: data.content,
      citations: data.citations.map((c, i) => ({ id: `cit-${Date.now()}-${i}`, ...c })),
      followUps: data.followUps,
    };
  } catch {
    return errorReply(SERVER_DOWN);
  }
}

function errorReply(detail: string): AssistantReply {
  return { content: `### Sorry, I couldn't get an answer\n\n${detail}` };
}
