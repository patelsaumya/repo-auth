import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'authapp-cli-ng';

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const $activatedRoute = this.activatedRoute;
    window.addEventListener('storage', function(event) {
      if (event.key === 'session') {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))?.split('=')[1];
        if(!cookieValue) {
          window.location.href = "http://localhost:4200/login";
        } else {
          const returnUrl = $activatedRoute.snapshot.queryParams['returnUrl'];
          if(returnUrl) {
            window.location.href = `http://localhost:4200${returnUrl}`;
          } else {
            window.location.href = "http://localhost:4200/core";
          }
        }
      }
    });
  }


}
