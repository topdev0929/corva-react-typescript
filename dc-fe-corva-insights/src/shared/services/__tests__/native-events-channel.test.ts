import { NativeEventsChannel, IosChannel, AndroidChannel } from '../native-events-channel';

describe('NativeEventsChannel', () => {
  let channel: NativeEventsChannel;

  beforeEach(() => {
    channel = NativeEventsChannel.getInstance();
  });

  it('should be defined', () => {
    expect(channel).toBeDefined();
  });

  it('should be singleton', () => {
    const newChannel = NativeEventsChannel.getInstance();
    expect(channel).toEqual(newChannel);
  });

  describe('send', () => {
    it('should send message to ios channel', () => {
      const mockedIosChannel = {
        postMessage: jest.fn(),
      } as unknown as IosChannel;
      window.webkit = {
        messageHandlers: {
          swiftHandler: mockedIosChannel,
        },
      } as unknown as Window['webkit'];

      const message = 'message';
      channel.send(message);

      expect(mockedIosChannel.postMessage).toHaveBeenCalledWith(message);
    });

    it('should send message to android channel', () => {
      window.webkit = undefined;
      window.androidInterface = {
        notify: jest.fn(),
      } as unknown as AndroidChannel;

      const message = 'message';
      channel.send(message);

      expect(window.androidInterface.notify).toHaveBeenCalledWith(message);
    });
  });
});
