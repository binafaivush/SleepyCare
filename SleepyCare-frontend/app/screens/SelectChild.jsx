import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useUserData } from "../components/useUserData";
import { choose } from "../store/clientSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/hooks";
import styles from "../styles/SelectChild";
const ChooseChildModal = ({ visible, onClose }) => {
  const { children: userChildren } = useUserData();
  // const userChildren = [{id : 1, name: "Child 1", child_birthdate: "2020-01-01", user_id: 1, notes: "", counselor_id: 1}]; // דמה של רשימת ילדים
  const [selectedChild, setSelectedChild] = useState(null);
  // const [clientId, setClientId] = useState(userCurrentChild);
  const dispatch = useDispatch();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [showModal, setShowModal] = useState(visible);
  const carrentClient = useAppSelector((state) => state.client);
  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 200,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const handleSelect = (child) => {
    dispatch(
      choose({
        _id: child._id,
        user_id: child.user_id,
        notes: child.notes,
        counselor_id: child.counselor_id,
        child_name: child.name,
        child_birthdate: child.child_birthdate,
      })
    );
    onClose();
  };
  if (!showModal) return null;

  return (
    <>
      <Modal
        visible={showModal}
        animationType="none"
        transparent
        onRequestClose={onClose}
      >
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            {userChildren.length > 0 ? (
              <>
                <Text style={styles.title}>Your children</Text>
                <ScrollView
                  contentContainerStyle={{ width: "100%" }}
                  showsVerticalScrollIndicator={false}
                >
                  {userChildren.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.childItem,
                        selectedChild?.id === item.id && styles.selectedChild,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <Text style={styles.title}>No children found</Text>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};
export default ChooseChildModal;