import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

const BASE_URL = "http://192.168.200.28:8000";

const MostrarDestinos = () => {
  const [destinos, setDestinos] = useState([]);
  const router = useRouter();

  const fetchDestinos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/destinations`);
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      setDestinos(data.results || data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDestinos();
  }, []);

  const DeleteDestination = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/destinations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      setDestinos((prevDestinos) => prevDestinos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar el Destino:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDestinos();
    }, [])
  );

  //use un switch case porque no se como implentar las tags
  const DifficultyColor = (difficulty) => {
    let color;
    switch (difficulty.toLowerCase()) {
      case "easy":
        color = "green";
        break;
      case "medium":
        color = "orange";
        break;
      case "hard":
        color = "violet";
        break;
    }
    return <Text style={[styles.difficultyText, { color }]}>{difficulty}</Text>;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <FlatList
          data={destinos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.planetCard}>
              <Text style={styles.planetText}>{item.name}</Text>
              {item.difficulty && DifficultyColor(item.difficulty)}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/destinos/editar",
                      params: item,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => DeleteDestination(item.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "black",
    maxWidth: "85%",
  },
  planetCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 2,
  },
  planetText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "lightblue",
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MostrarDestinos;
