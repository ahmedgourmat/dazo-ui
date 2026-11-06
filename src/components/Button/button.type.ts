import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { CommonProps } from '../../styles/commonStyling.type'

export interface ButtonProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
    label: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    icon?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}