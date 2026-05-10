document.addEventListener("DOMContentLoaded", () => {
    let users = []
    
    const title = document.getElementById("title")
    const form = document.getElementById("loginForm")
    const loginInput = document.getElementById("login")
    const passwordInput = document.getElementById("password")
    const result = document.getElementById("result")
    const button = document.getElementById("loginButton")
    const validId = Math.floor(Math.random() * 10) + 1
    
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(data => {
            users = data
        })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const login = loginInput.value.trim()
        const password = passwordInput.value.trim()

        const allowedUser = users.find(user =>
            user.id === validId &&
            user.username === login &&
            user.email === password
        )

        button.classList.add("clicked")
        setTimeout(() => button.classList.remove("clicked"), 500)

        if (allowedUser) {
            form.classList.add("hide")
            title.innerText = `🔓 Cyber Login`
            result.innerText = `Zalogowano!\nWitaj, ${allowedUser.name}\nMiasto: ${allowedUser.address.city}`
        } else {
            result.innerText = "Niepoprawny login lub hasło."
            form.classList.add("shake")
            setTimeout(() => form.classList.remove("shake"), 400)
        }

        loginInput.value = ""
        passwordInput.value = ""
    });
})
