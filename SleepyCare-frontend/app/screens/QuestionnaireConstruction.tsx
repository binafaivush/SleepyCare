import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { buildQuestionnairePayload } from '../components/featurs/buildQuestionnairePayload';
import { QuestionInput, QuestionType } from '../types/question';
import { httpAddQuestion } from '../contexts/questionService';
import { RootState } from '../store/store';
import styles from '../styles/questionaire';

const QUESTION_TYPES = [
  { label: 'Multiple Choice', value: 'multiple' },
  { label: 'Open', value: 'open' },
  { label: 'Yes/No', value: 'yesno' },
];

const defaultQuestion = (): QuestionInput => ({
  type: 'multiple',
  text: '',
  options: [''],
  saved: false,
});

export default function QuestionnaireConstruction() {
  const [questions, setQuestions] = useState<QuestionInput[]>([defaultQuestion()]);
  const [questionnaireName, setQuestionnaireName] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const consultant = useSelector((state: RootState) => state.user);

  const handleTypeChange = (idx: number, type: QuestionType) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === idx ? { ...q, type, options: type === 'multiple' ? [''] : [], text: '' } : q
      )
    );
  };

  const handleTextChange = (idx: number, text: string) => {
    setQuestions(qs =>
      qs.map((q, i) => (i === idx ? { ...q, text } : q))
    );
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: (q.options || []).map((opt, j) => (j === optIdx ? value : opt)) }
          : q
      )
    );
  };

  const addOption = (qIdx: number) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, options: [...(q.options || []), ''] } : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions(qs => [...qs, defaultQuestion()]);
  };

  const saveQuestion = (idx: number) => {
    setQuestions(qs =>
      qs.map((q, i) => (i === idx ? { ...q, saved: true } : q))
    );
  };

  const deleteQuestion = (idx: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const canSaveQuestion = (q: QuestionInput) => {
    if (!q.text.trim()) return false;
    if (q.type === 'multiple') {
      return (q.options || []).some(opt => opt.trim());
    }
    return true;
  };

  const saveQuestionnaire = () => {
    setSnackbarMsg(`Questionnaire "${questionnaireName}" saved!`);
    setSnackbarVisible(true);
    const data = buildQuestionnairePayload(questions, consultant.id, questionnaireName);
    console.log('Saving questionnaire with data:', data);
    httpAddQuestion(data, consultant.token)
      .then(response => {
        console.log('Questionnaire saved successfully:', response);
        setQuestions([defaultQuestion()]);
        setQuestionnaireName('');
      })
      .catch(error => {
        console.error('Error saving questionnaire from front:', error);
        setSnackbarMsg('Failed to save questionnaire. Please try again.');
        setSnackbarVisible(true);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Questionnaire Builder</Text>
            {/* הוסף כאן את האינפוט לשם השאלון */}
            <Text style={styles.label}>Questionnaire name:</Text>
            <TextInput
              style={styles.input}
              placeholder="enter Questionnaire name..."
              value={questionnaireName}
              onChangeText={setQuestionnaireName}
            />
            {/* FlatList replaced with map for better keyboard handling */}
            {questions.map((item, index) => (
              <View key={index} style={styles.questionBox}>
                {!item.saved ? (
                  <>
                    <Text style={styles.label}>Question Type:</Text>
                    <View style={styles.typeRow}>
                      {QUESTION_TYPES.map(type => (
                        <TouchableOpacity
                          key={type.value}
                          style={[
                            styles.typeButton,
                            item.type === type.value && styles.typeButtonSelected,
                          ]}
                          onPress={() => handleTypeChange(index, type.value as QuestionType)}
                        >
                          <Text style={item.type === type.value ? styles.typeTextSelected : styles.typeText}>
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your question..."
                      value={item.text}
                      onChangeText={text => handleTextChange(index, text)}
                    />
                    {item.type === 'multiple' && (
                      <View>
                        <Text style={styles.label}>Possible Answers:</Text>
                        {(item.options || []).map((opt, optIdx) => (
                          <View key={optIdx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              style={[styles.input, { flex: 1 }]}
                              placeholder={`Option ${optIdx + 1}`}
                              value={opt}
                              onChangeText={val => handleOptionChange(index, optIdx, val)}
                            />
                            {(item.options && item.options.length > 1) && (
                              <TouchableOpacity
                                style={styles.optionDeleteIconBtn}
                                onPress={() => {
                                  setQuestions(qs =>
                                    qs.map((q, i) =>
                                      i === index
                                        ? { ...q, options: (q.options || []).filter((_, j) => j !== optIdx) }
                                        : q
                                    )
                                  );
                                }}
                              >
                                <MaterialIcons name="close" size={20} color="#dc3545" />
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                        <TouchableOpacity style={styles.addOptionBtn} onPress={() => addOption(index)}>
                          <Text style={styles.addOptionText}>+ Add Option</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <TouchableOpacity style={styles.saveBtn} onPress={() => saveQuestion(index)} disabled={!canSaveQuestion(item)}>
                        <Text style={[styles.saveBtnText, !canSaveQuestion(item) && { opacity: 0.5 }]}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteIconBtn} onPress={() => deleteQuestion(index)}>
                        <MaterialIcons name="delete" size={22} color="#dc3545" />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={styles.savedBox}>
                    <Text style={styles.savedTitle}>Question {index + 1}:</Text>
                    <Text style={styles.savedText}>{item.text}</Text>
                    {item.type === 'multiple' && (
                      <View style={{ marginTop: 6 }}>
                        {(item.options || []).filter(opt => opt.trim()).map((opt, i) => (
                          <Text key={i} style={styles.savedOption}>• {opt}</Text>
                        ))}
                      </View>
                    )}
                    {item.type === 'yesno' && (
                      <Text style={styles.savedOption}>Options: Yes / No</Text>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'flex-end' }}>
                      <TouchableOpacity style={styles.deleteIconBtn} onPress={() => deleteQuestion(index)}>
                        <MaterialIcons name="delete" size={22} color="#dc3545" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editIconBtn} onPress={() => setQuestions(qs => qs.map((q, i) => i === index ? { ...q, saved: false } : q))}>
                        <MaterialIcons name="edit" size={22} color="#007AFF" accessibilityLabel="Edit question" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
            <Text style={styles.addBtnText}>+ Add Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveQuestionnaireBtn} onPress={saveQuestionnaire}>
            <Text style={styles.saveQuestionnaireText}>Save Questionnaire</Text>
          </TouchableOpacity>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {snackbarMsg}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

