// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity,Image  } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles/ErrorScreen';
// const customErrorImage = require('../../assets/images/error2.jpg');

// type ErrorType = 'offline' | 'server' | 'empty' | 'nothing';

// interface ErrorScreenProps {
//   errorType: ErrorType;
//   onRetry?: () => void; //אם נרצה להוסיף כפתור של נסה שוב
// }

// const errorConfig = {
//   offline: {
//     icon: 'wifi-off',
//     title: 'No Internet Connection',
//     message: 'Please check your network and try again.',
//     color: '#f39c12',
//   },
//   server: {
//     icon: 'server-off',
//     title: 'Server Error',
//     message: 'Something went wrong. Please try again later.',
//     color: '#e74c3c',
//   },
//   empty: {
//     icon: 'file-remove-outline',
//     title: 'No Content Available',
//     message: 'There is currently nothing to display.',
//     color: '#a29bfe',
//   },
//   nothing: {
//     icon: 'inbox',
//     title: 'No content to display',
//     message: 'The selected screen displays nothing.',
//     color: '#a29bfe',
//   },
// };

// const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorType, onRetry }) => {
//   const { title,
//      message,
//       color,
//       icon
//      } = errorConfig[errorType];

//   return (
//     <View style={styles.container}>
//       <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
//         {/* <Image source={customErrorImage} style={styles.errorImage} /> */}
//         <Icon name={icon} size={64} color={color} />
//       </View>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.message}>{message}</Text>

//       {(errorType === 'offline' || errorType === 'server') && onRetry && (
//         <TouchableOpacity style={styles.button} onPress={onRetry}>
//           <Text style={styles.buttonText}>Try Again</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };


// export default ErrorScreen;
// ErrorScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/ErrorScreen'; // ודא שהנתיב נכון

const customErrorImage = require('../../assets/images/error2.jpg');

// 1. הוסף 'notFound' לרשימת סוגי השגיאות
type ErrorType = 'offline' | 'server' | 'empty' | 'nothing' | 'notFound';

interface ErrorScreenProps {
  errorType: ErrorType;
  onRetry?: () => void;
}

const errorConfig = {
  offline: {
    icon: 'wifi-off',
    title: 'No Internet Connection',
    message: 'Please check your network and try again.',
    color: '#f39c12',
  },
  server: {
    icon: 'server-off',
    title: 'Server Error',
    message: 'Something went wrong. Please try again later.',
    color: '#e74c3c',
  },
  empty: {
    icon: 'file-remove-outline',
    title: 'No Content Available',
    message: 'There is currently nothing to display.',
    color: '#a29bfe',
  },
  nothing: {
    icon: 'inbox',
    title: 'No content to display',
    message: 'The selected screen displays nothing.',
    color: '#a29bfe',
  },
  // 2. הוסף את הגדרות התצוגה עבור סוג השגיאה החדש
  notFound: {
    icon: 'account-search-outline', // אייקון מתאים
    title: 'User Not Found',
    message: 'This email is not registered with us. We will redirect you to the signup page.',
    color: '#3498db', // צבע כחול אינפורמטיבי
  },
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorType, onRetry }) => {
  const { title, message, color, icon } = errorConfig[errorType];

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={64} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {(errorType === 'offline' || errorType === 'server') && onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default ErrorScreen;
