"use strict";

import BaseService from "./base.service";

class ConservationService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  async getAllConservations({ uid, tokens, page = 1, limit = 20 }) {
    return await this.get(`/conservations?page=${page}&limit=${limit}`, {
      customHeaders: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
    });
  }

  async searchConservation({
    uid,
    tokens,
    page = 1,
    limit = 10,
    keySearch = "",
  }) {
    return await this.get(
      `/conservations/search?page=${page}&limit=${limit}&text=${keySearch}`,
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }

  async getConservation({ uid, tokens, conservationId }) {
    return await this.get(`/conservations/${conservationId}`, {
      customHeaders: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
    });
  }
}

export default ConservationService;
