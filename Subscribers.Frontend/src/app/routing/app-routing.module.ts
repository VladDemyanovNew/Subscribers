import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { PostsComponent } from '../posts/posts.component';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { AuthenticationGuard } from './authentication.guard';

const appRoutes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'posts',
    canActivate: [AuthenticationGuard],
    component: PostsComponent,
  },
  {
    path: 'dialogs',
    canActivate: [AuthenticationGuard],
    component: DialogsComponent,
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
