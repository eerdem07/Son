import { Component } from '@angular/core';
import { FirebaseServiceService } from './services/firebaseService.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'final';
  constructor(
    public servis: FirebaseServiceService,
    public router: Router
  ) {
  }

  oturumKontrol() {
    this.servis.oturumCheck()
  }

  signOut() {
    this.servis.signOut().then(d => {
      localStorage.removeItem("user")
      this.router.navigate(['/login'])
    })

  }


}
