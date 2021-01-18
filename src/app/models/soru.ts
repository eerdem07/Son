import { Cevap } from "./cevap";
import { Uye } from "./uye";

export class Soru {
    key?: string;
    soruAd: string = '';
    soru: string = '';
    uid: string = '';
    kayTarih: string = '';
    duzTarih: string = '';
    uye?: Uye;
    cevaplar?: Cevap[];
}