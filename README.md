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

## Δομή Φακέλων
mobile-app/
api/client.js 
backend/routes/auth.js,reservations.js,restaurant.js 
backend/middleware/auth.js
backend/db.js,server.js
context/AuthContext 
navigation/AppNavigator outes
screens/LoginScreen.js,RegisterScreen.js,RestaurantListScreen.js,ReservationFormScreen.js,reservationConfirmationScreen.js,ProfileScreen.js
.env 
App.js 
README.md 


---

## Εκκίνηση

```bash

cd mobile-app
npm install

cd backend
node server.js

cd ..
npx expo start

---

Ρύθμιση Βάσης Δεδομένων MariaDB

mysql -u root -p

Δημιουργία βάσης δεδομένων:

CREATE DATABASE restaurant_reservation;
USE restaurant_reservation;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE restaurants (
  restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  description TEXT
);

CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  restaurant_id INT,
  date DATE,
  time TIME,
  people_count INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);


Σημειώσεις:

Χρησιμοποιήθηκε Expo Go για mobile testing

Σύνδεση με MariaDB μέσω mariadb package

Τα tokens αποθηκεύονται με AsyncStorage

Υποστηρίζονται alerts και modals για Web & Mobile

