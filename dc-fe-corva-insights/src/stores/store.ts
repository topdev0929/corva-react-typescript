export class StoreWithDependencies<API, Stores> {
  protected readonly api: API;
  protected readonly stores: Stores;

  protected constructor(api: API, stores: Stores) {
    this.api = api;
    this.stores = stores;
  }
}
