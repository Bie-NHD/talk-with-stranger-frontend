"use strict";

import BaseService from "./base.service";

class FriendRequestService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  async sendFriendRequest({ uid, tokens, receiverId, greetingText }) {
    return await this.post(
      `/friendRequest/${receiverId}`,
      {
        greetingText,
      },
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }

  async acceptFriendRequest({ uid, tokens, friendRequestId }) {
    return await this.patch(
      `/friendRequest/accept/${friendRequestId}`,
      {},
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }

  async rejectFriendRequest({ uid, tokens, friendRequestId }) {
    return await this.patch(
      `/friendRequest/reject/${friendRequestId}`,
      {},
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }

  async getAllFriendRequest({ uid, tokens, page = 1, limit = 20 }) {
    return await this.get(`/friendRequest?page=${page}&limit=${limit}`, {
      customHeaders: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
    });
  }
}

export default FriendRequestService;
