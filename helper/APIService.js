import axios from 'axios'
import { getCookies } from './helper'

class APIService {
  constructor() {
    this.service = axios.create({
      baseURL: ' https://api-proxy.click2mail.com/molpro',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
      },
    });
  }

  async get(path) {
    try {
      let sessionId = getCookies('sessionid');
      const response = await this.service.request({
        method: 'GET',
        url: path,
        headers: { 'X-Auth-UserId': sessionId }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      console.log('ERROR', error);
//       return error;
      return { status: error.response, data: error.response };
    }
  }

  async post(path, payload, headers = {}) {
    try {
      const copyHeaders = { ...headers };
      let sessionId = getCookies('sessionid');
      if (sessionId) {
        copyHeaders['X-Auth-UserId'] = sessionId;
      }
      const response = await this.service.request({
        method: 'POST',
        url: path,
        data: payload,
        headers: { ...copyHeaders }
      });
      return response;
    } catch (error) {
      return { status: error.response, data: error.response };
    }
  }

}

export default new APIService();
