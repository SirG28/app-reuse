import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function BottomNav() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.navItem, styles.activeItem]}
                onPress={() => router.push("/home")}
            >
                <Text style={[styles.icon, styles.activeText]}>⌂</Text>
                <Text style={[styles.label, styles.activeText]}>Início</Text>
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/PublicItem")}
            >
                <Text style={styles.icon}>＋</Text>
                <Text style={styles.label}>Itens</Text>
            </Pressable>

            <View style={styles.navItem}>
                <Text style={styles.icon}>⇄</Text>
                <Text style={styles.label}>Trocas</Text>
            </View>

            <View style={styles.navItem}>
                <Text style={styles.icon}>🏆</Text>
                <Text style={styles.label}>Ranking</Text>
            </View>

            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/profile")}
            >
                <Text style={styles.icon}>◦</Text>
                <Text style={styles.label}>Perfil</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E2DA",
    },

    navItem: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },

    activeItem: {
        backgroundColor: "#6E9F1E",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    icon: {
        fontSize: 14,
        color: "#2F2F2F",
        marginBottom: 2,
    },

    label: {
        fontSize: 11,
        color: "#2F2F2F",
    },

    activeText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});