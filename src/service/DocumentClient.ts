import { ServiceClient, ServiceResponse } from "./ServiceClient";

export interface PrepareDocumentUploadRequest {
  filename: string;
  contentType: string;
  transcriptId: string;
  tenant: string;
}

export interface PrepareDocumentUploadResponse {
  bucket: string;
  path: string;
  awsUrl: string;
  sessionToken: string;
  apiKey: string;
  signerUrl: string;
}

export class DocumentClientImpl extends ServiceClient {
  async prepareDocumentUpload(
    req: PrepareDocumentUploadRequest
  ): Promise<ServiceResponse<PrepareDocumentUploadResponse>> {
    return await this.post<PrepareDocumentUploadResponse>(
      "/document/upload/prepare",
      req
    );
  }
}

export const DocumentClient = new DocumentClientImpl();
