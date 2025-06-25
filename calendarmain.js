import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
const API_URL = process.env.REACT_APP_API_URL;

const CalendarMain = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions(); // ✅ Dynamic Dimensions
  const today = new Date().toISOString().split('T')[0];
  const currentMonthDefault = today.slice(0, 7);
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(today);
  const [searchMonth, setSearchMonth] = useState(currentMonthDefault.split('-')[1]);
  const [searchYear, setSearchYear] = useState(new Date().getFullYear().toString());
  const [calendarKey, setCalendarKey] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(currentMonthDefault);
  const [transactions, setTransactions] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const formatData = (transactions) => {
    const categories = {};

    transactions.forEach((transaction) => {
      const key = transaction.subType || 'Unspecified';

      if (categories[key]) {
        categories[key] += transaction.amount;
      } else {
        categories[key] = transaction.amount;
      }
    });

    const formattedData = Object.keys(categories).map((key) => ({
      name: key,
      amount: categories[key],
      color: getColorForSubType(key),
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));

    return formattedData.length > 0
      ? formattedData
      : [
          {
            name: 'No Data',
            amount: 1,
            color: '#ccc',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          },
        ];
  };


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (!userInfo) {
          alert('User not logged in. Please log in again.');
          return;
        }

        const parsedInfo = JSON.parse(userInfo);
        const username = parsedInfo?.user?.username || parsedInfo?.user?.userName;

        const response = await fetch(`${API_URL}/transactions/${username}`);
        const text = await response.text();
        const data = JSON.parse(text);

        const transactionsArray = data.transactions || [];

        if (!Array.isArray(transactionsArray)) {
          console.warn('⚠️ Transactions data is not an array. Setting empty transactions.');
          setTransactions([]);
          return;
        }

        const filteredData = transactionsArray.filter((item) =>
          item.date.startsWith(`${searchYear}-${searchMonth}`)
        );

        setTransactions(filteredData);
        setExpenseData(formatData(filteredData.filter((item) => item.type === 'Expense')));
        setIncomeData(formatData(filteredData.filter((item) => item.type === 'Income'), true));
        setMarkedDates(generateMarkedDates(filteredData));
      } catch (error) {
        console.error('❌ Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [searchMonth, searchYear]);

  const subTypeColors = {
    Active: '#4CAF50',
    Passive: '#FF9800',
    Mandatory: '#F44336',
    Discretionary: '#3F51B5',
    Entertainment: '#9C27B0',
    Utilities: '#2196F3',
    Groceries: '#FFEB3B',
    Health: '#E91E63',
    Transportation: '#00BCD4',
    Miscellaneous: '#795548',
    Unspecified: '#607D8B',
  };

  const getColorForSubType = (subType) => {
    if (subTypeColors[subType]) {
      return subTypeColors[subType];
    } else {
      const randomColor = getRandomColor();
      subTypeColors[subType] = randomColor;
      return randomColor;
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

  const generateMarkedDates = (transactions) => {
    let marked = {};

    transactions.forEach((item) => {
      const { date, type, amount } = item;
      if (!marked[date]) marked[date] = { income: 0, investment: 0, expense: 0 };

      if (type === 'Income') marked[date].income += amount;
      else if (type === 'Investment') marked[date].investment += amount;
      else if (type === 'Expense') marked[date].expense += amount;
    });

    let finalMarked = {};
    Object.keys(marked).forEach((date) => {
      const { income, investment, expense } = marked[date];
      let maxCategory = 'black';

      if (income > investment && income > expense) maxCategory = 'green';
      else if (investment > income && investment > expense) maxCategory = 'blue';
      else if (expense > income && expense > investment) maxCategory = 'red';

      finalMarked[date] = { selected: true, selectedColor: maxCategory };
    });

    return finalMarked;
  };

  const getMonthName = (monthNum) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[parseInt(monthNum, 10) - 1];
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.searchContainer}>
    {/* Month and Year Pickers in one line */}
    <View style={styles.pickerRow}>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={searchMonth}
          onValueChange={(itemValue) => setSearchMonth(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
            <Picker.Item key={month} label={getMonthName(month)} value={month} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={searchYear}
          onValueChange={(itemValue) => setSearchYear(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - 5 + i).toString()).map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
    </View>

    {/* Search and Today Buttons on the next line */}
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetToCurrentDate} style={styles.resetButton}>
        <Text style={styles.buttonText}>Today</Text>
      </TouchableOpacity>
    </View>
  </View>
</ScrollView>



          <Calendar
            key={calendarKey}
            current={currentMonth}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            monthFormat={'MMMM yyyy'}
            hideExtraDays
            enableSwipeMonths
          />

          <View style={styles.inlineRow}>
            <TouchableOpacity style={styles.incomeButton} onPress={() => navigation.navigate('Income')}>
              <Text style={styles.buttonText}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.investmentButton} onPress={() => navigation.navigate('Investment')}>
              <Text style={styles.buttonText}>Investment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expenseButton} onPress={() => navigation.navigate('Expenses')}>
              <Text style={styles.buttonText}>Expenses</Text>
            </TouchableOpacity>
          </View>

          <Swiper style={{ height: screenHeight * 0.35 }} showsPagination={true}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Expense Breakdown</Text>
              <PieChart
                data={expenseData}
                width={screenWidth * 0.9}
                height={screenHeight * 0.25}
                chartConfig={{
                  backgroundColor: '#f5f5f5',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(34, 193, 195, ${opacity})`, // Cyan color for a modern look
                  strokeWidth: 2, 
                  barPercentage: 0.7,
                }}
                
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="5"
                absolute
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Income Breakdown</Text>
              <PieChart
                data={incomeData}
                width={screenWidth * 0.9}
                height={screenHeight * 0.25}
                chartConfig={{
                  backgroundColor: '#f5f5f5',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(34, 193, 195, ${opacity})`, // Cyan color for a modern look
                  strokeWidth: 2, 
                  barPercentage: 0.7,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="5"
                absolute
              />
            </View>
          </Swiper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#F5F5F5', // Optional: change to desired background
  },
  
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  
  searchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  
  resetButton: {
    flex: 1,
    backgroundColor: '#00A86B',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  incomeButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  investmentButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  expenseButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CalendarMain;