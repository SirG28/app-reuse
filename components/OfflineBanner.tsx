// components/OfflineBanner.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

export default function OfflineBanner() {
    const netInfo = useNetInfo();
    const offline = netInfo.isConnected === false;

    if (!offline) return null;

    return (
        <View style={styles.banner}>
            <Text style={styles.text}>
                ⚠️ Você está offline. Mostrando dados salvos no cache.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: "#FFE8A8",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E8C04E",
    },
    text: {
        fontSize: 13,
        color: "#5A4500",
        textAlign: "center",
        fontWeight: "600",
    },
});