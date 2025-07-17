import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  button: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: "#4EB6AC",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  buttonText: {
    color: "#4EB6AC",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
  },
});
