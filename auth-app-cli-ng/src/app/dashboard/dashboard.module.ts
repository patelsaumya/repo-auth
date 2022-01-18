import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MasterIncludeModule} from "../master-include/master-include.module";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MasterIncludeModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
