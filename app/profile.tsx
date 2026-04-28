import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { getCurrentUser, logout, User } from "../services/authService";

export default function ProfileScreen() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<User | null>(null);

    useEffect(() => {
        carregarUsuario();
    }, []);

    async function carregarUsuario() {
        const user = await getCurrentUser();
        setUsuario(user);
    }

    async function handleLogout() {
        Alert.alert("Sair da conta", "Deseja realmente sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                        router.replace("/login");
                    } catch (error) {
                        Alert.alert("Erro", "Não foi possível sair da conta.");
                    }
                },
            },
        ]);
    }

    const inicial = usuario?.name?.charAt(0).toUpperCase() ?? "U";

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{inicial}</Text>
                </View>

                <Text style={styles.name}>{usuario?.name ?? "Usuário"}</Text>
                <Text style={styles.email}>{usuario?.email ?? "Sem e-mail"}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Conta</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nome</Text>
                        <Text style={styles.infoValue}>
                            {usuario?.name ?? "Usuário"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>E-mail</Text>
                        <Text style={styles.infoValue}>{usuario?.email ?? "-"}</Text>
                    </View>

                    {usuario?.cidade ? (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Cidade</Text>
                            <Text style={styles.infoValue}>
                                {usuario.cidade}
                                {usuario.estado ? ` - ${usuario.estado}` : ""}
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sessão</Text>
                        <Text style={styles.infoValue}>Ativa</Text>
                    </View>
                </View>

                <PrimaryButton
                    title="Meus Itens"
                    onPress={() => router.push("/myItems")}
                />
                <SecondaryButton title="Sair da conta" onPress={handleLogout} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F5" },
    header: {
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5E5",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
    content: { flex: 1, padding: 20, gap: 8 },
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
    avatarText: { fontSize: 28, fontWeight: "700", color: "#639922" },
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
    infoRow: { marginBottom: 12 },
    infoLabel: { fontSize: 13, color: "#7A7A7A", marginBottom: 2 },
    infoValue: { fontSize: 15, color: "#2F2F2F", fontWeight: "500" },
});