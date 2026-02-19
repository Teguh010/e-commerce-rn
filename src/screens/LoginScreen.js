import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginScreen = ({ navigation, onLogin }) => {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onLogin();
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue shopping</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={formik.handleChange('email')}
          value={formik.values.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {formik.errors.email && <Text style={styles.error}>{formik.errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
        />
        {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}

        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

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
