import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MasterIncludeModule} from "../master-include/master-include.module";
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";



@NgModule({
  declarations: [
    MessageDialogComponent
  ],
  imports: [
    CommonModule,
    MasterIncludeModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ]
})
export class SharedResourcesModule { }
