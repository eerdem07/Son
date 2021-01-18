import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { Soru } from 'src/app/models/soru';
import { Sonuc } from 'src/app/models/sonuc';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  adsoyad!: string;
  uid!: string;
  yeniSoru: Soru = new Soru()
  sonuc: Sonuc = new Sonuc();
  sorular: Soru[] = [];
  key!: string
  constructor(
    public servis: FirebaseServiceService,
    public router: Router,
    public route: ActivatedRoute

  ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user")!);
    this.adsoyad = user.displayName
    this.uid = user.uid
    this.soruListele()

    this.route.params.subscribe(p => {
      this.key = p.key
    })
  }

  // soruListele() {
  //   this.servis.soruListeleByUID(this.uid).snapshotChanges().subscribe(satirlar => {
  //     this.kayitlar = []
  //     satirlar.forEach(satir => {
  //       const y = { ...satir.payload.toJSON(), key: satir.key }
  //       this.kayitlar.push(y as Kayit)
  //     })
  //   })
  // }

  // Anasayfada herkesin görebileceği ancak sahibi olunmayan soruların silinip/düzenlenmeyeceği yer.

  soruListele() {
    this.servis.soruListele().snapshotChanges().subscribe(data => {
      this.sorular = []
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key }
        this.sorular.push(y as Soru)
      })
    })
  }

  // Sadece soru sahibin sileceği sil yeri. 

  soruSil(id: string) {
    this.servis.soruSilByUID(id).then(d => {
      this.router.navigate(['/'])
    })
  }
}
