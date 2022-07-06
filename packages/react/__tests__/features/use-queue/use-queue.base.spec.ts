import { act, waitFor } from "@testing-library/react";
import { startServer, resetInterceptors, stopServer, createRequestInterceptor } from "../../server";
import { addQueueElement, builder, createCommand, renderUseQueue } from "../../utils";

describe("useQueue [ Base ]", () => {
  let command = createCommand({ method: "POST" });

  beforeAll(() => {
    startServer();
  });

  afterEach(() => {
    resetInterceptors();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(() => {
    jest.resetModules();
    builder.clear();
    command = createCommand({ method: "POST" });
  });

  describe("given hook is mounting", () => {
    describe("when queue is processing requests", () => {
      it("should initialize with all processed requests", async () => {
        createRequestInterceptor(command);
        addQueueElement(command);
        const { result } = renderUseQueue(command);
        expect(result.current.requests).toHaveLength(1);
      });
      it("should remove finished requests from queue", async () => {
        createRequestInterceptor(command);
        addQueueElement(command);
        const { result } = renderUseQueue(command);

        await waitFor(() => {
          expect(result.current.requests).toHaveLength(0);
        });
      });
    });
  });
  describe("given queue is empty", () => {
    describe("when command is added to queue", () => {
      it("should update the requests values", async () => {
        createRequestInterceptor(command);
        const { result } = renderUseQueue(command);

        act(() => {
          addQueueElement(command, { stop: true });
        });

        await waitFor(() => {
          expect(result.current.requests).toHaveLength(1);
        });

        builder.commandManager.events.emitDownloadProgress();
      });
      it("should update upload progress of requests", async () => {});
      it("should update download progress of requests", async () => {});
    });
  });
});
