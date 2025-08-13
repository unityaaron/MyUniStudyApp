import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BuySellScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy And Sell</Text>
      <View style={styles.cardsContainer}>
        {/* MarketPlace Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('MarketplacePage')}
        >
          <Ionicons name="hand-right-outline" size={80} color="black" />
          <Text style={styles.cardLabel}>Market Place</Text>
          <Text style={styles.cardCount}>See What People Are Selling</Text>
        </TouchableOpacity>

        {/* SellerPage Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('SellerPage')}
        >
          <Ionicons name="pricetag-outline" size={80} color="black" />
          <Text style={styles.cardLabel}>Seller</Text>
          <Text style={styles.cardCount}>Post What You Have To Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default BuySellScreen;