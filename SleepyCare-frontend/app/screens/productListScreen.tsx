import React, { useEffect, useState } from "react";
import {  View,  Text,  Image,  FlatList,  Linking,  Modal,  TouchableOpacity,} from "react-native";
import { Product } from "../types/productList.type";
import { getProducts } from "../contexts/productList.service";
import { styles } from "../styles/productList.style";

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    const productsData = getProducts();
    setProducts(productsData);
  }, []);

  const openImageModal = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => openImageModal(item.imageUrl)}>
        <Image source={item.imageUrl} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(item.purchaseUrl)}
      >
        <Text style={styles.buttonText}>לרכישה</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalBackground}
          >
            {selectedImage && (
              <Image
                source={selectedImage}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ProductListScreen;
