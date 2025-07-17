import { StyleSheet, Platform } from 'react-native';

const PRIMARY_GREEN = '#4EB6AC';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PRIMARY_GREEN,
  },
  titleUnderline: {
    width: 160,
    height: 4,
    backgroundColor: PRIMARY_GREEN,
    marginTop: 6,
    borderRadius: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: BLACK,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6,
  },
  addBtnText: {
    color: WHITE,
    fontSize: 28,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
  },
  taskItemDone: {
    backgroundColor: PRIMARY_GREEN,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: WHITE,
  },
  check: {
    color: PRIMARY_GREEN,
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: BLACK,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: WHITE,
    fontWeight: '600',
  },
  deleteCircle: {
    padding: 6,
  },
  emptyList: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
  confirmBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmBtnText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default styles;