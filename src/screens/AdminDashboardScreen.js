import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Edit, Plus } from 'lucide-react-native';
import axios from 'axios';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/products`;

const AdminDashboardScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            setProducts(products.filter((p) => p.id !== id));
            Alert.alert('Success', 'Product deleted successfully');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('UpsertProduct', { product: item })}
        >
          <Edit size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('UpsertProduct')}
        >
          <Plus size={24} color="#fff" />
          <Text style={styles.addButtonText}>New Product</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#34C759', flexDirection: 'row', padding: 10, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#666', marginTop: 4 },
  actions: { flexDirection: 'row' },
  actionButton: { padding: 10, marginLeft: 8 },
});

export default AdminDashboardScreen;
