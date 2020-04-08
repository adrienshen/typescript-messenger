import { ServiceClient, ServiceResponse } from "./ServiceClient";
import { Message } from "./ChatbotClientInterfaces";

export interface GetTranscriptRequest {
  transcriptId?: string;
  since?: string;
  timeout: number;
  releaseStage?: string;
}

export interface GetTranscriptResponse {
  transcriptId: string;
  messages: Message[];
  lock: Lock;
  releaseStage?: string;
}

export interface SendMessageRequest {
  transcriptId: string;
  eTag?: string;
  message: Message;
  releaseStage?: string;
}

export interface SendMessageResponse {
  sent: boolean;
  errors: Frame[];
  log: Frame[];
  lock: Lock;
}

export interface Frame {
  line: number;
  column: number;
  source: string;
  message: string;
  function: string;
}

export interface ListConversationsRequest {
  timeout: number;
}

export interface ListConversationsResponse {
  conversations: ConversationResult[];
}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  conversations: ConversationResult[];
}

export interface ConversationResult {
  id: string;
  name: string;
  lastReceived: Message;
  lastSent: Message;
  unreadCount: number;
  pictureURL: string;
  campaigns: Campaign[];
  tags: Tag[];
  extraJSON: string;
  assignment: Assignment;
  lock: Lock;
}

export interface Assignment {
  assignedAt: number;
}

export interface Campaign {
  name: string;
  createdAt: number;
  createdBy: string;
  tags: Tag[];
}

export interface Tag {
  name: string;
  createdAt: number;
  createdBy: string;
  extraJSON: string;
}

export interface Lock {
  userId: string;
}

export class ConversationClientImpl extends ServiceClient {
  async getTranscript(
    req: GetTranscriptRequest
  ): Promise<ServiceResponse<GetTranscriptResponse>> {
    return await this.get<GetTranscriptResponse>("/conversation/transcript", req);
  }

  async sendMessage(
    req: SendMessageRequest
  ): Promise<ServiceResponse<SendMessageResponse>> {
    return await this.post<SendMessageResponse>("/conversation/message", req);
  }

  async listConversations(
    req: ListConversationsRequest
  ): Promise<ServiceResponse<ListConversationsResponse>> {
    return await this.get<ListConversationsResponse>("/conversation/list", req);
  }

  async searchConversation(
    req: SearchRequest
  ): Promise<ServiceResponse<SearchResponse>> {
    return await this.get<SearchResponse>("/conversation/search", req);
  }
}

export const Client = new ConversationClientImpl();