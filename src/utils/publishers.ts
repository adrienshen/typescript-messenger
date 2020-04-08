import PubSub from "../core/PubSub";
import {
  BasePayload,
  PublishEventNames,
  MessageFirstPayload,
  ChatbotMessagePayload,
  MessageStringPayload,
  UploadFeaturePayload,
  PluginMessagePayload
} from "../types/publishevents";
import { Message } from "../service/ChatbotClientInterfaces";
import { IPluginChatMessage } from "../platform/types";

export function publishTermsConditionsRemove() {
  PubSub.publish<BasePayload>({
      event: PublishEventNames.TermsRemove,
      payload: {},
  });
}

export function sendFirstQuery(initialMessageOpts: any) {
  PubSub.publish<MessageFirstPayload>({
    event: PublishEventNames.MessageFirst,
    payload: {
      message: initialMessageOpts,
    }
  });
}

export function publishTranscriptIdReceived(transcriptId: string) {
  PubSub.publish<MessageStringPayload>({
    event: PublishEventNames.TranscriptIdReceived,
    payload: {
      message: transcriptId,
    }
  })
}

export function publishRenderTranscriptMessages(messages: Message[]) {
  PubSub.publish<ChatbotMessagePayload>({
    event: PublishEventNames.TranscriptRenderMessages,
    payload: {
      message: messages,
    },
  });
}

export function publishMessageResponseRendering(transcriptId: string) {
  PubSub.publish<MessageStringPayload>({
    event: PublishEventNames.MessageResponseRendering,
    payload: {
      message: transcriptId,
    }
  });
}

export function publishFirstMessageSent() {
  PubSub.publish<BasePayload>({
    event: PublishEventNames.MessageFirstSent,
  });
}

export function publishMessageSending() {
  PubSub.publish<BasePayload>({
    event: PublishEventNames.MessageSending,
  });
}

export function publishMessageSentSuccessEvent() {
  PubSub.publish<BasePayload>({
    event: PublishEventNames.MessageSentSuccess,
    payload: {},
  });
}

export function publishGmtInit(gtmId: string) {
  PubSub.publish<MessageStringPayload>({
    event: PublishEventNames.GmtInit,
    payload:{
      message: gtmId,
    },
  });  
}

export function publishUploadFeatureSwitch(uploadFeature: boolean) {
  PubSub.publish<UploadFeaturePayload>({
    event: PublishEventNames.UploadFeatureSwitch,
    payload: {
      message: uploadFeature,
    }
  });
}

export function publishSendMessageFromClient(message: string) {
  PubSub.publish<MessageStringPayload>({
    event: PublishEventNames.ClientMessage,
    payload: {
      message: message,
    }
  });
}

export function publishSendInitialMessage(message: string) {
  PubSub.publish<MessageStringPayload>({
    event: PublishEventNames.ClientFirstMessage,
    payload: {
      message: message,
    }
  });
}

export function publishTextboxFocus() {
  PubSub.publish<BasePayload>({
    event: PublishEventNames.TextboxFocus,
    payload: {},
  });
}

/* plugin publishers */

export function publishPluginDisplayMessage(pluginMessage: IPluginChatMessage) {
  PubSub.publish<PluginMessagePayload>({
    event: PublishEventNames.PluginDisplayMessage,
    payload: {
      message: pluginMessage,
    }
  });
}

export function publishPluginSendSoraMessage(pluginMessage: IPluginChatMessage) {
  PubSub.publish<PluginMessagePayload>({
    event: PublishEventNames.PluginSendSoraMessage,
    payload: {
      message: pluginMessage,
    },
  })
}

/* Dev tooling specific publishers */
export function publishSimulatedBackend(simulatedBackendMessage: Message[]) {
  PubSub.publish<ChatbotMessagePayload>({
    event: PublishEventNames.DevSimulateBackend,
    payload: {
      message: simulatedBackendMessage,
    },
  })
}
