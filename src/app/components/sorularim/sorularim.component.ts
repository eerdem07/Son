import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Soru } from 'src/app/models/soru';
import { Uye } from 'src/app/models/uye';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';
@Component({
  selector: 'app-sorularim',
  templateUrl: './sorularim.component.html',
  styleUrls: ['./sorularim.component.scss']
})
export class SorularimComponent implements OnInit {
  uid!: string;
  adsoyad!: string;
  yeniSoru: Soru = new Soru()
  sorular: Soru[] = [];
  constructor(public servis: FirebaseServiceService, public router: Router) { }

  ngOnInit() {
    // Localstorage bölümünden user adlı değişken çekilir ve user' aktarılır. ardından bu değer uid'e aktarılır. En sonunda soru listele çalışır. 

    let user = JSON.parse(localStorage.getItem("user")!);
    this.adsoyad = user.displayName
    this.uid = user.uid
    this.soruListele()
  }

  // UID' değeri servise gönderilir. Servisten gelen değerler satirlar adli arrow functionda çalıştırılır. Satırlar bir dizi geleceği için ForEach ile gelen satirlari satir adlı değişkene atarız.
  async soruListele() {
    this.servis.soruListeleByUID(this.uid).snapshotChanges().subscribe(satirlar => {
      this.sorular = []
      satirlar.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key }
        this.sorular.push(y as Soru)
      })
    })
  }

  // Tıklanan sorunun idsini servise göndeririz. ve gelen değere göre router ile anasayfaya yönlendiririz.
  soruSil(id: string) {
    this.servis.soruSilByUID(id).then(d => {
      this.router.navigate(['/'])
    })
  }

}
