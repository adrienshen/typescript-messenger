import { ServiceClient, ServiceResponse } from "./ServiceClient";
import {
  ScriptRequest,
  TranscriptResponse,
  TranscriptRequest,
  CompileRequest,
  CompileResponse,
  SendMessageRequest,
  SendMessageResponse,
  RunFunctionRequest,
  RunFunctionResponse } from "./ChatbotClientInterfaces";

export class ChatbotClientImpl extends ServiceClient {
  async getTranscript(req: TranscriptRequest): Promise<ServiceResponse<TranscriptResponse>> {
    return await this.get<TranscriptResponse>("/chatbot/transcript", req);
  }

  async getScript(req: ScriptRequest): Promise<ArrayBuffer> {
    return await this.getBytes<ScriptRequest>("/chatbot/script", req);
  }

  async compile(
    req: CompileRequest
  ): Promise<ServiceResponse<CompileResponse>> {
    return await this.post<CompileResponse>("/chatbot/compile", req);
  }

  async sendMessage(
    req: SendMessageRequest
  ): Promise<ServiceResponse<SendMessageResponse>> {
    return await this.post<SendMessageResponse>("/chatbot/message", req);
  }

  async sendLocalMessage(
    req: SendMessageRequest
  ): Promise<ServiceResponse<SendMessageResponse>> {
    this.setEndpoint("http://localhost:3000");
    return await this.post<SendMessageResponse>("/chatbot/message", req);
  }

  async runFunction(
    req: RunFunctionRequest
  ): Promise<ServiceResponse<RunFunctionResponse>> {
    return await this.post<RunFunctionResponse>("/chatbot/run", req);
  }
}

export const ChatbotClient = new ChatbotClientImpl();
