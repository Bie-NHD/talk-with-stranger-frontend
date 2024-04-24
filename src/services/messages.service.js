"use strict";

import BaseService from "./base.service";

class MessageService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  async sendMessage({ uid, tokens, body, conservationId }) {
    return await this.post(`/messages/${conservationId}`, body, {
      customHeaders: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
    });
  }

  async getMessages({ uid, tokens, conservationId, page = 1, limit = 20 }) {
    return await this.get(
      `/messages/${conservationId}?page=${page}&limit=${limit}`,
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }
}

export default MessageService;
