import { ClientType, FetchClientXHR } from "client";
import { FetchBuilder } from "builder";
import { FetchCommand } from "command";
import { interceptBase } from "../../utils/mocks";
import { resetMocks, startServer, stopServer } from "../../utils/server";

const baseUrl = "some-url";
const options: FetchClientXHR = { timeout: 1000 };

describe("FetchBuilder", () => {
  beforeAll(() => {
    startServer();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    stopServer();
  });

  describe("When initializing the builder", () => {
    it("should assign provided props", async () => {
      const builder = new FetchBuilder({ baseUrl, debug: true, options });

      expect(builder.options).toStrictEqual(options);
      expect(builder.baseUrl).toBe(baseUrl);
      expect(builder.debug).toBe(true);
    });

    it("should initialize with applied methods", async () => {
      const builder = new FetchBuilder({ baseUrl, options })
        .onError((error) => error)
        .onRequest((command) => command)
        .onRequest((command) => command)
        .onResponse(() => [null, null, 0])
        .onResponse(() => [null, null, 0]);

      expect(builder.onRequestCallbacks).toHaveLength(2);
      expect(builder.onResponseCallbacks).toHaveLength(2);
      expect(builder.onErrorCallback).toBeDefined();
    });
  });

  describe("When using built in methods", () => {
    it("should apply custom client", async () => {
      const customHttpClient: ClientType<any, any> = () => Promise.resolve([null, null, 0]);

      const builder = new FetchBuilder({ baseUrl, options }).setClient(customHttpClient);

      expect(builder.client).toBe(customHttpClient);
    });

    it("should call the methods", async () => {
      const errorCall = jest.fn();
      const requestCall = jest.fn();
      const responseCall = jest.fn();

      const builder = new FetchBuilder({ baseUrl })
        .onError((error) => {
          errorCall(error);
          return error;
        })
        .onRequest((command) => {
          requestCall(command);
          return command;
        })
        .onResponse((response, command) => {
          responseCall(response, command);
          return [null, null, 0];
        });

      const command = builder.create()({
        endpoint: "/",
      });

      interceptBase(400);

      await command.send();

      expect(errorCall.mock.calls[0][0]).toEqual({ message: "Error" });
      expect(requestCall.mock.calls[0][0] instanceof FetchCommand).toBeTruthy();
      expect(requestCall.mock.calls[0][0] instanceof FetchCommand).toBeTruthy();
      expect(responseCall.mock.calls[0][0]).toEqual([null, { message: "Error" }, 400]);
      expect(responseCall.mock.calls[0][1] instanceof FetchCommand).toBeTruthy();
      expect(responseCall.mock.calls[0][1] instanceof FetchCommand).toBeTruthy();
    });

    it("should allow to create FetchCommand", async () => {
      const builder = new FetchBuilder({ baseUrl, options });

      const command = builder.create()({ endpoint: "some-endpoint" });

      expect(command instanceof FetchCommand).toBeTruthy();
      expect(command instanceof FetchCommand).toBeTruthy();
    });
  });

  describe("When using Builder methods", () => {
    it("should trigger onRequest method before making request", async () => {
      const methodFn = jest.fn();

      interceptBase(200);

      const builder = new FetchBuilder({ baseUrl, options }).onRequest((command) => {
        methodFn();
        return command;
      });

      const command = builder.create()({
        endpoint: "/",
      });

      await command.send();

      expect(methodFn).toBeCalled();
    });

    it("should throw onRequest method when command is not returned", async () => {
      const methodFn = jest.fn();

      interceptBase(200);

      const builder = new FetchBuilder({ baseUrl, options }).onRequest((command) => {
        methodFn();
        return undefined as unknown as typeof command;
      });

      const command = builder.create()({
        endpoint: "/",
      });

      expect(command.send()).rejects.toThrow();
    });

    it("should trigger onResponse method after making request", async () => {
      const methodFn = jest.fn();

      interceptBase(200);

      const builder = new FetchBuilder({ baseUrl, options }).onResponse((response) => {
        methodFn();
        return response;
      });

      const command = builder.create()({
        endpoint: "/",
      });

      await command.send();

      expect(methodFn).toBeCalled();
    });

    it("should throw onResponse method when command is not returned", async () => {
      const methodFn = jest.fn();

      interceptBase(200);

      const builder = new FetchBuilder({ baseUrl, options }).onRequest((command) => {
        methodFn();
        return undefined as unknown as typeof command;
      });

      const command = builder.create()({
        endpoint: "/",
      });

      expect(command.send()).rejects.toThrow();
    });
  });
});