import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Soru } from 'src/app/models/soru';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';

@Component({
  selector: 'app-soru-duzenle',
  templateUrl: './soru-duzenle.component.html',
  styleUrls: ['./soru-duzenle.component.css']
})
export class SoruDuzenleComponent implements OnInit {
  key!: string
  seciliSoru: Soru = new Soru()
  constructor(
    public route: ActivatedRoute,
    public servis: FirebaseServiceService,
    public router: Router
  ) { }

  ngOnInit() {
    // Düzenlencek sorununun URL üzerinden key alınıp Sorubul'a gönderileceği yer.
    this.route.params.subscribe(p => {
      this.key = p.key
      this.soruBul()
    })
  }
  // Değerin servisten çekileceği yer.
  soruBul() {
    this.servis.soruListeleByKey(this.key).subscribe(soru => {
      this.seciliSoru = soru
    })
  }
  // secilen soru adlı değilenin servise götürülüp serviste update paramateresi ile güncellenip gönderilmesi.
  soruDuzenle() {
    let tarih = new Date()
    this.seciliSoru.duzTarih = tarih.getTime().toString()
    this.servis.soruDuzenle(this.seciliSoru).then(d => {
      this.router.navigate(['/'])
    })
  }


}
