/**
 * Created by enixlee on 2017/2/20.
 */
import axios from 'axios';
import * as qs from 'qs';
import {createRpcCommandResult} from './RpcCommandResult';

let Vue = window.PMApp.Vue;
let lodash = Vue.prototype.getPlugin('lodash');
let Assert = Vue.prototype.getPlugin('Assert');

const RPC_PARAMS_ADAPTER_NAME = 'RpcParamsAdapter';
const HTTP_REQUEST_ERROR_DEALER_NAME = 'RpcHttpRequestErrorDealer';
const RPC_ERROR_DEALER_NAME = 'RpcErrorDealer';
const RPC_CALLBACK_SUCC_DEALER = 'RpcRetDealer';

/**
 * 500毫秒
 * @type {number}
 */
const HTTP_QUEUE_DEALER_FRAME_DEFAULT = 500;

const HTTP_REQUEST_QUEUE_DEALER_FRAME = window['LUFFY_ENGINE_ENV']['HTTP_QUEUE_DEALER_FRAME'] || HTTP_QUEUE_DEALER_FRAME_DEFAULT;

// axios.defaults.withCredentials = true  // 跨域请求头如果带有cookie信息，服务端需要配置特定的allow-origin站点

// 请求队列
let HTTP_REQUEST_QUEUE = [];
let HTTP_REQUEST_QUEUE_RESULTS = {};
let REQUEST_ID_GENERATOR = Date.parse(new Date());

function defaultParamsAdapter (method, params) {
  return params;
}

function dealRequestError (error) {
  let dealer = Vue.prototype.getPlugin(HTTP_REQUEST_ERROR_DEALER_NAME);
  if (lodash.isFunction(dealer)) {
    dealer(error);
  } else {
    Assert.isTrue(false, `[rpc request error]:${error}`);
  }
}

function dealRpcError (rpcResult) {
  let dealer = Vue.prototype.getPlugin(RPC_ERROR_DEALER_NAME);
  if (lodash.isFunction(dealer)) {
    dealer(rpcResult);
  } else {
    Assert.isTrue(false, `[rpc error]:${rpcResult}`);
  }
}

/**
 * 接口正常返回时的处理逻辑
 * @param ret
 * @returns {*}
 */
function rpcSucc (ret) {
  let rpcResult = createRpcCommandResult(ret);

  if (!rpcResult.isSucc()) {
    dealRpcError(rpcResult);
  }

  let dealer = Vue.prototype.getPlugin(RPC_CALLBACK_SUCC_DEALER);
  if (!window['LUFFY_ENGINE_ENV']['HTTP_QUEUE_ENABLE'] && lodash.isFunction(dealer)) {
    dealer(rpcResult);
  }

  return rpcResult;
}

/**
 * 变更rpc接口域名
 * @param baseDomain
 */
export function changeBaseDomain (baseDomain) {
  Assert.isStringNotEmpty(baseDomain, `rpc base domain set error, got ${baseDomain}`);
  axios.defaults.baseURL = baseDomain;
}

/**
 * 注册rpc请求参数适配器
 * @param adapter
 */
export function registerParamsAdapter (adapter) {
  Assert.isFunction(adapter, `rpc params adapter registered error, got ${adapter}`);
  Vue.prototype.registerPlugin(RPC_PARAMS_ADAPTER_NAME, adapter);
}

/**
 * post 请求
 * @param method
 * @param params
 * @returns {Promise<R>|Promise.<T>} || null
 */
export function post (method, params) {
  let paramsAdapter = Vue.prototype.getPlugin(RPC_PARAMS_ADAPTER_NAME) || defaultParamsAdapter;
  let requestParams = paramsAdapter(method, params);
  if (window['LUFFY_ENGINE_ENV']['HTTP_QUEUE_ENABLE']) {
    let requestId = REQUEST_ID_GENERATOR++;
    let promise = makeRpcQueuePromise(`${requestId}`);
    let item = makeRpcQueueItem(method, qs.stringify(requestParams), 'post', requestId);
    HTTP_REQUEST_QUEUE.push(item);
    return promise;
  } else {
    return axios.post(method, qs.stringify(requestParams)).then(ret => {
      return rpcSucc(ret);
    }).catch(error => {
      dealRequestError(error);
    });
  }
}

/**
 * get 请求
 * @param method
 * @param params
 * @returns {Promise<R>|Promise.<T>} || null
 */
export function get (method, params) {
  let paramsAdapter = Vue.prototype.getPlugin(RPC_PARAMS_ADAPTER_NAME) || defaultParamsAdapter;
  let requestParams = paramsAdapter(method, params);
  if (window['LUFFY_ENGINE_ENV']['HTTP_QUEUE_ENABLE']) {
    let requestId = REQUEST_ID_GENERATOR++;
    let promise = makeRpcQueuePromise(`${requestId}`);
    let item = makeRpcQueueItem(method, requestParams, 'get', requestId);
    HTTP_REQUEST_QUEUE.push(item);
    return promise;
  } else {
    return axios.get(method, {params: requestParams}).then(ret => {
      return rpcSucc(ret);
    }).catch(error => {
      dealRequestError(error);
    });
  }
}

/**
 * 注册http异常的处理方法
 * @param httpRequestErrorDealer
 * @param rpcErrorDealer
 */
export function registerRpcErrorDealer (httpRequestErrorDealer, rpcErrorDealer) {
  if (!lodash.isNull(httpRequestErrorDealer)) {
    Assert.isFunction(httpRequestErrorDealer, `rpc http request error dealer must be a function, but got ${httpRequestErrorDealer}`);
    Vue.prototype.registerPlugin(HTTP_REQUEST_ERROR_DEALER_NAME, httpRequestErrorDealer);
  }

  if (!lodash.isNull(rpcErrorDealer)) {
    Assert.isFunction(rpcErrorDealer, `rpc error dealer must be a function, but got ${rpcErrorDealer}`);
    Vue.prototype.registerPlugin(RPC_ERROR_DEALER_NAME, rpcErrorDealer);
  }
}

/**
 * 请求队列元素
 * @param method
 * @param params
 * @param type
 * @param requestId
 * @return {{method: *, params: *, type: *}}
 */
function makeRpcQueueItem (method, params, type, requestId) {
  return {method: method, params: params, type: type, requestId: requestId};
}

/**
 * 请求队列promise
 * @param requestId
 * @return {Promise}
 */
function makeRpcQueuePromise (requestId) {
  return new Promise(function (resolve, reject) {
    let interval = setInterval(function () {
      if (HTTP_REQUEST_QUEUE_RESULTS[requestId]) {
        clearInterval(interval);
        let rpcResult = HTTP_REQUEST_QUEUE_RESULTS[requestId];
        HTTP_REQUEST_QUEUE_RESULTS[requestId] = null;
        resolve(rpcResult);
      }
    }, 100);
  }).then(rpcResult => {
    return rpcResult;
  });
}

function makeRequest (rpcQueueItem) {
  let request = null;
  switch (rpcQueueItem.type) {
    case 'get':
      request = axios.get(rpcQueueItem.method, {params: rpcQueueItem.params});
      break;
    case 'post':
      request = axios.post(rpcQueueItem.method, rpcQueueItem.params);
      break;
    default:
      Assert.isTrue(false, `Rpc queue item invalid, got ${rpcQueueItem}`);
      break;
  }
  return request;
}

/**
 * 请求队列完成后的回调
 */
function doAfterRpcQueueCallback () {
  let dealer = Vue.prototype.getPlugin(RPC_CALLBACK_SUCC_DEALER);
  if (lodash.isFunction(dealer)) {
    dealer();
  }
}

/**
 * http消息队列处理函数
 */
export function requestQueueDealer () {
  if (HTTP_REQUEST_QUEUE.length > 0) {
    let requests = [];
    let requestIds = [];
    lodash.map(HTTP_REQUEST_QUEUE, function (request, k) {
      requests.push(makeRequest(request));
      requestIds.push(`${request.requestId}`);
    });
    axios.all(requests).then(axios.spread(function (...results) {
      doAfterRpcQueueCallback();
      lodash.map(results, function (ret, rpcKey) {
        let rpcResult = rpcSucc(ret);
        HTTP_REQUEST_QUEUE_RESULTS[requestIds[rpcKey]] = rpcResult;
      })
    })).catch(error => {
      dealRequestError(error);
    });
    HTTP_REQUEST_QUEUE = lodash.drop(HTTP_REQUEST_QUEUE, HTTP_REQUEST_QUEUE.length);
  }
}

/**
 * 注册rpc正常返回的统一处理方法
 * @param dealer
 */
export function registerRpcSuccCommonDealer (dealer) {
  Assert.isFunction(dealer, `rpc ret succ dealer registered error, got ${dealer}`);
  Vue.prototype.registerPlugin(RPC_CALLBACK_SUCC_DEALER, dealer);
}

export default {
  HTTP_REQUEST_QUEUE_DEALER_FRAME,
  changeBaseDomain,
  registerParamsAdapter,
  registerRpcErrorDealer,
  registerRpcSuccCommonDealer,
  requestQueueDealer,
  get,
  post,
  axios
};
