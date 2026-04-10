import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

type Item = {
    id: string;
    titulo: string;
    descricao: string;
    troca: string;
    imagem: string | null;
    criadoEm: string;
};

export default function MyItemsScreen() {
    const [itens, setItens] = useState<Item[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            async function carregar() {
                const salvo = await AsyncStorage.getItem("@reuse_itens");
                setItens(salvo ? JSON.parse(salvo) : []);
            }
            carregar();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Itens</Text>
            </View>

            {itens.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Nenhum item publicado ainda.</Text>
                </View>
            ) : (
                <FlatList
                    data={itens}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {item.imagem && (
                                <Image source={{ uri: item.imagem }} style={styles.image} />
                            )}
                            <Text style={styles.titulo}>{item.titulo}</Text>
                            <Text style={styles.descricao}>{item.descricao}</Text>
                            <Text style={styles.troca}>Troca por: {item.troca}</Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F5" },
    header: { height: 56, paddingHorizontal: 16, justifyContent: "center", borderBottomWidth: 0.5, borderBottomColor: "#E5E5E5" },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    empty: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { color: "#6B6B6B", fontSize: 15 },
    list: { padding: 16, gap: 12 },
    card: { backgroundColor: "#FFF", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E6E2D9" },
    image: { width: "100%", height: 160, borderRadius: 8, marginBottom: 10 },
    titulo: { fontSize: 16, fontWeight: "700", color: "#2F2F2F", marginBottom: 4 },
    descricao: { fontSize: 14, color: "#555", marginBottom: 6 },
    troca: { fontSize: 13, color: "#6E9F1E", fontWeight: "600" },
});