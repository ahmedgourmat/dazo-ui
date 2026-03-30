import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ButtonProps {
    label: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}