import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const TTL = 10;
const CACHE_KEY = "_mycached_";
@Injectable({
  providedIn: 'root'
})
export class CachingService {

  constructor(private storage: Storage) { }

  async initStorage() {
    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
  }

  cacheRequest(url:any, data:any){
    const validateUntil = (new Date().getTime()) + TTL *1000;
    url = `${CACHE_KEY}${url}`;

    return this.storage.set(url, { validateUntil, data})
  }

  async getCachedRequest(url: any){
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;

    const storedValue = await this.storage.get(url);

    if(!storedValue){
      return null;
    } else if(storedValue.validateUntil < currentTime){
      await this.storage.remove(url);
      return null;
    } else {
      return storedValue.data;
    }
  }

  async clearCachedData() {
    const keys = await this.storage.keys();

    keys.map(async key => {
      if(key.startsWith(CACHE_KEY)){
        await this.storage.remove(key);
      }
    })
  }

  async invalidateCacheEntry(url: any){
    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }

}
