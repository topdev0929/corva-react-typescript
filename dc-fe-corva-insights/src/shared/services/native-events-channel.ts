export type AndroidChannel = {
  notify: (message: string) => void;
};

export type IosChannel = {
  postMessage: (message: string) => void;
};

declare global {
  interface Window {
    androidInterface?: AndroidChannel;
    webkit?: {
      messageHandlers?: {
        swiftHandler: IosChannel;
      };
    };
  }
}

export class NativeEventsChannel {
  private static instance: NativeEventsChannel;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): NativeEventsChannel {
    if (!NativeEventsChannel.instance) {
      NativeEventsChannel.instance = new NativeEventsChannel();
    }
    return NativeEventsChannel.instance;
  }

  send(message: string) {
    const iosChannel = this.#getIosChannel();
    if (iosChannel) {
      iosChannel.postMessage(message);
    } else if (window.androidInterface) {
      window.androidInterface.notify(message);
    }
  }

  #getIosChannel(): IosChannel | null {
    return window.webkit && window.webkit.messageHandlers
      ? window.webkit.messageHandlers.swiftHandler
      : null;
  }
}

export const nativeEventsChannel = NativeEventsChannel.getInstance();
