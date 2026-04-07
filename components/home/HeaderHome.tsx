import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HeaderHome() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>ReUse</Text>

            <View style={styles.xpBadge}>
                <Text style={styles.xpText}>★ 1.240 XP</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 14,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: "#F7F9F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2B2B2B",
    },

    xpBadge: {
        borderWidth: 1,
        borderColor: "#7AA61C",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#EEF7DC",
    },

    xpText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#7AA61C",
    },
});