import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Soru } from '../models/soru';
import { Uye } from '../models/uye';
import { AngularFireAuth } from '@angular/fire/auth'
import { Kategori } from '../models/kategori';
import { Cevap } from '../models/cevap';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  private dbKayit = '/Kayitlar'
  private dbUye = '/Uye'
  private dbKategori = '/Kategori'
  private dbCevap = '/Cevap'

  kayitRef: AngularFireList<Soru>
  uyeRef!: AngularFireList<Uye>
  kategoriRef!: AngularFireList<Kategori>
  cevapRef!: AngularFireList<Cevap>
  constructor(
    public db: AngularFireDatabase,
    public Auth: AngularFireAuth
  ) {
    this.kayitRef = db.list(this.dbKayit)
    this.uyeRef = db.list(this.dbUye)
    this.kategoriRef = db.list(this.dbKategori)
    this.cevapRef = db.list(this.dbCevap)
  }

  // KAYITLAR

  // localstoragedan çekilen user'ın  değeri.
  get suankiKullanici() {
    return JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  }
  // kayitRef değerinin bulunduğu path'e göre kayıtların çekildiği yer.
  soruListele() {
    return this.kayitRef
  }
  // Üye ID'sine göre çekilir. Kullanıcının sorularını yansıtmak için.
  soruListeleByUID(uid: string) {
    return this.db.list("/Kayitlar", q => q.orderByChild("uid").equalTo(uid))
  }
  // Detay bölümünde kullanılacak soru/cevap/Soru sahibinin servisi.
  soruListeleByKey(key: string) {
    return this.db.object<Soru>("/Kayitlar/" + key).snapshotChanges().pipe(
      map((change) => {
        const soru: Soru = { key: change.key as string, ...change.payload.val()! };

        // Sorunun Sahibi
        this.db.list<Uye>(this.dbUye, ref => ref.orderByChild('uid').equalTo(soru.uid)).snapshotChanges().pipe(
          map(changes => {
            const change = changes[0];
            return { key: change.key, ...change.payload.val() } as Uye;
          })
        )
          .subscribe(uye => soru.uye = uye)

        // Sorunun Yorumlarını
        this.db.list<Cevap>(this.dbCevap, ref => ref.orderByChild('soruId').equalTo(soru.key as string)).snapshotChanges().pipe(
          map(changes => {
            return changes.map(change => {
              const cevap = { key: change.key, ...change.payload.val() } as Cevap;

              //// Sorunun Yorumlarının Sahipleri
              this.db.list<Uye>(this.dbUye, ref => ref.orderByChild('uid').equalTo(cevap.uid as string)).snapshotChanges().pipe(
                map(changes => {
                  const change = changes[0];
                  return { key: change.key, ...change.payload.val() } as Uye;
                })
              )
                .subscribe(uye => cevap.uye = uye)
              return cevap;
            })
          })
        )
          .subscribe(cevaplar => soru.cevaplar = cevaplar)
        return soru
      })
    )
  }

  // Sorunun ekleneceği yer.  
  soruEkle(kayit: Soru) {
    return this.kayitRef.push(kayit)
  }
  // Sorunun düzenlendiği yer.
  soruDuzenle(kayit: Soru) {
    return this.kayitRef.update(kayit.key as string, kayit)
  }
  // Sorunun silindiği yer.
  soruSil(key: string) {
    return this.kayitRef.remove(key)
  }
  // Üye ID'sine göre silinecek soru.
  soruSilByUID(id: string) {
    return this.db.object<Soru>(this.dbKayit + "/" + id).remove()
  }

  // UYE
  // Giriş
  signIn(mail: string, password: string) {
    return this.Auth.signInWithEmailAndPassword(mail, password)
  }
  //Kayıt
  signUp(uye: Uye) {
    return this.Auth.createUserWithEmailAndPassword(uye.mail, uye.parola)
  }
  // Kullanıcı Realtime database yapılan kayıt.
  addAccount(uye: Uye) {
    return this.uyeRef.push(uye)
  }
  // Auth üzerinden çıkış yapma.
  signOut() {
    return this.Auth.signOut()
  }
  // Kullanıcı güncelleme.
  updateProfile(uye: Uye) {
    return this.uyeRef.update(uye.key, uye)
  }
  // localstorage'daki oturum açık olup olmadığı butonların aktifleşmesi için kullanılan servis.
  oturumCheck() {
    if (localStorage.getItem("user")) {
      return true
    } else {
      return false
    }
  }
  // Üye ID'sine göre profi listleme.
  profilListeleByUID(uid: string) {
    return this.db.list<Uye>("/Uye", q => q.orderByChild("uid").equalTo(uid))
  }


  // Cevaplar

  cevapOlustur(cevap: Cevap) {
    cevap.uid = this.suankiKullanici.uid;
    return this.db.list<Cevap>(this.dbCevap).push(cevap).get();
  }
  // Cevapların düzenlendiği yer.
  cevapDuzenle(cevap: Cevap) {
    return this.cevapRef.update(cevap.key as string, cevap)
  }
  // Cevabın silindiği yer.
  cevapSil(key: string) {
    return this.cevapRef.remove(key)
  }
  // Cevabın ÜYE ID'sine göre silindği yer.
  cevapSilByUID(id: string) {
    return this.db.object<Cevap>(this.dbCevap + "/" + id).remove()
  }
  // Key'e göre cevap listelemek.
  cevapListeleByKey(key: string) {
    this.db.list<Cevap>(this.dbCevap).snapshotChanges().pipe(
      map(changes => {
        return changes.map(change => {
          const cevap = { key: change.key, ...change.payload.val() } as Cevap
        })
      })
    )
  }



}
