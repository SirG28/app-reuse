import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
    title,
    onPress,
    style,
}: PrimaryButtonProps) {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({

    /* Wrapper do botão: empurra pra baixo */ 
    buttonArea: { 
        marginTop: "auto", 
        paddingBottom: 24, 
    },
    
    button: {
        backgroundColor: "#639922",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
    },

    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffff",
    },
});