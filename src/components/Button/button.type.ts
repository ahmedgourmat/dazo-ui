import type { ReactNode, Ref } from "react";
import type { StyleProp, TextStyle, ViewStyle, View } from "react-native";
import type { CommonProps } from '../../styles/commonStyling.type'

export interface ButtonProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
    /** On iOS and Android the Pressable; on web the <button> element. Use it to focus() the button. */
    ref?: Ref<View>
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