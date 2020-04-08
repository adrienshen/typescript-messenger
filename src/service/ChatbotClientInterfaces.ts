import { PluginAction } from "../types/publishevents";

export interface TranscriptRequest {
  transcriptId?: string;
  tenant: string;
  eTag?: string;
  since?: string;
  timeout: number;
}

export interface TranscriptResponse {
  transcriptId: string;
  messages: Message[];
}

export interface ScriptRequest {
  eTag: string;
}

export interface ScriptResponse {
  package: ArrayBuffer;
}

export interface CompileRequest {
  package: ArrayBuffer;
}

export interface CompileResponse {
  eTag: string;
  errors: Frame[];
  log?: string;
}

export interface SendMessageRequest {
  transcriptId: string;
  tenant: string;
  eTag?: string;
  message: Message;
}

export interface SendMessageResponse {
  sent: boolean;
  errors: Frame[];
  log: Frame[];
}

export interface Message {
  channel?: string;
  timestamp?: number;
  sender?: string;
  text?: string;
  title?: string;
  imageurl?: string;
  fileurl?: string;
  videourl?: string;
  event?: string;
  expectedEntities?: Array<string>;
  plugin?: PluginAction;
  isFirst?: boolean;
}

export interface Frame {
  line: number;
  column: number;
  source: string;
  message: string;
  function: string;
}

export interface RunFunctionRequest {
  transcriptId: string;
  functionName: string;
  eTag?: string;
  inputJSON?: string;
  unpackInput?: boolean;
}

export interface RunFunctionResponse {
  outputJSON: string;
  errors: Frame[];
  log: Frame[];
}