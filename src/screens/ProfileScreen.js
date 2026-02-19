import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, ShoppingBag, LogOut } from 'lucide-react-native';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color="#666" />
        </View>
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.email}>guest@example.com</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <ShoppingBag size={20} color="#000" />
          <Text style={styles.menuText}>Pesanan Saya</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#000" />
          <Text style={styles.menuText}>Pengaturan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logout]}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Keluar</Text>
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
  menu: { padding: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' },
  menuText: { fontSize: 18, marginLeft: 16 },
  logout: { marginTop: 24, borderBottomWidth: 0 },
});

export default ProfileScreen;
