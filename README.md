# Restaurant Reservation App

> Mobile-first εφαρμογή για κρατήσεις σε εστιατόρια, με React Native + Express + MariaDB.

---

## Δυνατότητες

- Δημιουργία λογαριασμού και login με JWT authentication  
- Προβολή λίστας εστιατορίων  
- Κράτηση τραπεζιού με επιλογή ώρας & ημερομηνίας  
- Δυνατότητα προβολής και διαγραφής κρατήσεων από το προφίλ  
- Υποστήριξη Web & Mobile μέσω Expo  
- Προστατευμένες διαδρομές με Context API  
- Σύνδεση με βάση δεδομένων MariaDB  

---

## Τεχνολογίες

- **React Native**
- **Expo**
- **Axios**
- **React Navigation**
- **AsyncStorage**
- **Context API**

---

## 📂 Δομή Φακέλων
mobile-app/
├── api/ # axios instance με JWT interceptor
│ └── client.js
├── backend/ # Express server & routes
│ ├── routes/
│ ├── middleware/
│ ├── db.js # MariaDB pool config
│ └── server.js
├── context/ # AuthContext για login/logout state
├── navigation/ # AppNavigator για routes
├── screens/ # Οθόνες εφαρμογής
│ ├── LoginScreen.js
│ ├── RegisterScreen.js
│ ├── RestaurantListScreen.js
│ ├── ReservationFormScreen.js
│ ├── ReservationConfirmationScreen.js
│ └── ProfileScreen.js
├── styles/ # Custom styling ανά οθόνη
├── .env # μεταβλητές περιβάλλοντος (DB credentials κ.λπ.)
├── App.js # Entry point της εφαρμογής
└── README.md # Τρέχον αρχείο οδηγιών

yaml
Αντιγραφή
Επεξεργασία

---

## 🚀 Εκκίνηση

```bash

cd mobile-app
npm install

cd backend
node server.js

cd ..
npx expo start

---

Σημειώσεις:

Χρησιμοποιήθηκε Expo Go για mobile testing

Σύνδεση με MariaDB μέσω mariadb package

Τα tokens αποθηκεύονται με AsyncStorage

Υποστηρίζονται alerts και modals για Web & Mobile

