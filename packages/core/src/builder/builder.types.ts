import { Cache } from "cache";
import { CommandInstance } from "command";
import { Dispatcher } from "dispatcher";
import { ClientResponseType, ClientType, ClientQueryParamsType } from "client";
import { Builder } from "builder";
import { AppManager } from "managers";
import { NegativeTypes } from "types";

/**
 * Configuration setup for the builder
 */
export type BuilderConfig = {
  /**
   * Url to your server
   */
  baseUrl: string;
  /**
   * Disable the web event listeners and actions on window object
   */
  isNodeJS?: boolean;
  /**
   * Custom client initialization prop
   */
  client?: ClientType;
  /**
   * Custom cache initialization prop
   */
  cache?: <B extends BuilderInstance, C extends Cache>(builder: B) => C;
  /**
   * Custom app manager initialization prop
   */
  appManager?: <B extends BuilderInstance, A extends AppManager>(builder: B) => A;
  /**
   * Custom fetch dispatcher initialization prop
   */
  fetchDispatcher?: <B extends BuilderInstance, D extends Dispatcher>(builder: B) => D;
  /**
   * Custom submit dispatcher initialization prop
   */
  submitDispatcher?: <B extends BuilderInstance, D extends Dispatcher>(builder: B) => D;
};

export type BuilderInstance = Builder<any, any>;

export type BuilderErrorType = Record<string, any> | string;

// Interceptors

export type RequestInterceptorCallback = (command: CommandInstance) => Promise<CommandInstance> | CommandInstance;
export type ResponseInterceptorCallback<Response = any, Error = any> = (
  response: ClientResponseType<Response, Error>,
  command: CommandInstance,
) => Promise<ClientResponseType<any, any>> | ClientResponseType<any, any>;

// Stringify

export type StringifyCallbackType = (queryParams: ClientQueryParamsType | string | NegativeTypes) => string;
