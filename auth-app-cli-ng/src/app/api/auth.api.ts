import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  constructor(
    public http: HttpClient
  ) {

  }
  public localLogin(loginId: string, password: string) {
    const url = 'http://localhost:9092/auth/local-login';
    return this.http.post(url, {loginId, password}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }
  public refreshToken(): Observable<any> { // Specifications.3.
    const reqHeader = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:9092/auth/refresh-token', null, {headers: reqHeader});
  }
}
