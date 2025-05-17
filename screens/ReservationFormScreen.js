import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Modal,
  Alert
} from 'react-native';
import { Text, Button, HelperText } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { useNavigation } from '@react-navigation/native';

export default function ReservationFormScreen({ route }) {
  const { restaurant } = route.params;
  const navigation = useNavigation();

  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [peopleCount, setPeopleCount] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showWebModal, setShowWebModal] = useState(false);
  const [showWebErrorModal, setShowWebErrorModal] = useState(false);
  const [webErrorMessage, setWebErrorMessage] = useState('');

  const fixedTimeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:00', '18:30', '19:00', '19:30', '20:00',
  ];

  const onConfirmDate = (params) => {
    setOpenDatePicker(false);
    setDate(params.date);
  };

  const confirmReservation = () => {
    setSubmitting(true);
    const [hours, minutes] = time.split(':');
    const selectedDate = new Date(date);
    selectedDate.setHours(parseInt(hours));
    selectedDate.setMinutes(parseInt(minutes));
     selectedDate.setSeconds(0); 
     selectedDate.setMilliseconds(0); 

    setTimeout(() => {
      setSubmitting(false);
      navigation.replace('ReservationConfirmation', {
        restaurant,
        datetime: selectedDate.toISOString(),
        peopleCount,
      });
    }, 1200);
  };

  const handleSubmit = () => {
  if (!date || !time || !peopleCount) {
    if (Platform.OS === 'web') {
      setWebErrorMessage('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      setShowWebErrorModal(true);
    } else {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα πεδία.');
    }
    return;
  }

  if (Platform.OS === 'web') {
    setShowWebModal(true);
  } else {
    Alert.alert(
      'Επιβεβαίωση',
      'Είσαι σίγουρος ότι θέλεις να κάνεις αυτή την κράτηση;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { text: 'Ναι', onPress: confirmReservation },
      ]
    );
  }
};


  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Κράτηση για {restaurant.name}</Text>

        <Button mode="outlined" onPress={() => setOpenDatePicker(true)} style={styles.input}>
          {date ? date.toDateString() : 'Επιλέξτε ημερομηνία'}
        </Button>
        <DatePickerModal
          locale="el"
          mode="single"
          visible={openDatePicker}
          onDismiss={() => setOpenDatePicker(false)}
          date={date}
          onConfirm={onConfirmDate}
          validRange={{ startDate: new Date() }}
        />

        <HelperText type="info" visible={true}>Επιλέξτε ώρα:</HelperText>
        <View style={styles.timeContainer}>
          {fixedTimeSlots.map((slot) => (
            <Button
              key={slot}
              mode={time === slot ? 'contained' : 'outlined'}
              onPress={() => setTime(slot)}
              style={styles.timeButton}
              compact
            >
              {slot}
            </Button>
          ))}
        </View>

        <HelperText type="info" visible={true}>Επιλέξτε αριθμό ατόμων:</HelperText>
        <View style={styles.peopleContainer}>
          {[...Array(10)].map((_, i) => (
            <Button
              key={i}
              mode={peopleCount === i + 1 ? 'contained' : 'outlined'}
              onPress={() => setPeopleCount(i + 1)}
              style={styles.peopleButton}
              labelStyle={styles.peopleButtonLabel}
              compact
            >
              {i + 1}
            </Button>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={submitting}
          disabled={submitting}
        >
          Κράτηση
        </Button>
      </View>

      {/* ✅ Web Confirmation Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={showWebModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Επιβεβαίωση</Text>
              <Text style={styles.modalMessage}>
                Είσαι σίγουρος ότι θέλεις να κάνεις αυτή την κράτηση;
              </Text>
              <View style={styles.modalButtons}>
                <Button onPress={() => setShowWebModal(false)}>Ακύρωση</Button>
                <Button onPress={() => { setShowWebModal(false); confirmReservation(); }}>Ναι</Button>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ❌ Web Error Modal */}
      {Platform.OS === 'web' && (
        <Modal visible={showWebErrorModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Σφάλμα</Text>
              <Text style={styles.modalMessage}>{webErrorMessage}</Text>
              <View style={styles.modalButtons}>
                <Button onPress={() => setShowWebErrorModal(false)}>OK</Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    width: Platform.OS === 'web' ? 400 : '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timeButton: {
    margin: 4,
    minWidth: 60,
  },
  peopleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  peopleButton: {
    margin: 4,
    minWidth: 40,
    paddingHorizontal: 0,
  },
  peopleButtonLabel: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
