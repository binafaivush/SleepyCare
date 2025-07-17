import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  chartItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bar: {
    width: 30,
    borderRadius: 8,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMood: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalNote: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCloseText: {
    fontWeight: '500',
    color: '#333',
  },
});
export default styles;