import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SoruEkleComponent } from './components/soru-ekle/soru-ekle.component';
import { SoruDuzenleComponent } from './components/soru-duzenle/soru-duzenle.component';
import { FirebaseServiceService } from './services/firebaseService.service';
import { SoruDetayComponent } from './components/soru-detay/soru-detay.component';
import { SorularimComponent } from './components/sorularim/sorularim.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SoruEkleComponent,
    SoruDuzenleComponent,
    SoruDetayComponent,
    SorularimComponent,
    AdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    FormsModule,
    CKEditorModule,
    AngularFireStorageModule,
  ],
  providers: [FirebaseServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
