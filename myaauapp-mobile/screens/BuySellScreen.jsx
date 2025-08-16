// screens/BuySellScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 🟢 FIX: We need to import the useTheme hook to get the theme.
import { useTheme } from '../components/ThemeProvider';

const BuySellScreen = ({ navigation }) => {
  // 🟢 FIX: Get the current theme to change the colors inside the screen.
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 🟢 FIX: We use a dynamic style to change the background of the main container.
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 🟢 FIX: Change the text color based on the theme. */}
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>Buy And Sell</Text>
      <View style={styles.cardsContainer}>
        {/* MarketPlace Card */}
        <TouchableOpacity 
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('MarketplacePage')}
        >
          {/* 🟢 FIX: Change the icon color based on the theme. */}
          <Ionicons name="hand-right-outline" size={80} color={isDark ? '#FFF' : 'black'} />
          {/* 🟢 FIX: Change the card label text color based on the theme. */}
          <Text style={[styles.cardLabel, isDark ? styles.labelDark : styles.labelLight]}>Market Place</Text>
          {/* 🟢 FIX: Change the card count text color based on the theme. */}
          <Text style={[styles.cardCount, isDark ? styles.countDark : styles.countLight]}>See What People Are Selling</Text>
        </TouchableOpacity>

        {/* SellerPage Card */}
        <TouchableOpacity 
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('SellerPage')}
        >
          {/* 🟢 FIX: Change the icon color based on the theme. */}
          <Ionicons name="pricetag-outline" size={80} color={isDark ? '#FFF' : 'black'} />
          {/* 🟢 FIX: Change the card label text color based on the theme. */}
          <Text style={[styles.cardLabel, isDark ? styles.labelDark : styles.labelLight]}>Seller</Text>
          {/* 🟢 FIX: Change the card count text color based on the theme. */}
          <Text style={[styles.cardCount, isDark ? styles.countDark : styles.countLight]}>Post What You Have To Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🟢 FIX: We add new styles for the light and dark themes.
const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    padding: 20,
  },
  containerLight: {
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  
  // Title styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleLight: {
    color: 'black',
  },
  titleDark: {
    color: 'white',
  },

  // Cards container
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  // Card styles
  card: {
    width: '45%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLight: {
    backgroundColor: 'white',
  },
  cardDark: {
    backgroundColor: '#1F1F1F',
  },

  // Card text styles
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  labelLight: {
    color: '#333',
  },
  labelDark: {
    color: '#E0E0E0',
  },
  
  // Card count styles
  cardCount: {
    fontSize: 14,
  },
  countLight: {
    color: '#666',
  },
  countDark: {
    color: '#B0B0B0',
  },
});

export default BuySellScreen;