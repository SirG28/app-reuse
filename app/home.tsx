import React from "react";
import {ScrollView, StyleSheet, Text, View } from "react-native";
import HeaderHome from "../components/home/HeaderHome";
import UserSummaryCard from "../components/home/UserSummaryCard";
import SectionHeader from "../components/home/SectionHeader";
import ShortcutCard from "../components/home/ShortcutCard";
import ItemCard from "../components/home/ItemCard";
import BottomNav from "../components/home/BottomNav";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
                    <ItemCard />
                    <ItemCard />
                    <ItemCard />
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