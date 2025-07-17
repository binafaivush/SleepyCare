import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
  loadingContainer: { marginTop: 20 },
  loadingText: { textAlign: 'center' },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 6,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: '#333',
  },
});

export default styles;
