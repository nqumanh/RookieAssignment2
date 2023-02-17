$("input").on("input", function () {
    var disableLogin = $('#inputUsername').val().length * $('#inputPassword').val().length > 0;
    $('button[type="submit"]').prop('disabled', !disableLogin);
}) 

function HandleShowPassword() {
    const inputPassword =
        event.target.parentNode.querySelector("#inputPassword");
    const type =
        inputPassword.getAttribute("type") === "password"
            ? "text"
            : "password";
    inputPassword.setAttribute("type", type);

    event.target.classList.toggle("bi-eye-slash-fill");
}


const btnLogin = document.querySelector('.btn-login');
btnLogin.addEventListener('click', (e) => {
    e.currentTarget.classList.add('is-loading')
})