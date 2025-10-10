
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

type CalendarProps = {
  onDayPress?: (day: { dateString: string; day: number; month: number; year: number; timestamp: number }) => void;
  markedDates?: { [date: string]: any };
  style?: object;
};

export function Calendar({ onDayPress, markedDates, style }: CalendarProps) {
  return (
    <View style={[styles.container, style]}>
      <RNCalendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textSectionTitleColor: '#2563eb',
          selectedDayBackgroundColor: '#2563eb',
          selectedDayTextColor: '#fff',
          todayTextColor: '#2563eb',
          dayTextColor: '#222',
          textDisabledColor: '#ccc',
          arrowColor: '#2563eb',
          monthTextColor: '#2563eb',
          indicatorColor: '#2563eb',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
