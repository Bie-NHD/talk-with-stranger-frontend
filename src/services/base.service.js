"use strict";

class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getHeaders({ customHeaders = {} }) {
    let headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };
    return headers;
  }

  getDataBody(data, options) {
    let dataReturn = options?.useRawData ? data : JSON.stringify(data);

    return dataReturn;
  }

  async handleReponseError(response) {
    const data = await response.json();

    if (data?.status === "error") {
      throw new Error(data.message);
    }

    return data;
  }

  async get(url, options = {}) {
    return await this.handleReponseError(
      await fetch(`${this.baseUrl}${url}`, {
        headers: this.getHeaders({ customHeaders: options?.customHeaders }),
      })
    );
  }

  async post(url, data = {}, options = {}) {
    return await this.handleReponseError(
      await fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        headers: this.getHeaders({
          customHeaders: options?.customHeaders,
        }),
        body: this.getDataBody(data, options),
      })
    );
  }

  async patch(url, data = {}, options = {}) {
    return await this.handleReponseError(
      await fetch(`${this.baseUrl}${url}`, {
        method: "PATCH",
        headers: this.getHeaders({
          customHeaders: options?.customHeaders,
        }),
        body: this.getDataBody(data, options),
      })
    );
  }

  async normalFetch(url, options) {
    return await this.handleReponseError(
      await fetch(`${this.baseUrl}${url}`, options)
    );
  }

  async delete(url, data = {}, options = {}) {
    return await this.handleReponseError(
      await fetch(`${this.baseUrl}${url}`, {
        method: "DELETE",
        headers: this.getHeaders({
          customHeaders: options?.customHeaders,
        }),
        body: this.getDataBody(data, options),
      })
    );
  }
}

export default BaseService;
