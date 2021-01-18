import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Soru } from 'src/app/models/soru';
import { map } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';
import { Cevap } from 'src/app/models/cevap';
import { Sonuc } from 'src/app/models/sonuc';
@Component({
  selector: 'app-soru-detay',
  templateUrl: './soru-detay.component.html',
  styleUrls: ['./soru-detay.component.css']
})
export class SoruDetayComponent implements OnInit {
  key!: string
  seciliSoru: Soru = new Soru()
  seciliCevaplar: Cevap[] = []
  sonuc: Sonuc = new Sonuc()
  uid!: string;
  constructor(private readonly db: AngularFireDatabase, public route: ActivatedRoute, public servis: FirebaseServiceService, public router: Router) { }

  public cevap: Cevap = new Cevap()

  ngOnInit() {


    // this.db.list<Kayit>("Kayitlar").snapshotChanges().pipe(
    //   map(satirlar => {
    //     return satirlar.map(satir => {
    //       const soru = { key: satir.key, ...satir.payload.val() } as Kayit;
    //       this.db.list<Cevap>('Cevaplar', ref => ref.orderByChild("soruId").equalTo(soru.key))
    //         .snapshotChanges()
    //         .pipe(map(satirlar => satirlar.map(satir => ({ key: satir.key, ...satir.payload.val() }))))
    //         .subscribe(cevaplar => {
    //           soru.cevaplar = cevaplar;
    //         })
    //       return soru;
    //     })
    //   })
    // )

    // Route bölümünden alınan key değerine göre 
    let user = JSON.parse(localStorage.getItem("user")!);
    this.uid = user.uid
    this.route.params.subscribe(p => {
      this.key = p.key
      this.soruBul()
    })

    this.sonuc.islem = false
  }
  // Route bölümünden alınan key değerine göre veritabanından çekilecek  yer.
  soruBul() {
    this.servis.soruListeleByKey(this.key).subscribe(soru => {
      this.seciliSoru = soru
    })
  }
  // Yorum ekleme bölümü.
  async yorumEkle() {
    this.cevap.soruId = this.seciliSoru.key as string;
    await this.servis.cevapOlustur(this.cevap)

    // Yenile
    this.sonuc.islem = false;
    this.cevap = new Cevap();
  }
  // Cevabın silinieceği yer.
  cevapSil(id: string) {
    this.servis.cevapSilByUID(id).then(d => {
      this.router.navigate(['/'])
    })
  }




}