/*
fetch('/api/user/check-admin')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Nem admin jogosultság.');
    })
    .then(data => {
        if (data.isAdmin) {
            document.getElementById('adminButton').style.display = 'block';
        }
    })
    .catch(error => console.error('Hiba admin ellenőrzésekor:', error));
*/

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    console.log(res);
    if (res.ok) {
        window.location.href = '../home.html';
    } else {
        alert(JSON.stringify(res));
    }
}


//Feliratkozás a hírlevélre
document.addEventListener("DOMContentLoaded", () => {
    const newsletterButton = document.querySelector(".newsLetter");
  
    if (newsletterButton) {
      newsletterButton.addEventListener("click", feliratkozas);
    }
  });
  
  function feliratkozas() {
    const email = prompt("Kérjük, adja meg az e-mail címét a feliratkozáshoz:");
  
    if (email && validateEmail(email)) {
      alert("Köszönjük! Sikeresen feliratkozott a hírlevelünkre: " + email);
      // Esetleg elmentheted localStorage-be is:
      // localStorage.setItem('feliratkozott', email);
    } else if (email !== null) {
      alert("Helytelen e-mail cím! Próbálja újra.");
    }
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  