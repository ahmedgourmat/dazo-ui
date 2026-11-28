import { useId, useMemo, useState, type JSX } from 'react'
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import { useFieldStyles, VALUE_SIZE } from '../../hooks/field.hooks'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import { useReducedMotion } from '../../hooks/motion'
import { DISABLED_OPACITY, focusRing, type InteractionState } from '../../styles/interaction'
import type { SelectProps, SelectOption } from './select.type'
import { formFieldProps, useFormField } from '../FormField/form-field.context'
import { spaceKeyActivates } from '../../hooks/keyboard'
import { useControllableState } from '../../hooks/controllable'
import { FieldSkeleton } from '../Skeleton/field-skeleton'
import { withSkeleton } from '../Skeleton/with-skeleton'

const SelectBase = ({
  ref,
  testID,
  label,
  placeholder = 'Select an option',
  value,
  defaultValue,
  options,
  onChange,
  disabled: disabledProp = false,
  size = 'md',
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  ...commonProps
}: SelectProps): JSX.Element => {
  const theme = useTheme()
  const { colors, space } = theme
  const commonStyles = useCommonStyles(commonProps)
  const formField = useFormField()
  const disabled = disabledProp || Boolean(formField?.disabled)
  const field = useFieldStyles({ size, disabled, invalid: formField?.invalid })
  const valueId = useId()
  const reduceMotion = useReducedMotion()
  useFocusVisibleTracking()
  const [open, setOpen] = useState(false)
  // null is a controlled "nothing selected", so a form can clear the field.
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue ?? null)

  const selectedOption = useMemo<SelectOption | undefined>(
    () => options.find((option) => option.value === selected),
    [options, selected],
  )

  const displayValue = selectedOption?.label ?? placeholder
  const menuName = label ?? placeholder
  // Rows are easier to tap on a phone, and more compact under a mouse.
  const optionHeight = Platform.OS === 'web' ? theme.controlHeight.md : theme.controlHeight.lg

  return (
    <>
      <Pressable
        ref={ref}
        testID={testID}
        onPress={disabled ? undefined : () => setOpen(true)}
        disabled={disabled}
        // No aria-label: the name comes from the visible label and value
        // ("Plan Pro"), so voice-control users can say what they see.
        role='button'
        aria-expanded={open}
        aria-disabled={disabled}
        {...formFieldProps(formField, 'value', { valueId, value: displayValue })}
        hitSlop={field.hitSlop}
        style={({ hovered, focused }: InteractionState) => [
          styles.container,
          field.box,
          hovered && field.hovered,
          commonStyles,
          style,
          isFocusVisible(focused) && field.focused,
        ]}
      >
        {leftIcon ? <View style={[styles.leftIcon, { marginLeft: field.content.paddingHorizontal }]}>{leftIcon}</View> : null}
        <View style={[styles.content, field.content]}>
          {label ? <Text style={[field.label, labelStyle]}>{label}</Text> : null}
          <Text nativeID={valueId} style={[field.value, !selectedOption && { color: field.placeholderColor }]} numberOfLines={1}>
            {displayValue}
          </Text>
        </View>
        <View style={[styles.rightIcon, { marginRight: field.content.paddingHorizontal }]}>
          {rightIcon ?? (
            // Decoration: aria-expanded already says this opens a menu.
            <Text aria-hidden style={{ color: field.iconColor, fontSize: theme.fontSize.sm }}>{'▾'}</Text>
          )}
        </View>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType={reduceMotion ? 'none' : 'fade'}
        onRequestClose={() => setOpen(false)}
        // On web, react-native-web turns the modal into a dialog once it has
        // opened; this gives that dialog a name. React Native's Modal type
        // doesn't list the prop, and iOS/Android ignore it.
        {...({ 'aria-label': menuName } as object)}
      >
        <View style={[styles.overlay, { padding: space[5] }]}>
          {/* The menu comes first so that, on web, opening moves focus to the
              first option rather than to the backdrop. */}
          <View
            style={[
              styles.menu,
              theme.shadow.lg,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderWidth: theme.borderWidth.thin,
                borderRadius: theme.radius.lg,
                padding: space[1],
              },
            ]}
          >
            {/* One choice out of many, like Android's own single-choice dialogs. */}
            <View role='radiogroup' aria-label={menuName}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === selected
                const pick = () => {
                  setSelected(item.value)
                  onChange?.(item.value)
                  setOpen(false)
                }

                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={pick}
                    role='radio'
                    aria-checked={isSelected}
                    aria-disabled={Boolean(item.disabled)}
                    {...spaceKeyActivates(pick, item.disabled)}
                    style={({ hovered, pressed, focused }: InteractionState) => [
                      styles.option,
                      {
                        minHeight: optionHeight,
                        paddingHorizontal: space[3],
                        borderRadius: theme.radius.sm,
                      },
                      (isSelected || hovered || pressed) && !item.disabled && { backgroundColor: colors.secondary },
                      item.disabled && { opacity: DISABLED_OPACITY },
                      // Inside the row: the menu clips anything outside it.
                      isFocusVisible(focused) && [focusRing(theme), { outlineOffset: -2 }],
                    ]}
                  >
                    {item.icon ? <View style={styles.optionIcon}>{item.icon}</View> : null}
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: colors.foreground,
                          fontSize: theme.fontSize.base,
                          lineHeight: theme.leading.base,
                          fontFamily: isSelected ? theme.fontFamily.medium : theme.fontFamily.regular,
                          fontWeight: isSelected ? theme.fontWeight.medium : theme.fontWeight.regular,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {/* The selected option is marked by more than its color. */}
                    {isSelected ? (
                      <Text aria-hidden style={{ color: colors.foreground, fontSize: theme.fontSize.sm, marginLeft: space[2] }}>{'✓'}</Text>
                    ) : null}
                  </Pressable>
                )
              }}
            />
            </View>
          </View>
          {/* Tapping outside the menu closes it. The backdrop sits behind the
              menu and is hidden from screen readers; they close the menu by
              picking an option, Escape (web) or Back (Android). */}
          <Pressable
            style={[StyleSheet.absoluteFill, styles.backdrop]}
            onPress={() => setOpen(false)}
            accessible={false}
            aria-hidden
            tabIndex={-1}
          />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  // The content's padding already spaces the icons from the text.
  leftIcon: {
    marginRight: -4,
  },
  rightIcon: {
    marginLeft: -4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  // Fills the overlay (absoluteFill) behind the menu.
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    zIndex: 1,
    overflow: 'hidden',
    maxHeight: 320,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
  },
  optionIcon: {
    marginRight: 8,
  },
})

// Inside <Skeleton loading>: the field's box, as high as with its label.
const SelectSkeleton = (props: SelectProps): JSX.Element => {
  const theme = useTheme()
  const size = props.size ?? 'md'
  const withLabel = props.label
    ? 2 * theme.space[1.5] + theme.leading.xs + theme.leading[VALUE_SIZE[size]] + 2 * theme.borderWidth.thin
    : 0
  return <FieldSkeleton props={props} height={Math.max(theme.controlHeight[size], withLabel)} />
}

export const Select: (props: SelectProps) => JSX.Element = withSkeleton(SelectBase, SelectSkeleton)
