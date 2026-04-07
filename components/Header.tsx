import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>

      {/* Ícone no lugar do avatar */}
      <MaterialIcons
        name="recycling"
        size={42}
        color="#639922"
        style={styles.icon}
      />

      {/* Nome do app */}
      <Text style={styles.name}>
        ReUse
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 20,
  },

  icon: {
    marginRight: 10,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
      color: "#273D3A",
  }

});