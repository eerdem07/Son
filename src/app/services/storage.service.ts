import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dosya } from 'src/app/models/dosya';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  basePath = "/Dosyalar"
  constructor(
    public storage: AngularFireStorage,
    public db: AngularFireDatabase
  ) { }

  dosyaEkle(dosya: Dosya) {
    const dosyaPath = this.basePath + "/" + dosya.file.name
    const storageRef = this.storage.ref(dosyaPath)
    const yukleTask = this.storage.upload(dosyaPath, dosya.file)
    yukleTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          dosya.url = downloadURL
          dosya.adi = dosya.file.name
          // dosya.tarih = tarih.gettime().tostring()
          this.dosyaGoster(dosya)
        })
      })
    ).subscribe()
    return yukleTask.percentageChanges()
  }

  dosyaGoster(dosya: Dosya) {
    this.db.list(this.basePath).push(dosya)
  }

  dosyaListele() {
    return this.db.list(this.basePath)
  }

  dosyaSil(dosya: Dosya) {
    this.dosyaVerilSil(dosya).then(() => {
      this.dosyaStorageSil(dosya)
    })
  }

  // Firebase Storage Repositorymizden gönderilen dosyanın silineceği bölümdür.
  dosyaStorageSil(dosya: Dosya) {
    const storageRef = this.storage.ref(this.basePath)
    storageRef.child(dosya.adi).delete()
  }

  // Realtime Database Üzerinden verinin siliniceği bölümdür.
  dosyaVerilSil(dosya: Dosya) {
    return this.db.list(this.basePath).remove(dosya.key)
  }
}
