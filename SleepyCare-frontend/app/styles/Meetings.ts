// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 0,
//         margin: 0,
//         backgroundColor: '#fff',
//     },
//     button: {
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         backgroundColor: cloudColors
// .background, // מהconstants שלך
//         borderRadius: 8,
//         alignSelf: 'flex-start', // חשוב – כדי לא למרכז את עצמו
//       },
      
//     card: {
//         backgroundColor: '#f9f9f9',
//         padding: 15,
//         marginVertical: 8,
//         borderRadius: 10,
//         borderLeftWidth: 4,
//         borderLeftColor: '#007bff',
//     },
//     title: {
//         fontWeight: 'bold',
//         marginBottom: 5,
//         fontSize: 16,
//     },
//     zoom: {
//         marginTop: 5,
//         textDecorationLine: 'underline',
//     },
//     error: {
//         color: 'red',
//         textAlign: 'center',
//         marginTop: 20,
//     },

//     buttonRow: {
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//         paddingHorizontal: 10, // או לפי הצורך
//         marginTop: 10, // מוסיף רווח מלמעלה
//       }
      
      
// });
// export default styles;
import { StyleSheet, Dimensions } from 'react-native';

import { cloudColors} from '../constants';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cloudColors
    .backgroundAlt,
  },

  header: {
    backgroundColor: cloudColors
    .primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: cloudColors
    .white,
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    color: cloudColors
    .white,
    opacity: 0.9,
  },

  addButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 56,
    height: 56,
    backgroundColor: cloudColors
    .primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: cloudColors
    .primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },

  addButtonText: {
    color: cloudColors
    .white,
    fontSize: 24,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  meetingsList: {
    paddingBottom: 100,
  },

  meetingCard: {
    backgroundColor: cloudColors
    .background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cloudColors
    .border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: cloudColors
    .primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    position: 'relative',
  },

  meetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: cloudColors
    .textPrimary,
    flex: 1,
  },

  editMenuButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },

  menuIcon: {
    fontSize: 16,
    color: cloudColors
    .icon,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: cloudColors
    .background,
    borderWidth: 1,
    borderColor: cloudColors
    .border,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    minWidth: 120,
    zIndex: 1000,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dropdownText: {
    fontSize: 14,
    color: cloudColors
    .textPrimary,
  },

  meetingDate: {
    backgroundColor: cloudColors
    .inputBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  dateText: {
    fontSize: 14,
    color: cloudColors
    .textSecondary,
    fontWeight: '600',
  },

  meetingTimes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  timeSlot: {
    backgroundColor: cloudColors
    .background,
    borderWidth: 1,
    borderColor: cloudColors
    .border,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 1,
  },

  timeText: {
    fontSize: 13,
    color: cloudColors
    .textSecondary,
  },

  timeLabel: {
    fontWeight: '600',
  },

  zoomLink: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: cloudColors
    .blue,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: cloudColors
    .blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  zoomText: {
    color: cloudColors
    .white,
    fontSize: 13,
    fontWeight: '600',
  },

  status: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },

  statusApproved: {
    backgroundColor: cloudColors
    .inputBackground,
    borderColor: cloudColors
    .success,
  },

  statusPending: {
    backgroundColor: cloudColors
    .inputBackground,
    borderColor: cloudColors
    .warning,
  },

  statusRejected: {
    backgroundColor: cloudColors
    .inputBackground,
    borderColor: cloudColors
    .error,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: cloudColors
    .textSecondary,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: cloudColors
    .textSecondary,
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 16,
    color: cloudColors
    .textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },

  errorMessage: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.2)',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },

  errorText: {
    color: cloudColors
    .error,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },

  errorDetails: {
    color: cloudColors
    .error,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },

  floatingAction: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: cloudColors
    .primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cloudColors
    .primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 1000,
  },

  floatingActionText: {
    color: cloudColors
    .white,
    fontSize: 24,
    fontWeight: '700',
  },

  // Legacy styles for backward compatibility
  card: {
    backgroundColor: cloudColors
    .background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cloudColors
    .border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: cloudColors
    .textPrimary,
    marginBottom: 8,
  },

  zoom: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: cloudColors
    .blue,
    color: cloudColors
    .white,
    borderRadius: 20,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginVertical: 8,
  },

  error: {
    color: cloudColors
    .error,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },

  button: {
    backgroundColor: cloudColors
    .primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default styles;