import { chainedInstruction } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Soru } from 'src/app/models/soru';
import { Uye } from 'src/app/models/uye';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(public service: FirebaseServiceService, public router: Router) { }
  public uye!: Uye;
  sorular: Soru[] = [];
  ngOnInit() {
    // Kullanılan user ile localstoragedaki user'ın kaşılaştırıldığı bölüm. 
    // Eğer admin değil ise navigate ile anasayfaya gönderir.
    // Eğer admin ise veriler yansıtılır.ç
    const user: firebase.default.User = JSON.parse(localStorage.getItem("user") as string)
    if (!user) {
      this.router.navigate(['/'])
      return
    }
    this.service.db.list<Uye>("/Uye", ref => ref.orderByChild("uid").equalTo(user.uid)).snapshotChanges().subscribe(([change]) => {
      const uye: Uye = {
        ...change.payload.val() as Uye,
        key: change.key as string,
      };
      if (uye.rol !== "admin") {
        this.router.navigate(['/'])
        return

      }
    })
    this.soruListele()
  }

  // Veri tabanındaki verilerin çekileceği yer.
  soruListele() {
    this.service.soruListele().snapshotChanges().subscribe(data => {
      this.sorular = []
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key }
        this.sorular.push(y as Soru)
      })
    })
  }

  soruSil(id: string) {
    this.service.soruSilByUID(id).then(d => {
      this.router.navigate(['/'])
    })
  }
}
