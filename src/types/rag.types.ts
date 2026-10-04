export interface RagSource {
  title: string;
  similarity: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  timestamp: string;
}

export interface AskConciergeResponse {
  reply: string;
  sources: RagSource[];
}

export interface IngestDocumentPayload {
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}
