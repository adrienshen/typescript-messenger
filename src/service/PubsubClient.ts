import { ServiceClient, ServiceResponse } from "./ServiceClient";

export interface PublishRequest {
  channel: string;
  params: string[];
  expectedOutputs?: number;
}

export interface PublishResponse {
  outputs: string[];
}

export interface SubscribeRequest {
  channel: string;
  params: string[];
  expectedOutputs?: number;
  timeout?: number;
}

export interface SubscribeResponse {
  outputs: string[];
}

export class PubsubClientImpl extends ServiceClient {
  async publish(
    req: PublishRequest
  ): Promise<ServiceResponse<PublishResponse>> {
    return await this.post<PublishResponse>("/pubsub/publish", req);
  }

  async subscribe(
    req: SubscribeRequest
  ): Promise<ServiceResponse<SubscribeResponse>> {
        return await this.post<SubscribeResponse>("/pubsub/subscribe", req);
  }
}

export const PubsubClient = new PubsubClientImpl();