import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import HeaderHome from "../components/home/HeaderHome";
import UserSummaryCard from "../components/home/UserSummaryCard";
import SectionHeader from "../components/home/SectionHeader";
import ShortcutCard from "../components/home/ShortcutCard";
import ItemCard from "../components/home/ItemCard";
import BottomNav from "../components/home/BottomNav";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ITENS_FICTÍCIOS = [
    {
        id: "1",
        imagem: require("../assets/images/quadro1.jpg"),
        titulo: "Quadro Leão",
        descricao: "Quadro com leão em técnica realista, moldura de madeira escura.",
        troca: "Quadros decorativos ou esculturas",
    },
    {
        id: "2",
        imagem: require("../assets/images/quadro2.jpg"),
        titulo: "Arte Abstrata",
        descricao: "Arte abstrata com folhas tropicais, cores terrosas e verdes.",
        troca: "Plantas ou outros quadros abstratos",
    },
    {
        id: "3",
        imagem: require("../assets/images/quadro3.jpg"),
        titulo: "Flores Realistas",
        descricao: "Quadro com tulipas vermelhas, amarelas e brancas em aquarela.",
        troca: "Vasos, flores artificiais ou quadros florais",
    },
];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderHome />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <UserSummaryCard />

                <SectionHeader title="Atalhos" />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.shortcutsRow}
                >
                    <ShortcutCard
                        title="Publicar Item"
                        xp="+ 50 XP"
                        icon="+"
                        onPress={() => router.push("/PublicItem")}
                    />
                    <ShortcutCard title="Realizar Troca" xp="+ 100 XP" icon="⇄" />
                    <ShortcutCard title="Ranking" xp="+ 20 XP" icon="🏆" />
                </ScrollView>

                <SectionHeader title="Itens para trocar" actionText="Ver todos" />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsRow}
                >
                    {ITENS_FICTÍCIOS.map((item) => (
                        <ItemCard
                            key={item.id}
                            imagem={item.imagem}
                            titulo={item.titulo}
                            descricao={item.descricao}
                            troca={item.troca}
                        />
                    ))}
                </ScrollView>
            </ScrollView>

            <BottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 100,
    },
    shortcutsRow: {
        paddingBottom: 18,
        gap: 10,
    },
    itemsRow: {
        paddingBottom: 18,
        gap: 12,
    },
});