import { GLOBAL_CONSTS } from 'app/utils/constants';

const { DB_NAME, STORE_NAME } = GLOBAL_CONSTS;

class IndexedDbService {
  static openRequest;

  constructor() {
    if (!IndexedDbService.openRequest) {
      IndexedDbService.openRequest = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);

        request.onupgradeneeded = () => {
          request.result.createObjectStore(STORE_NAME, { autoIncrement: true });
        };

        request.onsuccess = () => {
          if (!request.result.objectStoreNames.contains(STORE_NAME)) {
            request.result.createObjectStore(STORE_NAME, {
              autoIncrement: true
            });
          }

          resolve(request.result);
        };

        request.onerror = e => reject(e);
      });
    }
  }

  static setToken = async token => {
    new IndexedDbService();

    const db = await IndexedDbService.openRequest;

    const store = db
      .transaction(STORE_NAME, 'readwrite')
      .objectStore(STORE_NAME);

    store.clear();
    store.add({ refresh: token });
  };

  static getToken = () => {
    new IndexedDbService();

    return new Promise((resolve, reject) => {
      return IndexedDbService.openRequest.then(db => {
        const request = db
          .transaction(STORE_NAME)
          .objectStore(STORE_NAME)
          .getAll();

        request.onsuccess = event => {
          resolve(event.target.result[0] ?? {});
        };

        request.onerror = e => {
          reject(e);
        };
      });
    });
  };
}

export default IndexedDbService;
