//@no-check
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountloginComponent } from './accountlogin/accountlogin.component';
import { AccountlogoutComponent } from './accountlogout/accountlogout.component';
import { AuthComponent } from './auth.component';
import { AccountsignupComponent } from './accountsignup/accountsignup.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { ForgetsubpaswordComponent } from './forgetsubpasword/forgetsubpasword.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { SubpasswordComponent } from './subpassword/subpassword.component';
import { SubpasswordresetComponent } from './subpasswordreset/subpasswordreset.component';
import { ValidateSucessComponent } from './validate-sucess/validate-sucess.component';
import { ValidateComponent } from './validate/validate.component';
import { ValidatepasswordComponent } from './validatepassword/validatepassword.component';
import { SetpasswordComponent } from '../subuser/setpassword/setpassword.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            { path: 'login', component: AccountloginComponent },
            { path: 'logout', component: AccountlogoutComponent },
            { path: 'signup', component: AccountsignupComponent },
            { path: 'signup/:package', component: AccountsignupComponent },
            { path: 'dovalidate/:mail', component: ValidateComponent },
            { path: 'validate/:mail/:random', component: ValidateSucessComponent },
            { path: 'subvalidate/:mail/:submail/:random', component: SubpasswordComponent },
            { path: 'forget', component: ForgetpasswordComponent },
            { path: 'reset/:email/:randNo', component: PasswordresetComponent },
            { path: 'subforget', component: ForgetsubpaswordComponent },
            { path: 'subreset/:email/:submail/:randNo', component: SubpasswordresetComponent },


            { path: 'etrvalidate/:id/:random', component: ValidatepasswordComponent },
            { path: 'subuservalidate/:dentalID/:subUserId/:verification', component: SetpasswordComponent },
        ]
    },
]

@NgModule({
    declarations: [
        AuthComponent,
        AccountloginComponent,
        AccountlogoutComponent,
        AccountsignupComponent,
        ForgetpasswordComponent,
        ForgetsubpaswordComponent,
        ValidateComponent,
        ValidateSucessComponent,
        SubpasswordComponent,
        PasswordresetComponent,
        SubpasswordresetComponent,
        ValidatepasswordComponent,
        SetpasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SocialLoginModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '791590883710-6qpkgpv988sbhgsu8dih0jo7ju993ock.apps.googleusercontent.com'
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('860555611481538')
                    }
                ],
                onError: (err: any) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
