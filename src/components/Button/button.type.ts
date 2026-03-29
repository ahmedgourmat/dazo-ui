import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface ButtonProps {
    label: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<ViewStyle>;
}