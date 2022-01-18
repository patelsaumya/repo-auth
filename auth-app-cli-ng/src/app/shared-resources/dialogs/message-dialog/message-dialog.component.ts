import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})

export class MessageDialogComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  myForm = this.fb.group({
    name: ['', [Validators.required]],
  });

  constructor(
    public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
  }

  closeDialog(value: any) {
    this.dialogRef.close(value);
  }
}
