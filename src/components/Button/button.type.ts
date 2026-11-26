import type { ReactNode, Ref } from "react";
import type { StyleProp, TextStyle, ViewStyle, View } from "react-native";
import type { CommonProps } from '../../styles/commonStyling.type'

export interface ButtonProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
    /** The Pressable (a <button> element on web). Use it to focus() the button. */
    ref?: Ref<View>
    label: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    icon?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    /** solid: primary action. secondary: muted surface. outline: bordered. ghost: no surface until hovered. */
    variant?: 'solid' | 'secondary' | 'outline' | 'ghost';
    /** Height 32 / 40 / 48 / 56. Default md. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}