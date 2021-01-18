import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Soru } from 'src/app/models/soru';
import { Uye } from 'src/app/models/uye';
import { FirebaseServiceService } from 'src/app/services/firebaseService.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  uid!: string;
  adsoyad!: string;
  yeniSoru: Soru = new Soru()
  profil!: Uye;
  constructor(public servis: FirebaseServiceService, public route: Router) { }

  ngOnInit() {
    // Localstoragedaki user'ın user değerine atanması ve ona göre profilinin listelenmesi.
    let user = JSON.parse(localStorage.getItem("user")!);
    this.adsoyad = user.displayName
    this.uid = user.uid
    this.profilListele()
  }

  profilListele() {
    this.servis.profilListeleByUID(this.uid).snapshotChanges().subscribe(satirlar => {
      satirlar.forEach(satir => {
        const k = { ...satir.payload.val(), key: satir.key }
        this.profil = (k as Uye)
      })
    })
  }


}