class StudentCDV {
  constructor(name, surname, age, gender, birthDate, course, group, login) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.gender = gender;
    this.birthDate = birthDate;
    this.course = course;
    this.group = group;
    this.login = login;
    this.grades = {};
  }

  newGrade(subject, grade) {
    if (!this.grades[subject]) this.grades[subject] = [];
    this.grades[subject].push(grade);
  }

  averageGrade(subject) {
    if (subject) {
      const grades = this.grades[subject] || [];
      return grades.reduce((a, b) => a + b, 0) / grades.length || 0;
    } else {
      const allGrades = Object.values(this.grades).flat();
      return allGrades.reduce((a, b) => a + b, 0) / allGrades.length || 0;
    }
  }

  failedExams(subject) {
    if (subject) {
      return (this.grades[subject] || []).filter(g => g === 2).length;
    }
    return Object.values(this.grades).flat().filter(g => g === 2).length;
  }
}

const students = [
  new StudentCDV("Anna", "Kowalska", 22, "K", new Date(2002, 5, 15), "Data Science", 1, "akowalska"),
  new StudentCDV("Piotr", "Nowak", 24, "M", new Date(2000, 8, 20), "Data Science", 2, "pnowak"),
  new StudentCDV("Ewa", "Wiśniewska", 23, "K", new Date(2001, 11, 10), "Data Science", 1, "ewawisniewska"),
  new StudentCDV("Marek", "Zieliński", 21, "M", new Date(2003, 2, 5), "Data Science", 2, "mzielinski"),
  new StudentCDV("Katarzyna", "Lewandowska", 22, "K", new Date(2002, 7, 25), "Data Science", 1, "klewandowska"),
  new StudentCDV("Tomasz", "Kaczmarek", 24, "M", new Date(2000, 10, 30), "Data Science", 2, "tkaczmarek"),
  new StudentCDV("Monika", "Szymańska", 21, "K", new Date(2003, 1, 12), "Data Science", 1, "mszymanska"),
  new StudentCDV("Łukasz", "Wójcik", 23, "M", new Date(2001, 9, 18), "Data Science", 2, "lwojcik"),
  new StudentCDV("Agnieszka", "Kowalczyk", 22, "K", new Date(2002, 4, 8), "Data Science", 1, "akowalczyk"),
  new StudentCDV("Grzegorz", "Kamiński", 24, "M", new Date(2000, 6, 22), "Data Science", 2, "gkaminski"),
  new StudentCDV("Joanna", "Dąbrowska", 21, "K", new Date(2003, 0, 30), "Data Science", 1, "jdabrowska"),
  new StudentCDV("Adam", "Kowalski", 23, "M", new Date(2001, 3, 14), "Data Science", 2, "akowalski"),
];

console.log(`Liczba studentek: ${students.filter(s => s.gender === "K").length}`);

const youngest = students.reduce((y, s) => (s.age < y.age ? s : y), students[0]);
console.log(`Najmłodszy student: ${youngest.name} ${youngest.surname}`);

const subjects = ["HTML", "CSS", "JavaScript", "jQuery"];
students.forEach(student => {
  subjects.forEach(subject => {
    for (let i = 0; i < 6; i++) student.newGrade(subject, Math.floor(Math.random() * 5) + 2); // 2 - 6
  });
});

console.log(`Liczba studentów bez oblanego egzaminu z HTML: ${students.filter(s => s.failedExams("HTML") === 0).length}`);

const bestInGroup1 = students.filter(s => s.group === 1).reduce((best, s) => (s.averageGrade() > best.averageGrade() ? s : best), students[0]);
console.log(`Najlepszy student z grupy 1: ${bestInGroup1.name} ${bestInGroup1.surname}`);

const worstSubject = subjects.reduce((worst, subject) => {
  const avg = students.reduce((sum, s) => sum + s.averageGrade(subject), 0) / students.length;
  return avg < worst.avg ? { subject, avg } : worst;
}, { subject: null, avg: Infinity });
console.log(`Przedmiot z najgorszymi ocenami: ${worstSubject.subject}`);