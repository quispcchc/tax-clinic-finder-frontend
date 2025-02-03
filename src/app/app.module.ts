import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient} from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { FilterComponent } from './components/filter/filter.component';
import { ClinicListComponent } from './components/clinic-list/clinic-list.component';
import { MapComponent } from './components/map/map.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClinicDetailsComponent } from './components/clinic-details/clinic-details.component';
import { HeaderComponent } from './components/header/header.component';
import { TaxClinicsComponent } from './components/tax-clinics/tax-clinics.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TaxClinicManagementComponent } from './components/tax-clinic-management/tax-clinic-management.component';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { TaxClinicDetailsComponent } from './components/tax-clinic-details/tax-clinic-details.component';
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FilterComponent,
    ClinicListComponent,
    MapComponent,
    LanguageSelectorComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    ClinicDetailsComponent,
    HeaderComponent,
    TaxClinicsComponent,
    MyProfileComponent,
    UserManagementComponent,
    TaxClinicManagementComponent,
    DashboardMainComponent,
    TaxClinicDetailsComponent,
    MessagePopupComponent,
    UserModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
