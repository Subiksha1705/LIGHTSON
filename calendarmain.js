import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const CalendarMain = () => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonthDefault = today.slice(0, 7);

  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchMonth, setSearchMonth] = useState(currentMonthDefault.split('-')[1]); // Default to current month
  const [searchYear, setSearchYear] = useState(new Date().getFullYear().toString());
  const [calendarKey, setCalendarKey] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(currentMonthDefault);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // API URL (Adjust if needed)
  const API_URL = 'http://192.168.29.21:5000/api/transactions';

  // Fetch transactions from MongoDB
  const fetchTransactions = useCallback(async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(selectedDate);
  }, [selectedDate, fetchTransactions]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate('DateExpenses', { selectedDate: day.dateString });
  };

  const handleSearch = () => {
    if (searchYear && searchMonth) {
      const newMonth = `${searchYear}-${searchMonth.padStart(2, '0')}`;
      setCurrentMonth(newMonth);
      setCalendarKey((prevKey) => prevKey + 1);
    }
  };

  const resetToCurrentDate = () => {
    setSelectedDate(today);
    setCurrentMonth(currentMonthDefault);
    setCalendarKey((prevKey) => prevKey + 1);
  };

  const getMarkedDates = useMemo(() => {
    return { [selectedDate]: { selected: true, selectedColor: 'blue' } };
  }, [selectedDate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inlineRow}>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={searchMonth} onValueChange={setSearchMonth} style={styles.picker}>
              <Picker.Item label="Month" value="00" />
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month, index) => (
                <Picker.Item key={month} label={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]} value={month} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={searchYear} onValueChange={setSearchYear} style={styles.picker}>
              <Picker.Item label="Year" value={new Date().getFullYear().toString()} />
              {Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() + i).toString()).map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetToCurrentDate} style={styles.resetButton}>
            <Text style={styles.buttonText}>Today</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        key={calendarKey}
        current={currentMonth}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates}
        monthFormat={'MMMM yyyy'}
        hideExtraDays
        enableSwipeMonths
        theme={{
          arrowColor: 'black',
          todayTextColor: '#007AFF',
          textMonthFontWeight: 'bold',
          selectedDayBackgroundColor: '#B3E5FC',
          textDayHeaderFontWeight: '600',
        }}
      />

      <View style={styles.transactionContainer}>
        <Text style={styles.transactionTitle}>Transactions for {selectedDate}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : transactions.length === 0 ? (
          <Text style={styles.noTransactions}>No transactions available</Text>
        ) : (
          transactions.map((item, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text>{item.category}: ₹{item.amount}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: { padding: 10 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  picker: { height: 50, width: '100%' },
  searchButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 10, alignItems: 'center' },
  resetButton: { backgroundColor: '#00A86B', padding: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  transactionContainer: { padding: 10, marginTop: 10 },
  transactionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  noTransactions: { color: 'gray', textAlign: 'center', marginTop: 5 },
  transactionItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});

export default CalendarMain;
