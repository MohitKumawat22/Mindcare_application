import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

export default function HomeScreen({ route }) {
  const { user } = route.params || { user: { name: 'Guest' } };
  const [weekDates, setWeekDates] = useState([]);

  // --- Logic to get Real-Time Dates ---
  useEffect(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tempDates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      tempDates.push({
        dayName: days[date.getDay()],
        dayNumber: date.getDate(),
        isToday: i === 0, // Mark the first item as today
      });
    }
    setWeekDates(tempDates);
  }, []);

  const renderQuickJournal = ({ item }) => (
    <View style={[styles.qCard, { backgroundColor: item.bg }]}>
      <View style={styles.qHeader}>
        <Text style={styles.qTitle}>{item.title}</Text>
        <Ionicons name={item.icon} size={18} color="#555" />
      </View>
      <Text style={styles.qSubtitle}>{item.sub}</Text>
      <View style={styles.tagRow}>
        <View style={styles.tag}><Text style={styles.tagTxt}>{item.tag}</Text></View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user.name}</Text>
          <View style={styles.avatar} />
        </View>

        {/* --- Real-Time Calendar Strip --- */}
        <View style={styles.calRow}>
          {weekDates.map((item, index) => (
            <View key={index} style={[styles.dateBox, item.isToday && styles.activeDate]}>
              <Text style={[styles.dayText, item.isToday && styles.activeText]}>{item.dayName}</Text>
              <Text style={[styles.dateNum, item.isToday && styles.activeText]}>{item.dayNumber}</Text>
            </View>
          ))}
        </View>

        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>My Journal</Text>
          <Text style={{color:'#999'}}>See all</Text>
        </View>
        <View style={styles.bigCardRow}>
          <View style={styles.morningCard}>
            <Text style={styles.cardTitle}>Let's start your day</Text>
            <Text style={{fontSize: 12, marginTop: 5, color: '#444'}}>Begin with mindful reflection.</Text>
            <Ionicons name="sunny" size={50} color="#ff9800" style={{ position:'absolute', bottom: 10, right: 10}}/>
          </View>
          <View style={styles.eveningCard}>
            <Text style={styles.vertText}>Evening</Text>
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>Quick Journal</Text>
          <Text style={{color:'#999'}}>See all</Text>
        </View>
        
        <FlatList 
          horizontal 
          data={[
            {id:1, title:'Pause & reflect', sub:'Gratitude check', tag:'Personal', bg:'#ffece5', icon:'leaf'},
            {id:2, title:'Set Intentions', sub:'How to feel?', tag:'Family', bg:'#e5e0ff', icon:'happy'}
          ]}
          renderItem={renderQuickJournal}
          keyExtractor={i => i.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#222' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd' },
  
  // Updated Calendar Styles
  calRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  dateBox: { alignItems: 'center', padding: 10, borderRadius: 15, minWidth: 45 },
  activeDate: { backgroundColor: '#FFC107', elevation: 2 },
  dayText: { fontSize: 11, color: '#888', marginBottom: 4 },
  dateNum: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  activeText: { color: '#fff' }, // White text for active date

  secHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginBottom: 15 },
  secTitle: { fontSize: 18, fontWeight: 'bold' },
  bigCardRow: { flexDirection: 'row', height: 160 },
  morningCard: { flex: 1, backgroundColor: '#FFD54F', borderRadius: 20, padding: 20, marginRight: 10 },
  eveningCard: { width: 50, backgroundColor: '#D7CCC8', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  vertText: { transform: [{ rotate: '-90deg' }], fontWeight: 'bold', color: '#5D4037' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', width: '70%' },
  qCard: { width: 150, height: 130, borderRadius: 15, padding: 15, marginRight: 15, justifyContent: 'space-between' },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  qTitle: { fontWeight: 'bold', fontSize: 14 },
  qSubtitle: { fontSize: 11, color: '#666' },
  tag: { backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  tagTxt: { fontSize: 10 }
});