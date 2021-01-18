import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Soru } from 'src/app/models/soru';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';

@Component({
  selector: 'app-soru-ekle',
  templateUrl: './soru-ekle.component.html',
  styleUrls: ['./soru-ekle.component.css']
})
export class SoruEkleComponent implements OnInit {
  seciliSoru: Soru = new Soru()
  constructor(
    public servis: FirebaseServiceService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  soruEkle() {
    // LocalStorage üzerinden geçilen user belirli değişkene atanır. Ardından servis ile birlikte Soru Ekle bölümüne gönderilir. Ardından Anasayfaya router ile göndeririz.
    let user = JSON.parse(localStorage.getItem("user")!)
    this.seciliSoru.uid = user.uid
    let tarih = new Date()
    this.seciliSoru.kayTarih = tarih.getTime().toString()
    this.seciliSoru.duzTarih = tarih.getTime().toString()
    this.servis.soruEkle(this.seciliSoru).then(d => {
      this.router.navigate(['/'])
    })
  }

}
