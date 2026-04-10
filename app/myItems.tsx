import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

type Item = {
    id: string;
    titulo: string;
    descricao: string;
    troca: string;
    imagem: string | null;
    criadoEm: string;
};

export default function MyItemsScreen() {
    const router = useRouter();
    const [itens, setItens] = useState<Item[]>([]);
    const [itemEditando, setItemEditando] = useState<Item | null>(null);
    const [tituloEdit, setTituloEdit] = useState("");
    const [descricaoEdit, setDescricaoEdit] = useState("");
    const [trocaEdit, setTrocaEdit] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const salvo = await AsyncStorage.getItem("@reuse_itens");
        setItens(salvo ? JSON.parse(salvo) : []);
    }

    function abrirEdicao(item: Item) {
        setItemEditando(item);
        setTituloEdit(item.titulo);
        setDescricaoEdit(item.descricao);
        setTrocaEdit(item.troca);
    }

    async function salvarEdicao() {
        if (!tituloEdit || !descricaoEdit || !trocaEdit) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }

        const atualizados = itens.map((i) =>
            i.id === itemEditando!.id
                ? { ...i, titulo: tituloEdit, descricao: descricaoEdit, troca: trocaEdit }
                : i
        );

        await AsyncStorage.setItem("@reuse_itens", JSON.stringify(atualizados));
        setItens(atualizados);
        setItemEditando(null);
    }

    async function excluirItem(id: string) {
        Alert.alert("Excluir item", "Tem certeza que deseja excluir este item?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    const atualizados = itens.filter((i) => i.id !== id);
                    await AsyncStorage.setItem("@reuse_itens", JSON.stringify(atualizados));
                    setItens(atualizados);
                },
            },
        ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerButton}>
                    <Text style={styles.headerIcon}>‹</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Meus Itens</Text>
                <View style={styles.headerButton} />
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

                            <View style={styles.actions}>
                                <Pressable
                                    style={styles.btnEditar}
                                    onPress={() => abrirEdicao(item)}
                                >
                                    <Text style={styles.btnEditarText}>✏ Editar</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.btnExcluir}
                                    onPress={() => excluirItem(item.id)}
                                >
                                    <Text style={styles.btnExcluirText}>🗑 Excluir</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal visible={!!itemEditando} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Editar item</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            value={tituloEdit}
                            onChangeText={setTituloEdit}
                            placeholder="Título do item"
                            placeholderTextColor="#B9B9B9"
                        />

                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={descricaoEdit}
                            onChangeText={setDescricaoEdit}
                            multiline
                            placeholder="Descrição do item"
                            placeholderTextColor="#B9B9B9"
                        />

                        <Text style={styles.label}>Troca por</Text>
                        <TextInput
                            style={styles.input}
                            value={trocaEdit}
                            onChangeText={setTrocaEdit}
                            placeholder="O que você aceita na troca"
                            placeholderTextColor="#B9B9B9"
                        />

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.btnCancelar}
                                onPress={() => setItemEditando(null)}
                            >
                                <Text style={styles.btnCancelarText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={styles.btnSalvar} onPress={salvarEdicao}>
                                <Text style={styles.btnSalvarText}>Salvar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F5" },
    header: {
        height: 56,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
    },
    headerButton: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    headerIcon: {
        fontSize: 28,
        color: "#7AA61C",
        lineHeight: 32,
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    empty: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { color: "#6B6B6B", fontSize: 15 },
    list: { padding: 16, gap: 12 },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E6E2D9",
    },
    image: { width: "100%", height: 160, borderRadius: 8, marginBottom: 10 },
    titulo: { fontSize: 16, fontWeight: "700", color: "#2F2F2F", marginBottom: 4 },
    descricao: { fontSize: 14, color: "#555", marginBottom: 6 },
    troca: { fontSize: 13, color: "#6E9F1E", fontWeight: "600", marginBottom: 12 },
    actions: { flexDirection: "row", gap: 10 },
    btnEditar: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#7AA61C",
        alignItems: "center",
    },
    btnEditarText: { color: "#7AA61C", fontWeight: "600", fontSize: 13 },
    btnExcluir: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E53935",
        alignItems: "center",
    },
    btnExcluirText: { color: "#E53935", fontWeight: "600", fontSize: 13 },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F", marginBottom: 16 },
    label: { fontSize: 14, color: "#2F2F2F", marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#2B2B2B",
        backgroundColor: "#FAFAFA",
        marginBottom: 14,
    },
    textArea: { minHeight: 72, textAlignVertical: "top" },
    modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
    btnCancelar: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#CCC",
        alignItems: "center",
    },
    btnCancelarText: { color: "#666", fontWeight: "600" },
    btnSalvar: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#6E9F1E",
        alignItems: "center",
    },
    btnSalvarText: { color: "#FFF", fontWeight: "700" },
});