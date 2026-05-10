class Student {
  constructor(imie, nazwisko) {
    this.imie = imie;
    this.nazwisko = nazwisko;
    this.oceny = {};
  }

  dodajOcene(przedmiot, ocena) {
    if (!this.oceny[przedmiot]) {
      this.oceny[przedmiot] = [];
    }
    this.oceny[przedmiot].push(ocena);
  }

  zmienKurs(kurs) {
    this.kurs = kurs;
  }

  zmienGrupe(grupa) {
    this.grupa = grupa;
  }

  getOceny(przedmiot) {
    return przedmiot ? this.oceny[przedmiot] || [] : Object.values(this.oceny).flat();
  }

  ileNiezaliczonych(przedmiot) {
    const oceny = przedmiot ? this.oceny[przedmiot] || [] : Object.values(this.oceny).flat();
    return oceny.filter(ocena => ocena === 2).length;
  }

  getGrupa() {
    return this.grupa || "Brak grupy";
  }

  getKurs() {
    return this.kurs || "Brak kursu";
  }
}
const student = new Student("Adam", "Nowak");
[3, 3, 2, 5].forEach(ocena => student.dodajOcene("CSS", ocena));
[5, 4, 4, 2].forEach(ocena => student.dodajOcene("HTML", ocena));
[5, 5, 5].forEach(ocena => student.dodajOcene("JavaScript", ocena));
[5, 4, 5].forEach(ocena => student.dodajOcene("jQuery", ocena));
student.oceny["CSS"] = student.oceny["CSS"].map(ocena => ocena === 2 ? 4 : ocena);
student.dodajOcene("jQuery", 3);
student.dodajOcene("HTML", 5);
const srednia = (oceny) => oceny.reduce((a, b) => a + b, 0) / oceny.length;
Object.keys(student.oceny).forEach(przedmiot => {
  console.log(`Średnia ocen z ${przedmiot}: ${srednia(student.getOceny(przedmiot)).toFixed(2)}`);
});
console.log(`Średnia ocen studenta ${student.imie} ${student.nazwisko}: ${srednia(student.getOceny()).toFixed(2)}`);
const niezaliczone = Object.keys(student.oceny).filter(przedmiot => student.ileNiezaliczonych(przedmiot) > 0);
console.log(`Przedmioty z niezaliczonym egzaminem: ${niezaliczone.length > 0 ? niezaliczone.join(", ") : "Brak"}`);