"use strict";

import BaseService from "./base.service";

class FriendService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  async unFriend({ uid, tokens, friendId }) {
    return await this.delete(
      `/friends/${friendId}`,
      {},
      {
        customHeaders: {
          authorization: tokens.accessToken,
          "x-client-id": uid,
        },
      }
    );
  }
}

export default FriendService;
