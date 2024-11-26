import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditarDestino() {
  const params = useLocalSearchParams(); // Obtener los parámetros desde la URL
  const { id, name, description, difficulty, isFavorite } = params;
  const router = useRouter();

  const [newName, setNewName] = useState(name || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDifficulty, setNewDifficulty] = useState(difficulty || "");
  const [newIsFavorite, setNewIsFavorite] = useState(isFavorite || Boolean);

  const EditDestino = async (destinationId) => {
    try {
      const response = await fetch(
        `http://192.168.200.28:8000/destinations/${destinationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            description: newDescription,
            difficulty: newDifficulty,
            isFavorite: newIsFavorite,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      if (!["easy", "medium", "hard"].includes(difficulty)) {
        Alert.alert(
          "Error",
          "La dificultad debe ser una de las siguientes: easy, medium o hard."
        );
        return;
      }

      const data = await response.json();
      Alert.alert("Éxito", "El Destini ha sido editado exitosamente.");
      router.push("/(tabs)/destinos");
    } catch (error) {
      console.error("Error al editar el Destino:", error);
      Alert.alert("Error", "No se pudo editar el Destino.");
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Editar Destino</Text>

      <TextInput
        style={styles.input}
        placeholder="Nuevo Nombre"
        value={newName}
        onChangeText={setNewName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva Descripción"
        value={newDescription}
        onChangeText={setNewDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva Dificultad"
        value={newDifficulty}
        onChangeText={setNewDifficulty}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Marcar como favorito</Text>
        <Switch value={newIsFavorite} onValueChange={setNewIsFavorite} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => EditDestino(id)}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push("/(tabs)/destinos")}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#28A745",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
