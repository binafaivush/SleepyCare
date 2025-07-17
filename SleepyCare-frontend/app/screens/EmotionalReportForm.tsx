import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm, Controller } from "react-hook-form";
import Slider from "@react-native-community/slider";
import styles from '../styles/EmotionalReportForm'
import { commonColor } from "../constants";

type FormData = {
  mode: "good" | "average" | "stressed"; 
  note: string;
    parent_sleep_hours: string;
  stress_level: number;
};

export default function EmotionalReportForm() {
 
  const { control, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      mode: "average", 
      note: "",
      parent_sleep_hours: "",
      stress_level: 2,
    },
  });

  const [loading, setLoading] = useState(true);

  const [hasReportToday, setHasReportToday] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function loadReport() {
      try {
        const lastDate = await AsyncStorage.getItem("lastSubmissionDate");
        const reportData = await AsyncStorage.getItem("lastReportData");

        if (lastDate === today && reportData) {
          const parsed = JSON.parse(reportData);
          setValue("mode", parsed.mode);
          setValue("note", parsed.note);
          setValue("parent_sleep_hours", parsed.parent_sleep_hours);
          setValue("stress_level", parsed.stress_level);
          setHasReportToday(true);
        }
      } catch {
        Alert.alert("Error", "Could not load saved report.");
            } finally {
        setLoading(false); 
            }
    }
    loadReport();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await AsyncStorage.setItem("lastSubmissionDate", today);
      await AsyncStorage.setItem("lastReportData", JSON.stringify(data));
      setHasReportToday(true); 
            setStatus("submitted"); 
              } catch {
      Alert.alert("Error", "An error occurred while saving the report."); 
    }
  };

  const resetAll = async () => {
    try {
      await AsyncStorage.removeItem("lastSubmissionDate");
      await AsyncStorage.removeItem("lastReportData");
      reset(); 
            setHasReportToday(false);
      setStatus("idle"); 
    } catch {
      Alert.alert("Error", "Could not reset data."); 
    }
  };

  const watchData = watch();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={commonColor.PRIMARY_GREEN} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (status === "submitted") {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.successMessage}>
          Your emotional report for today has been saved.
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.summaryText}>Mood: {watchData.mode}</Text>
          <Text style={styles.summaryText}>Note: {watchData.note}</Text>
          <Text style={styles.summaryText}>Sleep: {watchData.parent_sleep_hours} hours</Text>
          <Text style={styles.summaryText}>Stress Level: {watchData.stress_level}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => setStatus("idle")}>
          <Text style={styles.editButtonText}>Edit Again</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetAll} style={styles.resetButtonStyled}>
          <Text style={styles.resetButtonStyledText}>🗑️ Reset All Data</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Daily Emotional Report</Text>

        {hasReportToday && (
          <Text style={styles.infoText}>
            You already submitted a report today. You can update it below.
          </Text>
        )}

        <Text style={styles.label}>How are you feeling today?</Text>
        <Controller
          control={control}
          name="mode"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.modeSelector}>
              {["good", "average", "stressed"].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.modeButton,
                    value === m && styles.modeButtonSelected,
                  ]}
                  onPress={() => onChange(m)}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      value === m && styles.modeButtonTextSelected,
                    ]}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        <Text style={styles.label}>Additional notes (optional):</Text>
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Write anything you want..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />

        <Text style={styles.label}>How many hours did you sleep last night?</Text>
        <Controller
          control={control}
          name="parent_sleep_hours"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="e.g., 5.5"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>What is your stress level today?</Text>
        <Controller
          control={control}
          name="stress_level"
          render={({ field: { onChange, value } }) => (
            <>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={value}
                onValueChange={onChange}
                minimumTrackTintColor={commonColor.PRIMARY_GREEN}
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor={commonColor.PRIMARY_GREEN}
              />
              <Text style={styles.stressValue}>Level: {value}</Text>
            </>
          )}
        />

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
          <Text style={styles.buttonText}>
            {hasReportToday ? "Update Report" : "Submit Report"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetAll} style={styles.resetButtonStyled}>
          <Text style={styles.resetButtonStyledText}>🗑️ Reset All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
