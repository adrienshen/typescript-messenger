import ResponseError from './ResponseError'

export interface ServiceResponse<T> {
  statusCode: number;
  statusText?: string;
  errorMessage?: string;
  data?: T;
}

export abstract class ServiceClient {
  public endpoint: string = process.env.API_ENDPOINT || "https://api.test.sora.ai";
  // public endpoint: string = "https://api.test.sora.ai";
  // public endpoint: string = "https://api.sora.ai";

  public setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected query(requestObj: any): string {
    let queryArr = new Array<string>();
    for (let key in requestObj) {
      let value = Array.isArray(requestObj[key]) ? requestObj[key] : [requestObj[key]];
      for (let item of value) {
        queryArr.push(key + "=" + encodeURIComponent(item));
      }
    }
    return queryArr.join("&");
  }

  protected async get<T>(url: string, req: any): Promise<ServiceResponse<T>> {
    let q = this.query(req);
    q = q ? "?" + q : "";
    return await this.fetch<T>("get", url + q, "application/json", "");
  }

  protected async getBytes<T>(url: string, req: T): Promise<ArrayBuffer> {
    let q = this.query(req);
    q = q ? "?" + q : "";
    let requestUrl = new URL(url + q, this.endpoint).href;
    let resp = await fetch(requestUrl, {
      method: "get",
      mode: "cors",
      credentials: "include",
      headers: [["Accept", "application/octet-stream"]]
    });
    return resp.arrayBuffer();
  }

  protected async post<T>(url: string, req: any): Promise<ServiceResponse<T>> {
    return await this.fetch<T>(
      "post",
      url,
      "application/json",
      JSON.stringify(req)
    );
  }

  protected async postForm<T>(
    url: string,
    req: any
  ): Promise<ServiceResponse<T>> {
    return await this.fetch<T>(
      "post",
      url,
      "application/x-www-form-urlencoded",
      this.query(req)
    );
  }

  protected async fetch<T>(
    method: "get" | "post",
    url: string,
    type: string,
    body: string
  ): Promise<ServiceResponse<T>> {
    try {
      let typeHeader = method == "post" ? "Content-Type" : "Accept";
      let requestUrl = new URL(url, this.endpoint).href;
      let resp = await fetch(requestUrl, {
        method: method,
        mode: "cors",
        // Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. Origin 'http://localhost:8181' is therefore not allowed access.
        // credentials: "include",
        headers: [[typeHeader, type]],
        body: body || undefined
      });
      //FIXME: throw when status code 4xx/5xx? (so that we can Promise.catch?)
      return {
        statusCode: resp.status,
        statusText: resp.statusText,
        data: JSON.parse(await resp.text())
      };
    } catch (err) {
      const ex: Error = err;
      if ("Bugsnag" in window) {
        (window as any)["Bugsnag"].notifyException(err);
      }
      throw new ResponseError(ex.message, ex.name);
    }
  }
}
