# Restaurant Reservation App

> Mobile frontend app for managing restaurant reservations – built with **React Native & Expo**.

---

## Στόχος

Ανάπτυξη του Frontend μέρους μιας εφαρμογής κρατήσεων εστιατορίων με έμφαση σε:

-  Διαχείριση κατάστασης (Context API)
-  Επικοινωνία με backend (axios & JWT)
-  Τοπική αποθήκευση token (AsyncStorage)
-  Προστατευμένες οθόνες βάσει authentication

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
├── api/                  # axios instance με interceptor για JWT
│   └── client.js
├── context/              # authentication state & λογική login/logout
│   └── AuthContext.js
├── navigation/           # προστατευμένες και δημόσιες διαδρομές
│   └── AppNavigator.js
├── screens/              # βασικές οθόνες της εφαρμογής
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── RestaurantListScreen.js
│   ├── ReservationFormScreen.js
│   └── ProfileScreen.js
├── App.js                # αρχικό σημείο εκκίνησης εφαρμογής
└── README.md             # οδηγίες χρήσης και εκκίνησης

---

## 🚀 Εκκίνηση

```bash
npx create-expo-app mobile-app
cd mobile-app

npm install axios @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

npx expo start

