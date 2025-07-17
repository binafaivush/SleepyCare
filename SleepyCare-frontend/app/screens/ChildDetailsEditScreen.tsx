import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { updateChildImage } from "../store/clientSlice";
import styles from "../styles/PersonalDetailsEditScreen";
const colors = {
  breastmilk: "#4EB6AC",
  formula: "#FFD700",
  solid: "#FF7F50",
};
const ChildProfile = () => {
  const child = {
    // useAppSelector(state => state.client) || {
    child_name: "Yony",
    child_birthdate: "01/01/2015",
    image: "../../../assets/images/profile.jpg",
  };
  const dispatch = useAppDispatch();
  const handleEditImage = () => {
    dispatch(updateChildImage("new-image-url"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                // child.image
                // ? { uri: child.image }
                // :
                require("../../assets/images/profile.jpg")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handleEditImage}
            >
              <Icon name="pencil" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{child.child_name}</Text>
          <Text style={styles.profileName}>
            Birth Date {child.child_birthdate}
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          <LinkButton
            label="פגישות"
            icon="calendar-month"
            color={colors.breastmilk}
            onPress={() => router.push("/screens/Meetings")}
          />
          <LinkButton
            label="יומנים"
            icon="book"
            color={colors.formula}
            onPress={() => router.push("/screens/SleepDiary")}
          />
          <LinkButton
            label="הערות"
            icon="note"
            color={colors.solid}
            onPress={() => router.push("/screens/SleepInsights")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LinkButton = ({
  icon,
  label,
  onPress,
  color,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}) => (
  <TouchableOpacity
    style={[styles.linkButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Icon name={icon} size={28} color="#fff" />
    <Text style={styles.linkText}>{label}</Text>
  </TouchableOpacity>
);
export default ChildProfile;