
import { throwError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiEndpoint = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<Array<any>>(this.apiEndpoint, {
      headers: new HttpHeaders().set('Accept', 'application/json')
    }).pipe(
      map(this.mapUsers),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  public addUser(user: User): Observable<User> {
    const postBody = {
      name: user.name,
      company: {
        bs: user.bs
      }
    };

    return this.http.post<any>(this.apiEndpoint, postBody, {
      headers: new HttpHeaders().set('Accept', 'application/json')
        .set('Content-Type', 'application/json'),
    }).pipe(
      map(response => {
        return {
          name: response.name,
          bs: response.company.bs
        };
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  private mapUsers(body: Array<any>) {
    return body.filter(u => u['id'] <= 5)
      .map( u => {
        return <User>{
          id: u.id,
          name: u.name,
          bs: u.company.bs,
          avatar: `svg-${u.id}`
        };
      });
  }
}
