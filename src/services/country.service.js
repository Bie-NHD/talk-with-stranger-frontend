"use strict";

import BaseService from "./base.service";

class CountryService extends BaseService {
  constructor(baseUrl) {
    super(baseUrl);
  }

  async getAllCountries() {
    return await this.get("/countries");
  }
}

export default CountryService;
