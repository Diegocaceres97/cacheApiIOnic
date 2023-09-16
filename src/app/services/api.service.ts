import { CachingService } from './caching.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, from, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private cachingService: CachingService) { }

  getUsers(forceRefresh: any){
    const url = 'https://randomuser.me/api?result=10';
    return this.getData(url, forceRefresh).pipe(
      map((res:any)=> res.results)
    )
  }

  private getData(url:any, forceRefresh: any): Observable<any> {
    if(forceRefresh){
      return this.callAndCache(url);
    }else{
      const storedValue =  from(this.cachingService.getCachedRequest(url));
      return storedValue.pipe(
        switchMap(result => {
          if(!result){
            //make an api call
            return this.callAndCache(url);
          }else{
            return of(result)
          }
        })
      );
    }
  }

  getChuckJoke(forceRefresh: boolean) {
    const url = 'https://api.chucknorris.io/jokes/random';
    return this.getData(url, forceRefresh);
  }

  private callAndCache(url:any): Observable<any> {
    return this.http.get(url).pipe(
      delay(2000),
      tap(res => {
        this.cachingService.cacheRequest(url, res);
      })
    )
  }
}
