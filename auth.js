let users = JSON.parse(localStorage.getItem("users")) || [];

/* Create Default Admin (Only Once) */
if (!users.find(u => u.role === "admin")) {
    users.push({
        username: "admin",
        password: "admin123",
        role: "admin",
        history: [],
        playlist: []
    });
    localStorage.setItem("users", JSON.stringify(users));
}

/* LOGIN */
function login(){

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    const foundUser = users.find(user =>
        user.username === username && user.password === password
    );

    if(!foundUser){
        errorMsg.innerText = "Invalid credentials";
        return;
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    window.location.href = "index.html";
}

/* REGISTER */
function register(){

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if(username === "" || password.length < 4){
        errorMsg.innerText = "Enter valid username & password (min 4 chars)";
        return;
    }

    if(users.find(u => u.username === username)){
        errorMsg.innerText = "Username already exists";
        return;
    }

    users.push({
        username,
        password,
        role: "user",
        history: [],
        playlist: []
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
}