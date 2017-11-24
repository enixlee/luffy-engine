/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/2
 * Time: 下午3:25
 */
let Vue = window.PMApp.Vue;
let Assert = Vue.prototype.getPlugin('Assert');
let lodash = Vue.prototype.getPlugin('lodash');

const HTTP_METHOD_GET = 'get';
const HTTP_METHOD_POST = 'post';

export class RpcCommandResult {
  constructor (httpResponse) {
    Assert.hasKey('request', httpResponse);
    Assert.hasKey('status', httpResponse);
    Assert.hasKey('config', httpResponse);

    Assert.hasKey('command_name', httpResponse.data);
    Assert.hasKey('description', httpResponse.data);
    Assert.hasKey('code', httpResponse.data);
    Assert.hasKey('data', httpResponse.data);
    Assert.hasKey('succ', httpResponse.data);

    this.__request = httpResponse;
    this.__originRpc = httpResponse.data;
    this.__requestParams = null;
  }

  getParams () {
    if (!lodash.isNull(this.__requestParams)) {
      return this.__requestParams;
    }

    let params = {};
    let method = this.getHttpMethod();
    if (method === HTTP_METHOD_GET) {
      this.__requestParams = new URLSearchParams({});
      params = this.__request['config']['params'] || {};

      lodash.forEach(params, (n, key) => {
        this.__requestParams.set(key, n);
      });
    } else if (method === HTTP_METHOD_POST) {
      params = this.__request['config']['data'];
      this.__requestParams = new URLSearchParams(params);
    }

    return this.__requestParams;
  }

  getResponseStatus () {
    return this.__request['status'];
  }

  getCommand () {
    return this.__originRpc['command_name'];
  }

  getDescription () {
    let desc = this.__originRpc['description'];
    if (desc === '') {
      desc = this.__originRpc['code'];
    }
    return desc;
  }

  getCode () {
    return this.__originRpc['code'];
  }

  getData () {
    return this.__originRpc['data'];
  }

  isSucc () {
    return this.__originRpc['succ'];
  }

  getHttpMethod () {
    return this.__request['config']['method'];
  }
}

export function createRpcCommandResult (rpcResult) {
  return new RpcCommandResult(rpcResult);
}
