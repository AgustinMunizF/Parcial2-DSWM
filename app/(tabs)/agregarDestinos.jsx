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
import { SafeAreaView } from "react-native-safe-area-context";

const AgregarPlaneta = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAgregarDestino = async () => {
    if (!nombre || !descripcion) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos obligatorios (nombre, descripción)."
      );
      return;
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      Alert.alert(
        "Error",
        "La dificultad debe ser una de las siguientes: easy, medium o hard."
      );
      return;
    }

    try {
      const response = await fetch("http://192.168.200.28:8000/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          description: descripcion,
          difficulty: difficulty,
          isFavorite: isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud al servidor");
      }

      const data = await response.json();
      console.log("Destino agregado:", data);

      // Resetear los campos del formulario
      setNombre("");
      setDescripcion("");
      setDifficulty("");
      setIsFavorite(false);

      Alert.alert("Éxito", "El destino se ha sido agregado.");
    } catch (error) {
      console.error("Error al agregar el destino:", error);
      Alert.alert(
        "Error",
        "No se pudo agregar el destino. Intenta nuevamente."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Agregar Destino</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del destino"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción del destino"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TextInput
          style={styles.input}
          placeholder="Dificultad (solo se aceptan easy, medium o hard)"
          value={difficulty}
          onChangeText={setDifficulty}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Marcar si es favorito</Text>
          <Switch value={isFavorite} onValueChange={setIsFavorite} />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAgregarDestino}
        >
          <Text style={styles.buttonText}>Agregar Destino</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  submitButton: {
    padding: 10,
    backgroundColor: "lightgreen",
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
});

export default AgregarPlaneta;
