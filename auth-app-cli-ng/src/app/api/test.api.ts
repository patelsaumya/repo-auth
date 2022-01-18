import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class TestApi {
  constructor(
    public http: HttpClient,
    public cookieService: CookieService
  ) {

  }
  public test() {
    const accessToken = this.cookieService.get('access_token');
    const url = 'http://localhost:9092/secured/test';
    return this.http.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

  }
}
