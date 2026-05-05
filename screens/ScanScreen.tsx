import { useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { supabase } from '../lib/supabase'
import useCartStore from '../store/cartStore'
import { palette } from '../lib/theme'

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const addToCart = useCartStore((state) => state.addToCart) // ✅ inside component

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need camera permission to scan barcodes
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return
    setScanned(true)

    const { data: products, error } = await supabase
      .from('products')
      .select()
      .eq('barcode', data)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    if (products && products.length > 0) {
      setProduct(products[0])
    } else {
      Alert.alert('Not Found', 'No product found with this barcode!', [
        { text: 'OK', onPress: () => setScanned(false) }
      ])
    }
  }

  if (product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Product Found! 🍵</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.stock}>
            {product.stock === 0 ? 'Out of Stock ❌' : `In Stock: ${product.stock} ✅`}
          </Text>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              product.stock === 0 && styles.addToCartBtnDisabled
            ]}
            onPress={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
            })}
            disabled={product.stock === 0}
          >
            <Text style={styles.addToCartText}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScanned(false)
            setProduct(null)
          }}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Product 🔍</Text>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'upc_a'],
        }}
      />
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.darkGreen,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: palette.darkGreen,
    textAlign: 'center',
    marginBottom: 16,
  },
  camera: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: palette.mossGreen,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.midnightGreen,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: palette.darkGreen,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.rosyBrown,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: palette.mossGreen,
    marginBottom: 4,
  },
  stock: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.darkGreen,
    marginBottom: 4,
  },
  button: {
    backgroundColor: palette.darkGreen,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  buttonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartBtn: {
    backgroundColor: palette.rosyBrown,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartBtnDisabled: {
    backgroundColor: palette.mossGreen,
  },
  addToCartText: {
    color: palette.midnightGreen,
    fontWeight: 'bold',
    fontSize: 14,
  },
})