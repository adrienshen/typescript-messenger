export interface ChatbotOptions {
  containerId?: string;
  gtmId?: string;
  tenant: string;
  eTag?: string;
  tnc?: {
    campaignHref?: string;
  };
  cssLink?: string;
  styleId?: string;
  styleContents?: string;
  topScreen: TopScreen;
}

export interface TopScreen {
  topInnerWidth: number;
  topOuterWidth: number;
  topScreenAvailWidth: number;
  topScreenWidth: number;
}

export interface ISend {
  response?: any;
  message?: any;
  eTag?: string;
}

export interface IState {
  input: IInput;
  transcriptLoading: boolean;
  transcriptId: string;
  transcripts: { [id: string]: ITranscript };
  upload: IUpload;
  ui: IUserInterface;
  tnc: {
    attempts: number;
    current: number
  },
  tenant: string;
  eTag: string;
  role: string;
  sender: string;
  beforeSend: ({ message, eTag }: ISend) => Promise<any>;
  afterSend: ({ response, message, eTag }: ISend) => Promise<any>;
}

export interface IUserInterface {
  progress: number;
  touched: boolean;
}

export interface IInput {
  channel: IChannel;
  lock: boolean;
  focus: number;
  lockable: boolean;
}

export interface IChannel {
  selected: string
  text: { [name: string]: string };
}

export interface ITranscript {
  messages: IMessage[];
  schedules: ISchedule[];
  since?: number;
  lock?: ILock;
}

export interface ILock {
  userId: string;
}

export interface IMessage {
  actions?: MessageAction[];
  defaultAction?: any;
  elements?: IMessage[];
  expectedEntities?: string[];
  fileurl?: string;
  gatewayInfo?: any;
  imageurl?: string;
  intentInfo?: any;
  medium?: string;
  payload?: string;
  sender?: string;
  text?: string;
  timestamp?: number;
  title?: string;
  videourl?: string;
}

export interface MessageAction {
	type?: string;
	title?: string;
	url?: string;
	payload?: string;
	imageurl?: string;
	height?: string;
	shareable?: boolean;
	fallbackurl?: string;
}

export interface ISchedule {
  reason: string;
  runFunctionRequest: IRunFunctionRequest;
  timestamp: string;
  transcriptId: string;
}

export interface IRunFunctionRequest {
  functionName: string;
  transcriptId: string;
}

export interface IUpload {
  error: boolean;
  message: IMessage;
  progress: number;
}

export interface JFile extends File {
  contentType?: string;
}
