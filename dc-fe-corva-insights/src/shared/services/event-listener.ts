export interface Subject {
  // eslint-disable-next-line no-use-before-define
  attach(observer: Observer): void;
  // eslint-disable-next-line no-use-before-define
  detach(observer: Observer): void;
  notify(...args): void;
}

export interface Observer {
  update(...args): void;
}
