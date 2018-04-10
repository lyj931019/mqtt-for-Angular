import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpService {
  constructor(private http: Http) {
  }

  postData(url, value) { // post方法（未测试）
    return this.http.post(url, value).toPromise()
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.json());
        });
      })
      .catch(this.handleError);
  }

  getData(url) {  // get方法
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.json());
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
