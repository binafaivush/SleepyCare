import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#333',
  },
  inviteButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#4EB6AC',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  inviteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F8F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    gap: 10,
    elevation: 1,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#4EB6AC',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copiedText: {
    marginTop: 8,
    fontSize: 13,
    color: 'green',
    fontWeight: '500',
  },
});
