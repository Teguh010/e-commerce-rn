import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

const BASE_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const PRODUCTS_API_URL = `${BASE_API_URL}/products`;
const UPLOAD_API_URL = `${PRODUCTS_API_URL}/upload-image`;

const UpsertProductScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      price: product?.price?.toString() || '',
      description: product?.description || '',
      image: product?.image || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      price: Yup.number().required('Required').positive('Must be positive'),
      description: Yup.string().required('Required'),
      image: Yup.string().url('Invalid URL').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = { ...values, price: parseFloat(values.price) };
        if (isEditing) {
          await axios.put(`${PRODUCTS_API_URL}/${product.id}`, payload);
          Alert.alert('Success', 'Product updated successfully');
        } else {
          await axios.post(PRODUCTS_API_URL, payload);
          Alert.alert('Success', 'Product added successfully');
        }
        navigation.goBack();
      } catch (err) {
        Alert.alert('Error', 'Failed to save product');
      } finally {
        setLoading(false);
      }
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (asset) => {
    setUploading(true);
    const formData = new FormData();
    
    // Create a file-like object for the form data
    const uriParts = asset.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: asset.uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    try {
      const response = await axios.post(UPLOAD_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      formik.setFieldValue('image', response.data.url);
      Alert.alert('Success', 'Image uploaded to Cloudinary');
    } catch (err) {
      const status = err.response?.status;
      const url = err.config?.url ?? UPLOAD_API_URL;
      const detail = err.response?.data?.message || err.message;
      console.error('Upload error:', { status, url, detail, err });
      const message =
        status === 404
          ? `Endpoint tidak ditemukan (404). URL: ${url}. Pastikan backend jalan dan punya route POST /products/upload-image. Cek EXPO_PUBLIC_API_URL.`
          : `Gagal upload (${status || 'network'}): ${detail}`;
      Alert.alert('Upload Failed', message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Product Image</Text>
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={pickImage}
            disabled={uploading}
          >
            {formik.values.image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: formik.values.image }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Camera size={24} color="#fff" />
                  <Text style={styles.overlayText}>Change Photo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                {uploading ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <>
                    <Camera size={32} color="#999" />
                    <Text style={styles.placeholderText}>Select Product Photo</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
          {uploading && <Text style={styles.uploadingText}>Uploading to Cloudinary...</Text>}
          {formik.errors.image && <Text style={styles.errorText}>{formik.errors.image}</Text>}

          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            placeholder="e.g. iPhone 15 Pro"
          />
          {formik.errors.name && <Text style={styles.errorText}>{formik.errors.name}</Text>}

          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={formik.values.price}
            onChangeText={formik.handleChange('price')}
            keyboardType="numeric"
            placeholder="999.99"
          />
          {formik.errors.price && <Text style={styles.errorText}>{formik.errors.price}</Text>}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formik.values.description}
            onChangeText={formik.handleChange('description')}
            multiline
            numberOfLines={4}
            placeholder="Write product description here..."
          />
          {formik.errors.description && <Text style={styles.errorText}>{formik.errors.description}</Text>}

          <TouchableOpacity 
            style={[styles.saveButton, (loading || uploading) && styles.disabledButton]} 
            onPress={formik.handleSubmit}
            disabled={loading || uploading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Product</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  form: { gap: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: -8 },
  imagePicker: { height: 200, backgroundColor: '#f8f9fa', borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', overflow: 'hidden' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#999', marginTop: 8, fontSize: 14 },
  imageContainer: { flex: 1 },
  previewImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  overlayText: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 4 },
  uploadingText: { textAlign: 'center', color: '#007AFF', fontSize: 12, marginTop: -8 },
  input: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  errorText: { color: '#FF3B30', fontSize: 14, marginTop: -10 },
  saveButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { opacity: 0.6 },
});

export default UpsertProductScreen;
