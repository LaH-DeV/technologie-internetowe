
class Pracownik {
    constructor(imie, nazwisko, nrDzialu, pokoj, dataUrodzenia) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.nrDzialu = nrDzialu;
        this.pokoj = pokoj;
        this.dataUrodzenia = new Date(dataUrodzenia);
    }

    przedstawSie() {
        return `${this.imie} ${this.nazwisko}`;
    }

    wyswietlWiek() {
        const today = new Date();
        let age = today.getFullYear() - this.dataUrodzenia.getFullYear();
        const m = today.getMonth() - this.dataUrodzenia.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < this.dataUrodzenia.getDate())) {
            age--;
        }
        return age;
    }

    wyplacPremie() {
        return `Premia została przypisana pracownikowi ${this.przedstawSie()}.`;
    }
}
const pracownik = new Pracownik("Jan", "Kowalski", 3, 105, "1990-05-15");
console.log(`Imię i nazwisko: ${pracownik.przedstawSie()}, Wiek: ${pracownik.wyswietlWiek()} lat`);
console.log(`Dział: ${pracownik.nrDzialu}`);
pracownik.pokoj = 101;
pracownik.miejsceUrodzenia = "Warszawa";
delete pracownik.dataUrodzenia;
console.log(`Data urodzenia: ${pracownik.dataUrodzenia}`); // undefined
console.log(pracownik.wyplacPremie());
