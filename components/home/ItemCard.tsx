import React from "react";
import { StyleSheet, View } from "react-native";

export default function ItemCard() {
    return <View style={styles.card} />;
}

const styles = StyleSheet.create({
    card: {
        width: 170,
        height: 180,
        borderRadius: 12,
        backgroundColor: "#F0F0EE",
        borderWidth: 1,
        borderColor: "#E2DED6",
    },
});