import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { QuickAccessComponent } from './quick-access/quick-access.component';
import {MasterIncludeModule} from "../master-include/master-include.module";


@NgModule({
  declarations: [
    CoreComponent,
    QuickAccessComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MasterIncludeModule
  ]
})
export class CoreModule { }
