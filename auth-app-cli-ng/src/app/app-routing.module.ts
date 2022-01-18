import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuard} from "../auth.guard";
import {AutoLoginGuard} from "../auto-login.guard";
import {Page404Component} from "./pages/page404/page404.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: "full" },
  { path: 'login', canActivate: [AutoLoginGuard], component: LoginComponent },
  { path: 'core', canActivate: [AuthGuard], loadChildren: () => import('./core/core.module').then(m => m.CoreModule) },
  { path: '**', canActivate: [AuthGuard], component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
