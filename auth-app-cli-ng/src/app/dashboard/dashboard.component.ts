import { Component, OnInit } from '@angular/core';
import {TestApi} from "../api/test.api";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private testApiService: TestApi
  ) { }

  ngOnInit(): void {
  }

  test() {
    this.testApiService.test().subscribe(result => {
      console.log(result);
    });
  }
}
