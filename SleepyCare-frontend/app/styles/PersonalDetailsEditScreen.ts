import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#4DB6AC'; // צבע טורקיז דומה לתמונה
const LIGHT_GRAY_BACKGROUND = '#F7F8FC';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        paddingVertical: 15,
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    profileInfoContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        padding: 20, // הוספת רווח פנימי לתמונה
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: PRIMARY_COLOR,
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    profileType: {
        fontSize: 14,
        color: '#757575',
    },
    optionsContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 6,
        paddingHorizontal: 30,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.05,
        // shadowRadius: 2,
        // elevation: 2,
    },
    optionIconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        fontWeight: 'bold'
    },
    signOutButton: {
        flexDirection: 'row',
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 30, // רווח לתחתית המסך
    },
    signOutIcon: {
        marginRight: 10,
    },
    signOutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    marginBottom: 12,
  },

  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default styles;