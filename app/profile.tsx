import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/ui/PrimaryButton";

type Usuario = {
    nome: string;
    email: string;
};

export default function ProfileScreen() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        carregarUsuario();
    }, []);

    async function carregarUsuario() {
        try {
            const usuarioSalvo = await AsyncStorage.getItem("@reuse_usuario");

            if (usuarioSalvo) {
                setUsuario(JSON.parse(usuarioSalvo));
            }
        } catch (error) {
            console.log("Erro ao carregar usuário:", error);
        }
    }

    async function handleLogout() {
        Alert.alert(
            "Sair da conta",
            "Deseja realmente sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("@reuse_logado");
                            await AsyncStorage.removeItem("@reuse_usuario");

                            router.replace("/login");
                        } catch (error) {
                            console.log("Erro ao deslogar:", error);
                            Alert.alert("Erro", "Não foi possível sair da conta.");
                        }
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>U</Text>
                </View>

                <Text style={styles.name}>{usuario?.nome ?? "Usuário"}</Text>
                <Text style={styles.email}>{usuario?.email ?? "Sem e-mail"}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Conta</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nome</Text>
                        <Text style={styles.infoValue}>{usuario?.nome ?? "Usuário"}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>E-mail</Text>
                        <Text style={styles.infoValue}>{usuario?.email ?? "-"}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sessão</Text>
                        <Text style={styles.infoValue}>Ativa</Text>
                    </View>
                </View>

                <PrimaryButton title="Sair da conta" onPress={handleLogout} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
    },

    header: {
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2F2F2F",
    },

    content: {
        flex: 1,
        padding: 20,
    },

    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: "#DCE8C2",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 16,
    },

    avatarText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#639922",
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2F2F2F",
        textAlign: "center",
        marginBottom: 4,
    },

    email: {
        fontSize: 14,
        color: "#6B6B6B",
        textAlign: "center",
        marginBottom: 28,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E6E2D9",
        padding: 16,
        marginBottom: 24,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2F2F2F",
        marginBottom: 14,
    },

    infoRow: {
        marginBottom: 12,
    },

    infoLabel: {
        fontSize: 13,
        color: "#7A7A7A",
        marginBottom: 2,
    },

    infoValue: {
        fontSize: 15,
        color: "#2F2F2F",
        fontWeight: "500",
    },
});