"use strict";

import BaseService from "./base.service";

class UserService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  updateAvatar = async (file, uid, tokens) => {
    const data = new FormData();

    data.append("avatar", file);

    return await this.normalFetch("/users/avatar", {
      method: "PATCH",
      headers: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
      body: data,
    });
  };

  updateBackground = async (file, uid, tokens) => {
    const data = new FormData();

    data.append("background", file);

    return await this.normalFetch("/users/background", {
      method: "PATCH",
      headers: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
      body: data,
    });
  };

  updateMe = async (bodyUpdate, uid, tokens) => {
    return await this.patch("/users/me", bodyUpdate, {
      customHeaders: {
        authorization: tokens.accessToken,
        "x-client-id": uid,
      },
    });
  };
}

export default UserService;
