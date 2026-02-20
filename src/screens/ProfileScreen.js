import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon, Settings, ShoppingBag, LogOut, Shield } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <UserIcon size={40} color="#666" />
        </View>
        <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        {user?.role !== 'user' && (
          <View style={styles.roleBadge}>
            <Shield size={14} color="#007AFF" />
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <ShoppingBag size={20} color="#000" />
          <Text style={styles.menuText}>My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#000" />
          <Text style={styles.menuText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666', marginTop: 4 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E1F0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
  roleText: { fontSize: 12, fontWeight: 'bold', color: '#007AFF', marginLeft: 4 },
  menu: { padding: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' },
  menuText: { fontSize: 17, marginLeft: 16, color: '#333' },
  logout: { marginTop: 40, borderBottomWidth: 0 },
});

export default ProfileScreen;
