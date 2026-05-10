window.addEventListener('load', () => {
  const toastContainer = document.createElement("div")
  toastContainer.id = "toast-container"
  const cssText = 'position: fixed; bottom: 10px; right: 10px; z-index: 9999;display: flex; flex-direction: column; align-items: flex-end; gap: 10px;'
  toastContainer.setAttribute('style', cssText)
  document.body.appendChild(toastContainer)
  PobierzDane()
})

async function PobierzDane() {
  try {
    const response = await fetch("http://api.nbp.pl/api/exchangerates/tables/A/")
    if (!response.ok) {
      alert(response.status === 404 ? "Kursy walut nieodnalezione" : "Nie można pobrać kursów walut - błąd serwera")
      return
    }
    const data = await response.json()
    uzupelnijDateAktualizacji(data[0].effectiveDate)
    data[0].rates.forEach((waluta) => {
      dodajNowyKursDoTabeli(waluta)
    })
  } catch (error) {
    alert("Brak połączenia")
    console.error(error)
  }
}

function uzupelnijDateAktualizacji(dataAktualizacji) {
  document.getElementById("dataaktualizacji").textContent = `Data aktualizacji: ${dataAktualizacji}`
}

function dodajNowyKursDoTabeli(daneWaluty) {
  const wierszeTabeli = document.getElementById("wierszetabeli")
  const aktualnaLiczbaWierszy = wierszeTabeli.rows.length + 1

  const nowyWiersz = wierszeTabeli.insertRow(wierszeTabeli.rows.length)
  const kolumnaLp = nowyWiersz.insertCell(0)
  const kolumnaNazwa = nowyWiersz.insertCell(1)
  const kolumnaKod = nowyWiersz.insertCell(2)
  const kolumnaKurs = nowyWiersz.insertCell(3)
  kolumnaLp.textContent = aktualnaLiczbaWierszy
  kolumnaNazwa.textContent = daneWaluty.currency
  kolumnaKod.textContent = daneWaluty.code
  kolumnaKurs.textContent = daneWaluty.mid
}

function odswiezDaneWTabeli() {
  resetujDane()
  PobierzDane().then(() => {
    handleToast("Dane zostały odświeżone")
  })
}

function resetujDane() {
  document.getElementById("dataaktualizacji").textContent = "Brak danych"
  $('#tabelaKursow tbody').html('')
}

function handleToast(message) {
  const toast = document.createElement("div")
  toast.textContent = message
  toast.style.backgroundColor = "green"
  toast.style.color = "white"
  toast.style.padding = "10px"
  toast.style.borderRadius = "5px"
  document.getElementById("toast-container").appendChild(toast)
  setTimeout(() => {
    toast.remove()
  }, 3000)
}