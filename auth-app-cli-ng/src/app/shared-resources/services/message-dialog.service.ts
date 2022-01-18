import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MessageDialogComponent} from "../dialogs/message-dialog/message-dialog.component";
import {EnumScreenSizes} from "../enum-types";
import {BreakpointObserverService} from "./breakpoint-observer.service";

@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {
  public screenSize = EnumScreenSizes.xs;
  public screenSize$: Subscription;

  constructor(
    private breakpointObserverService: BreakpointObserverService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MessageDialogComponent>
  ) {
    this.screenSize$ = this.breakpointObserverService.screenSize$.subscribe(p => {
      this.screenSize = p;
    });
  }

  public showDialog(data: any, callback: any = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.width = this.screenSize > EnumScreenSizes.sm ? '40%' : '95%';
    dialogConfig.height = this.screenSize > EnumScreenSizes.sm ? 'auto' : '95%';

    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'g-dialog-panel-class';

    dialogConfig.data = data;
    const dialogRef = this.dialog.open(MessageDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userChoice => {
      if(callback) {
        callback(userChoice);
      }
    });
  }
}
