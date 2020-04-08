// const Evaporate = require("evaporate");
import ChatbotStorage from "../storage/LocalStorage";
import {DocumentClient} from "../service/DocumentClient";
import {readFile} from "../utils/Utils";
import ImageMessageRenderer from "../renderers/ImageMessageRenderer";
import TextMessageRenderer from "../renderers/TextMessageRenderer";
import PdfLinkRenderer from "../renderers/PdfLinkRenderer";
import PubSub from "../core/PubSub";
import {
  PublishEventNames,
  UploadMessagePayload,
  BasePayload
} from "../types/publishevents";
import ErrorMessages, { LogError } from "../constants/ErrorMessages";
import TermsConditions from "../renderers/TermsConditions";
import DomElements from "../utils/DomElements";
import UploadFileTypes from "../constants/UploadFileTypes";
import StringMessages from "../constants/StringMessages";
import ClassNames from "../constants/ClassNames";
import {UploadSvgIcon} from "../utils/SvgIcons";
import ElementIds from "../constants/ElementIds";
import Config from "../constants/Config";

class DocumentUploader {
  
  imageMessageRenderer: ImageMessageRenderer;
  textMessageRenderer: TextMessageRenderer;
  pdfLinkRenderer: PdfLinkRenderer;

  documentUploadEnabled: boolean = false;
  fileUploaderEl: HTMLInputElement;

  constructor() {
    this.imageMessageRenderer = new ImageMessageRenderer();
    this.textMessageRenderer = new TextMessageRenderer();
    this.pdfLinkRenderer = new PdfLinkRenderer();

    PubSub.subscribe({
      event: PublishEventNames.UploadFeatureSwitch,
      action: payload => this.switchUploadFeature(payload.message),
    });
  }

  switchUploadFeature(featureEnabled: boolean): void {
    if (featureEnabled) {
      DomElements.fileUploader!.addEventListener("change", (e: Event) => this.handleUploadChanged(e.target), false);
      this.createUploadElement();
      (DomElements.userActionsContainer!.firstElementChild as HTMLElement).style.paddingLeft = "4rem";
    } else {
      console.log(StringMessages.UploadFeatureDisabled);
    }
  }

  protected uploadIcon(): HTMLElement {
    let uploadIconEl = document.createElement("LABEL");
    uploadIconEl.setAttribute("for", ElementIds.FileUploader);
    uploadIconEl.innerHTML = UploadSvgIcon();
    uploadIconEl.classList.add(ClassNames.UploadIcon);
    return uploadIconEl;
  }

  createUploadElement(): void {
    let elem = this.uploadIcon();
    DomElements.userActionsContainer!.appendChild(elem);
  }

  protected async handleUploadChanged(target: any){
    TermsConditions.removeTermsConditions();
    PubSub.publish<UploadMessagePayload>({
      event: PublishEventNames.UploadStarted,
      payload: {
        message: null,
      },
    });
    this.updatePlaceholderUi(target.files[0]);

    const {transcriptId, tenant} = ChatbotStorage.getStore();
    let prepareReq = {
      tenant,
      transcriptId,
      filename: target.files[0].name,
      contentType: target.files[0].type,
    };

    const prepareResponse = await DocumentClient.prepareDocumentUpload(prepareReq);
    if (!prepareResponse || !prepareResponse.data) {
      this.updateUploadErrorUi();
    }
    
    this.uploadAwsBucket(prepareResponse.data, target.files[0]);
  }

  protected async uploadAwsBucket(prepareResp: any, file: File) {
    const {apiKey, awsUrl, bucket, path, signerUrl, sessionToken} = prepareResp;
    const uploadedFileUrl = `${awsUrl}/${bucket}/${path}`;
    const {
      MAX_RETRY_BACKOFF_SECS,
      RETRY_BACKOFF_POWER,
      AWS_SIGNITURE_VERSION,
      LOGGING,
      SERVER_SIDE_ENCRYPTION,
    } = Config.AWS_EVAPORATE;
    const awsEvaporateConfig = {
      aws_key: apiKey,
      aws_url: awsUrl,
      bucket,
      signerUrl,
      maxRetryBackoffSecs: MAX_RETRY_BACKOFF_SECS,
      retryBackoffPower: RETRY_BACKOFF_POWER,
      awsSignatureVersion: AWS_SIGNITURE_VERSION,
      logging: LOGGING,
    };

    await import(/* webpackChunkName: "evaporate" */"evaporate").then((Evaporate: any) => {
      const E = Evaporate.default;
      E.create(awsEvaporateConfig).then((evaporate: any) => {
        const addConfig = {
          file,
          name: path,
          contentType: file.type,
          progressIntervalMS: 10,
          xAmzHeadersAtInitiate: {
            "x-amz-acl": "public-read",
            "x-amz-security-token": sessionToken,
            "x-amz-server-side-encryption": SERVER_SIDE_ENCRYPTION,
          },
          xAmzHeadersAtUpload: {
            "x-amz-security-token": sessionToken
          },
          xAmzHeadersAtComplete: {
            "x-amz-security-token": sessionToken
          },
          progress: (progressValue: string | number) => this.onUpdateProgress(progressValue),
          complete: (res: any, awsKey: string) => this.onUploadCompleted(res, awsKey, file, uploadedFileUrl)
        };
        evaporate.add(addConfig);
      });
  
      return {
        url: uploadedFileUrl,
        hash: sessionToken,
      };
    })
  }

  protected onUpdateProgress(progressValue: string | number) {
    console.log("UPLOAD PROGRESS: ", progressValue);
  }

  protected onUploadCompleted(res: any, awsKey: string, file: File, uploadedFileUrl: string) {
    console.info("Upload completed, awskey: ", awsKey);
    if (res.status) {
      PubSub.publish<UploadMessagePayload>({
        event: PublishEventNames.UploadFinished,
        payload: {
          message: res.status
        },
      });
      if (/^image\//.test(file.type)) {
        this.imageMessageRenderer.switchImageSrc(uploadedFileUrl);
      } else if (file.type === UploadFileTypes.Pdf) {
        this.pdfLinkRenderer.render(uploadedFileUrl, file.name);
      } else {
        this.textMessageRenderer.render(
          { text: ErrorMessages.ErrorFileType },
          "chatbot",
        );
        LogError(ErrorMessages.ErrorFileType);
      }
    } else {
      this.textMessageRenderer.render({text: "Upload failed"}, "chatbot");
    }
  }

  protected updateUploadErrorUi() {
    LogError(ErrorMessages.ErrorPreparingUpload);
    // do more stuff to handle error in the ui...
  }

  protected async updatePlaceholderUi(fileImage: File) {
    /* Create an image placeholder while actual file is in progress of uploading
    *  to aws
    */
    if (/^image\//.test(fileImage.type)) {
      this.handleImageFile(fileImage);
    } else if (fileImage.type === UploadFileTypes.Pdf) {
      this.handlePdfFile(fileImage);
    } else {
      LogError(ErrorMessages.ErrorGeneratingPlaceholder);
    }
  }

  protected async publishUploadAppendObject() {
    PubSub.publish<BasePayload>({
      event: PublishEventNames.UploadAppendObject,
    });
  }

  protected async handleImageFile(imgFile: File) {
    const message = { imageurl: await readFile(imgFile) };
    await this.imageMessageRenderer.render(message);
    this.publishUploadAppendObject();
  }

  protected handlePdfFile(pdfFile: File) {
    // const message = { fileurl: "https://example.com/" + pdfFile.name };
    this.textMessageRenderer.render({
      text: `Uploading ${pdfFile.name}`
    }, "chatbot");
  }

}

export default DocumentUploader;