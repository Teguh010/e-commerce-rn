import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
      } catch (err) {
        Alert.alert('Login Failed', err.response?.data?.message || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="name@email.com"
            onChangeText={formik.handleChange('email')}
            value={formik.values.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.error}>{formik.errors.email}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            onChangeText={formik.handleChange('password')}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.error}>{formik.errors.password}</Text>
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In Now</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.link} onPress={() => {}}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, justifyContent: 'center', flex: 1 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4, marginBottom: 32 },
  input: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, marginBottom: 12, fontSize: 16 },
  error: { color: '#FF3B30', marginBottom: 12 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#007AFF' },
});

export default LoginScreen;
