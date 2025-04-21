# 🌊 DailyWave – Vizsgamunka Frontend Dokumentáció

👨‍💻 **Készítette:**  
- Schilling János Attila  
- Szabó Balázs  

🗓️ **Projekt típusa:** Szoftverfejlesztő vizsgamunka  
🎯 **Téma:** Hírportál rendszer saját fórumrendszerrel és admin kezeléssel  
🌐 **Frontend nyelvek:** HTML, CSS, JavaScript  
🔗 **Backend REST API URL:** `https://nodejs.dszcbaross.edu.hu/server/7b76faf3`

---

## 📁 Fájlstruktúra

### 🧾 HTML Oldalak
- `home.html` – Főoldal (összes hír listázása)
- `login.html` – Bejelentkezés
- `registartion.html` – Regisztráció
- `addnews.html` – Új hír feltöltése (admin)
- `newsdetail.html` – Hír részletes megtekintése
- `forum.html` – Fórum bejelentkezett felhasználóknak
- `forumnotlogin.html` – Fórum vendégként
- `profile.html` – Felhasználói profil
- `nameedit.html` – Profilnév módosítása
- `pswedit.html` – Jelszó módosítása
- `picedit.html` – Profilkép szerkesztés

### 🎨 CSS Fájlok
- `home.css`, `login.css`, `registartion.css`
- `addnews.css`, `newsdetails.css`
- `forum.css`, `forumnotlogin.css`
- `profile.css`, `adminprofile.css`, `nameedit.css`, `pswedit.css`, `picedit.css`

### ⚙️ JavaScript Fájlok
- `home.js` – Hírek megjelenítése
- `login.js` – Bejelentkezési folyamat
- `registartion.js` – Regisztrációs logika
- `addnews.js` – Hírfeltöltés admin által
- `newsdetail.js` – Egyedi hír betöltése
- `forum.js` – Fórum topikok és hozzászólások kezelése
- `profile.js` – Profil adatainak betöltése
- `profileName.js` – Név módosítása
- `pswedit.js` – Jelszó szerkesztés
- `picedit.js` – Profilkép frissítése

---

## 💡 Funkciók

- ✅ **Regisztráció & Bejelentkezés**
- 📰 **Hírek böngészése és megtekintése**
- ✍️ **Hírek hozzáadása (admin joggal)**
- 💬 **Saját fórum rendszer**
- 👤 **Felhasználói profil szerkesztése**
- 📷 **Profilkép feltöltése**
- 🔒 **Jelszó módosítás**

---

## 📦 Technológiai stack

| Rész | Technológia |
|------|-------------|
| 🔧 Alap | HTML5, CSS3, JavaScript |
| 🔁 Kommunikáció | Fetch API (REST API hívások) |
| 🎨 Stílus | Egyedi CSS, reszponzív elrendezés |
| 🔐 Biztonság | Token (JWT) alapú hitelesítés, bcrypt a backend oldalon |
| 🌍 Backend | Node.js + Express REST API *(külön projekt)* |

---

## 🔗 Backend API kommunikáció

A frontend `fetch()` használatával éri el a backend végpontokat:

```js
fetch('https://nodejs.dszcbaross.edu.hu/server/7b76faf3/api/news/getAllNews')
  .then(res => res.json())
  .then(data => megjelenites(data));
```

🔐 **A kérés során szükség esetén automatikusan csatolódik a token (cookie alapú autentikáció).**

---

## 🚀 Indítás

1. Nyisd meg a projekt mappában a `home.html` fájlt böngészőben  
2. ✅ **Használatra kész** – automatikusan csatlakozik a backendhez  
3. 🛠️ *Nem igényel külön frontend szerver beállítást*

---

## 🧪 Tesztelés

✔️ Ellenőrzött funkciók:

- [x] **Regisztrációs és bejelentkezési folyamat**
- [x] **Jogosultság nélküli hozzáféréskor megfelelő tiltás**
- [x] **Profiladatok szerkesztése működik**
- [x] **Fórum topik létrehozás és hozzászólás**
- [x] **Admin-only felület rejtése nem admin számára**
- [x] **Mobil nézet / reszponzivitás**

---

## 🧰 Használt fejlesztői eszközök

- 📝 **Visual Studio Code**
- 🌐 **Live Server** *(VS Code plugin)*
- 📬 **Postman** *(API teszteléshez)*
- 🔍 **Chrome DevTools**
- 🧠 **ChatGPT** *(dokumentáció, ötletek)*
- 🧭 **DrawSQL** *(adatbázis-terv)*
- 🐙 **GitHub** *(verziókezelés)*

---

## 🏁 Összegzés

Ez a projekt egy **teljesen működőképes frontend felületet biztosít** egy híroldal rendszerhez, amely képes a felhasználók kezelésére, tartalom létrehozására és fórumozásra is.  
A backendgel való **szoros integráció**, valamint a **külön adminfunkciók** révén **alkalmas vizsgamunkának vagy portfólió bemutatónak is**.

---

📩 **Kérdésed van?**  
Írj bátran a készítőkhöz, vagy nézd meg a backend README-jét is a teljes rendszeráttekintéshez!
