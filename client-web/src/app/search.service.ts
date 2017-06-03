import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http'

import {config} from './config';
import {BlinkItem} from './blink-item'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/observable/throw';



@Injectable()
export class SearchService {

  constructor(private http: Http) {    }

  search(query: string) : Observable<BlinkItem[]> {
    let queryStringParams : { [key:string] : string } = {"api-version":"2015-02-28"};
    let requestHeaders : Headers = new Headers({"api-key": config.searchAuthKey});
    queryStringParams["search"] = query+'*';
    let qs = this.createQsString(queryStringParams);

    //let requestUrl = "assets/search.service.mockdata.json";
    let requestUrl = `${config.searchServiceUrl}/indexes/${config.searchIndexName}/docs?${qs}`;

    return this.http.get(requestUrl, { headers:requestHeaders })
      .map((response: Response) => response.json().value.map(item => this.jsonToBlinkItem(item)))
      .catch(this.handleError);
  }

  submit(link:BlinkItem) : Observable<BlinkItem> {
    let requestHeaders : Headers = new Headers({"x-functions-clientid": config.serverAuthKey});
    let requestUrl = `${config.serverUrl}/links?code=${config.serverAuthKey}`;
    return this.http.post(requestUrl, link, { headers:requestHeaders})
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  update(link:BlinkItem) : Observable<BlinkItem> {
    let requestHeaders : Headers = new Headers({"x-functions-clientid": config.serverAuthKey});
    let requestUrl = `${config.serverUrl}/links/${link.id}?code=${config.serverAuthKey}`;

    return this.http.put(requestUrl, link, { headers:requestHeaders})
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  lookup(id:string) : Observable<BlinkItem> {
    let queryStringParams : { [key:string] : string } = {"api-version":"2015-02-28"};
    let requestHeaders : Headers = new Headers({"api-key": config.searchAuthKey});
    let qs = this.createQsString(queryStringParams);
    let requestUrl = `${config.searchServiceUrl}/indexes/${config.searchIndexName}/docs/${id}?${qs}`;

    return this.http.get(requestUrl, { headers:requestHeaders })
      .map((response: Response) => this.jsonToBlinkItem(response.json()))
      .catch(this.handleError);
  }

  searchTags(query:string) : Observable<string[]> {
    let queryStringParams : { [key:string] : string } = {"api-version":"2015-02-28"};
    let requestHeaders : Headers = new Headers({"api-key": config.searchAuthKey});
    queryStringParams["search"] = query+'*';
    queryStringParams["searchFields"] = "tags";
    queryStringParams["select"] = "tags";
    let qs = this.createQsString(queryStringParams);

    //let requestUrl = "assets/search.service.mocktags.json";
    let requestUrl = `${config.searchServiceUrl}/indexes/${config.searchIndexName}/docs?${qs}`;

    return this.http.get(requestUrl, { headers:requestHeaders })
      .switchMap((response: Response) => response.json().value)
      .flatMap((value:{tags:string[]}) => value.tags)
      .distinct()
      .take(6)
      .reduce((acc:string[],curr:string):string[] => acc.concat([curr]),[])
      .catch(this.handleError);
  }
  private handleError(err) {
    console.log(err);
    return Observable.throw(err.json().error || 'Server error');
  }

  private createQsString(dictionary: { [key:string] : string}) {
    return Object.keys(dictionary).map((property) => `${property}=${dictionary[property]}`).join('&');
  }

  private jsonToBlinkItem (json : any) : BlinkItem {
    let tmp = new BlinkItem();
    if (json.id) { 
      tmp.id = json.id;
     }
    if (json.title) { 
      tmp.title = json.title;
     }
    if (json.url) { 
      tmp.url = json.url;
     }
    if (json.description) { 
      tmp.description = json.description;
     }
    if (json.description) { 
      tmp.tags = json.description;
     }
     if (json.tags) {   
      tmp.tags = json.tags;
     }
    if (json.modified) { 
      tmp.modified = json.modified;
     }
    return tmp;
  }
}
