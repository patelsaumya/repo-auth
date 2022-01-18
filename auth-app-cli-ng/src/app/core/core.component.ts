import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import * as path from "path";
import {Router} from "@angular/router";

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

  public currentUser: any = "";
  public users: any = [];

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!localStorage.getItem('session')) {
      localStorage.setItem('session', `${Math.random()}`);
    }
  }

  getCurrentUser() {
    const access_token = this.cookieService.get('access_token');
    const payLoad = JSON.parse(atob(access_token.split('.')[1]));
    return payLoad.fullName[0]?.toUpperCase();
  }

  logOut() {
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.router.navigate(['/login']);
    localStorage.setItem('session', `${Math.random()}`);
  }

  getFullName() {
    const access_token = this.cookieService.get('access_token');
    const payLoad = JSON.parse(atob(access_token.split('.')[1]));
    return payLoad.fullName;
  }
}
