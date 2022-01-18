import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthApi} from "../../api/auth.api";
import {CookieService} from "ngx-cookie-service";
import {MessageDialogService} from "../../shared-resources/services/message-dialog.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm = this.fb.group({
    loginId: ['', [Validators.required]],
    password: ['', [Validators.required]]
    // rememberMe: [false]
  });

  public passwordInvisible = true;

  constructor(
    public fb: FormBuilder,
    public authApi: AuthApi,
    private cookieService: CookieService,
    private messageDialogService: MessageDialogService,
    private el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  showEnableCookies() {
    this.messageDialogService.showDialog({
      title: 'Please Enable Cookies',
      message: 'Cookies are disabled for this browser. Kindly, enable them to use this application.',
      buttons: [{
        caption: 'OK',
        isDefault: true,
        color: 'primary',
        value: 'ok'
      }]
    }, () => {
      this.resetForm();
    });
    return;
  }
  ngOnInit(): void {
    if(!navigator.cookieEnabled) {
      this.showEnableCookies();
      return;
    }


    if((!this.cookieService.get('access_token')) && (localStorage.getItem('session'))) {
      localStorage.removeItem('session');
    }


    this.resetForm();
  }

  resetForm() {
    this.passwordInvisible = true;

    this.myForm.patchValue({
      loginId: '',
      password: '',
      rememberMe: false
    });

    this.myForm.get('loginId')?.setErrors(null);
    this.myForm.get('password')?.setErrors(null);

    const ctrl = this.el.nativeElement.querySelector("[formControlName='loginId']");
    ctrl.focus();
  }

  doLogin() {
    const loginId = this.myForm.get('loginId')?.value;
    const password = this.myForm.get('password')?.value;

    if(!navigator.cookieEnabled) {
      this.showEnableCookies();
      return;
    }

    this.authApi.localLogin(loginId, password).subscribe((result: any) => {

      const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
      if(returnUrl) {
        this.router.navigate([returnUrl]);
      } else {
        this.router.navigate(['/core']);
      }
      localStorage.setItem('session', `${Math.random()}`);
    }, err => {
      this.messageDialogService.showDialog({
        title: 'Error Signing In',
        color: 'warn',
        message: err.error.message,
        buttons: [{
          caption: 'OK',
          isDefault: true,
          color: 'primary',
          value: 'ok'
        }]
      }, () => {
        this.resetForm();
      });
    });
  }

}
