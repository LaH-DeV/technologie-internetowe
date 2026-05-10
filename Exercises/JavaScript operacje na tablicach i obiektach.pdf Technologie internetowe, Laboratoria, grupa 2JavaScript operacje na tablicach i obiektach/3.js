class Pracownik {
  constructor(imie, nazwisko, pensja, dataZatrudnienia = new Date(), dataWygaśnięciaUmowy = null) {
    this.imie = imie;
    this.nazwisko = nazwisko;
    this.pensja = pensja;
    this.dataZatrudnienia = dataZatrudnienia;
    this.dataWygaśnięciaUmowy = dataWygaśnięciaUmowy;
    this.dataZwolnienia = null;
  }

  ZmienPensje(nowaPensja) {
    this.pensja = nowaPensja;
  }

  Zwolnij(dataZwolnienia = new Date()) {
    this.dataZwolnienia = dataZwolnienia;
  }

  PrzedluzUmoweDo(nowaDataWygaśnięcia) {
    this.dataWygaśnięciaUmowy = nowaDataWygaśnięcia;
  }
}

const jan = new Pracownik('Jan', 'Kowalski', 6000, new Date('2020-01-01'));
const anna = new Pracownik('Anna', 'Lewandowska', 8000, new Date('2019-05-04'));
const wincenty = new Pracownik('Wincenty', 'Pazdan', 4000, new Date('2020-04-05'), new Date('2021-04-05'));

console.log(`Pan Wincenty zarabia: ${wincenty.pensja} zł`);

const DZIEN_MS = 1000 * 60 * 60 * 24;
const czasPracyPanaJana = Math.floor((new Date().getTime() - jan.dataZatrudnienia.getTime()) / DZIEN_MS);
console.log(`Pan Jan pracuje od: ${czasPracyPanaJana} dni`);

const lacznaPensja = jan.pensja + anna.pensja + wincenty.pensja;
console.log(`Łączna pensja wszystkich pracowników: ${lacznaPensja} zł`);

wincenty.PrzedluzUmoweDo(new Date('2022-12-31'));
anna.ZmienPensje(anna.pensja + 2000);
jan.Zwolnij();
