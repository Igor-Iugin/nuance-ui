# Graph Report - .  (2026-07-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1845 nodes · 3768 edges · 133 communities (123 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.58)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5bcbe7c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ui/table.vue
- devDependencies
- BoxProps
- chip.vue
- tooltip.vue
- time-picker.vue
- checkbox/checkbox.vue
- runtime/utils/index.ts
- dialog-root.vue
- FieldBaseProps
- combobox-options-dropdown.vue
- date-picker.vue
- calendar-month.vue
- tabs-root.vue
- menu/menu.vue
- components/scroll-area.vue
- ModalManager
- menu-sub.vue
- handlers.ts
- types/index.ts
- getThemeColor
- combobox-option.vue
- select.vue
- notification.vue
- package.json
- accordion/accordion.vue
- app-shell/index.ts
- dialog-close-button.vue
- box.vue
- collapse.vue
- menu-sub-item.vue
- menu-sub-dropdown.vue
- NuanceGradient
- nav-icon-link.vue
- calendar-root.vue
- input-base.vue
- tree-item.vue
- dependencies
- exports
- avatar/avatar.vue
- calendar-decade.vue
- combobox/lib/context.ts
- date-time-picker.vue
- calendar-year.vue
- drawer-root.vue
- progress-section.vue
- roving-focus/lib/context.ts
- switch-group.vue
- tree/types.ts
- modals.vue
- action-icon/action-icon.vue
- Classes
- use-calendar-selection.ts
- notifications-provider.vue
- peerDependencies
- keywords
- devDependencies
- history-sidebar.vue
- app-shell.vue
- tree/lib/context.ts
- title.vue
- menu-checkbox-item.vue
- menu-search.vue
- menu-radio-item.vue
- composables/index.ts
- notification-container.vue
- components/breadcrumbs.vue
- accordion-header.vue
- core/index.ts
- floating-indicator.vue
- number-input.vue
- playground/package.json
- components/index.ts
- text-input.vue
- components/segmented-control.vue
- transition.vue
- tree-root.vue
- scripts
- InputWrapperProps
- menu-target.vue
- menu-selectable-item.vue
- switch.vue
- NotificationsStore
- notifications/index.ts
- combobox-root.vue
- dialog/index.ts
- file-upload-button.vue
- file-upload-icon.vue
- useConfig
- confirm-modal.vue
- pages/table.vue
- pages/timeline.vue
- accordion-item.vue
- accordion-panel.vue
- components/alert.vue
- dialog-header.vue
- dialog-section.vue
- password-input.vue
- text.vue
- notifications/types.ts
- tabs-tab.vue
- nav-link.vue
- modals/index.ts
- get-mod.ts
- pages/scroll-area.vue
- pages/segmented-control.vue
- components/badge.vue
- roving-focus.vue
- pages/form.vue
- pages/menu.vue
- table.d.ts
- use-countdown.ts
- text-field.vue
- file.vue
- global.d.ts
- @nuxtjs/stylelint-module
- pages/accordion.vue
- collapsible.vue
- pages/progress.vue
- .stylelintrc.mjs

## God Nodes (most connected - your core abstractions)
1. `BoxProps` - 118 edges
2. `NuanceSize` - 68 edges
3. `AnyString` - 67 edges
4. `NuanceColor` - 58 edges
5. `NuanceRadius` - 54 edges
6. `Classes` - 38 edges
7. `getSize()` - 34 edges
8. `useConfig()` - 33 edges
9. `useVarsResolver()` - 29 edges
10. `ButtonProps` - 27 edges

## Surprising Connections (you probably didn't know these)
- `handleConfirm()` --calls--> `openConfirmModal`  [EXTRACTED]
  playground/app/pages/modals.vue → src/runtime/modals/_confirm-modal/index.ts
- `handleDelete()` --calls--> `openConfirmModal`  [EXTRACTED]
  playground/app/pages/modals.vue → src/runtime/modals/_confirm-modal/index.ts
- `handleWizard()` --calls--> `openConfirmModal`  [EXTRACTED]
  playground/app/pages/modals.vue → src/runtime/modals/_confirm-modal/index.ts
- `ActivityItem` --inherits--> `TimelineItem`  [EXTRACTED]
  playground/app/pages/timeline.vue → src/runtime/components/timeline.vue
- `handleLoad()` --calls--> `findTreeItem()`  [EXTRACTED]
  playground/app/pages/tree.vue → src/runtime/utils/tree.ts

## Import Cycles
- 3-file cycle: `src/runtime/components/index.ts -> src/runtime/components/progress/index.ts -> src/runtime/components/progress/progress-root.vue -> src/runtime/components/index.ts`
- 3-file cycle: `src/runtime/components/index.ts -> src/runtime/components/progress/index.ts -> src/runtime/components/progress/progress-section.vue -> src/runtime/components/index.ts`
- 3-file cycle: `src/runtime/components/avatar/avatar.vue -> src/runtime/components/index.ts -> src/runtime/components/avatar/index.ts -> src/runtime/components/avatar/avatar.vue`
- 3-file cycle: `src/runtime/components/calendar/types.ts -> src/runtime/components/calendar/ui/core/index.ts -> src/runtime/components/calendar/ui/core/calendar-root.vue -> src/runtime/components/calendar/types.ts`
- 3-file cycle: `src/runtime/components/input/ui/spin-input.vue -> src/runtime/components/time-picker/index.ts -> src/runtime/components/time-picker/time-picker.vue -> src/runtime/components/input/ui/spin-input.vue`
- 3-file cycle: `src/runtime/components/button/unstyled-button.vue -> src/runtime/components/input/index.ts -> src/runtime/components/input/ui/button-input.vue -> src/runtime/components/button/unstyled-button.vue`
- 4-file cycle: `src/runtime/components/index.ts -> src/runtime/components/progress/index.ts -> src/runtime/components/progress/progress.vue -> src/runtime/components/progress/progress-root.vue -> src/runtime/components/index.ts`
- 4-file cycle: `src/runtime/components/index.ts -> src/runtime/components/progress/index.ts -> src/runtime/components/progress/progress.vue -> src/runtime/components/progress/progress-section.vue -> src/runtime/components/index.ts`
- 4-file cycle: `src/runtime/components/index.ts -> src/runtime/components/notification.vue -> src/runtime/components/progress/progress.vue -> src/runtime/components/progress/progress-root.vue -> src/runtime/components/index.ts`
- 4-file cycle: `src/runtime/components/index.ts -> src/runtime/components/notification.vue -> src/runtime/components/progress/progress.vue -> src/runtime/components/progress/progress-section.vue -> src/runtime/components/index.ts`
- 4-file cycle: `src/runtime/components/calendar/lib/use-calendar-selection.ts -> src/runtime/components/calendar/types.ts -> src/runtime/components/calendar/ui/core/index.ts -> src/runtime/components/calendar/ui/core/calendar-root.vue -> src/runtime/components/calendar/lib/use-calendar-selection.ts`
- 4-file cycle: `src/runtime/components/input/index.ts -> src/runtime/components/input/ui/spin-input.vue -> src/runtime/components/time-picker/index.ts -> src/runtime/components/time-picker/time-picker.vue -> src/runtime/components/input/index.ts`
- 5-file cycle: `src/runtime/composables/index.ts -> src/runtime/composables/use-config.ts -> src/runtime/utils/index.ts -> src/runtime/utils/date/index.ts -> src/runtime/utils/date/create-months.ts -> src/runtime/composables/index.ts`

## Communities (133 total, 10 thin omitted)

### Community 0 - "ui/table.vue"
Cohesion: 0.05
Nodes (47): createRowHandlers(), processColumns(), resolveValue(), valueUpdater(), DynamicCellSlots, DynamicFooterSlots, DynamicHeaderSlots, TableClasses (+39 more)

### Community 1 - "devDependencies"
Cohesion: 0.04
Nodes (51): @antfu/eslint-config, changelogen, eslint, happy-dom, @nuxt/devtools, @nuxt/eslint, @nuxt/eslint-config, @nuxt/image (+43 more)

### Community 2 - "BoxProps"
Cohesion: 0.11
Nodes (47): ActionIconProps, AlertProps, AvatarProps, AvatarGroupProps, BackgroundImageProps, BadgeProps, BoxProps, BreadcrumbsProps (+39 more)

### Community 3 - "chip.vue"
Cohesion: 0.06
Nodes (40): { checked, onUpdate }, ChipVariant, ChipVars, ctx, disabled, ChipGroupProps, {
	multiple = false,
	disabled,
	name,
}, value (+32 more)

### Community 4 - "tooltip.vue"
Cohesion: 0.06
Nodes (37): injectionKey, PopoverState, usePopoverState, [useProvide, useState], useProvidePopoverState, getArrowPosition(), horizontalSide(), radiusByFloatingSide (+29 more)

### Community 5 - "time-picker.vue"
Cohesion: 0.08
Nodes (36): date, otp, select, time, arrowsMax, emit, handleKeyDown(), maxDigit (+28 more)

### Community 6 - "checkbox/checkbox.vue"
Cohesion: 0.06
Nodes (38): checked, ctx, disabled, modelValue, style, {
	withBorder,
	value,
	mod,
	radius,
	disabled: _disabled,
}, CheckboxVariant, CheckboxVars (+30 more)

### Community 7 - "runtime/utils/index.ts"
Cohesion: 0.09
Nodes (25): { radius, src, ...rest }, style, FONT_FAMILY, size(), ButtonClasses, ButtonVars, {
	is = 'button',
	variant = 'default',
	leftSectionPE = 'none',
	rightSectionPE = 'all',
	mod,
	icon,
	loading,
	classes,
	rightSectionProps,
	active,
	activeMode = 'pressed',
	activeVariant,
	activeColor = 'primary',
	...props
}, resolvedVariant (+17 more)

### Community 8 - "dialog-root.vue"
Cohesion: 0.08
Nodes (30): StyleProps, CardProps, { is = 'article', padding, ...rest }, style, dialogRef, emit, open(), opened (+22 more)

### Community 9 - "FieldBaseProps"
Cohesion: 0.08
Nodes (24): CheckboxGroupProps, SwitchGroupProps, CheckboxFieldProps, {
	checked,
	errorMessage,
	handleChange,
	meta,
}, {
	name,
	rules,
	validateOn = 'change',
	checked: initialValue,
	controlled = true,
	...props
}, CheckboxGroupFieldProps, {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
}, {
	value,
	errorMessage,
	handleChange,
	meta,
} (+16 more)

### Community 10 - "combobox-options-dropdown.vue"
Cohesion: 0.14
Nodes (21): ComboboxEmptyProps, props, ComboboxOptionListProps, { labelledBy, mod, ...rest }, ComboboxOptionsDropdownProps, {
	data,
	labelId,
	nothingFoundMessage = 'Нет вариантов',
	withCheckIcon = true,
	filterOptions = true,
	iconPosition,
	checkIcon,
	filter,
	limit,
}, filteredData, isEmpty (+13 more)

### Community 11 - "date-picker.vue"
Cohesion: 0.11
Nodes (23): CalendarProps, [calendars, nav], date, level, props, select, LEVEL_ORDER, useCalendarNavigation() (+15 more)

### Community 12 - "calendar-month.vue"
Cohesion: 0.11
Nodes (16): ctx, emit, handleSelect(), isDisabled(), isOutside(), isWeekend(), {
	month,
	size,
	withWeekNumbers,
	withCellSpacing = true,
}, selection (+8 more)

### Community 13 - "tabs-root.vue"
Cohesion: 0.11
Nodes (19): getSafeId(), TabsContext, [
	useProvide,
	useState,
], useProvideTabsContext, useTabsState, ctx, { is = 'header', mod, grow, justify, ...rest }, style (+11 more)

### Community 14 - "menu/menu.vue"
Cohesion: 0.11
Nodes (17): activeSubClose, close(), ctx, MenuDividerProps, emit, hasSearch, injectionKey, ctx (+9 more)

### Community 15 - "components/scroll-area.vue"
Cohesion: 0.11
Nodes (19): atEdge, checkEdge(), composedOverscroll, contentRef, Edge, emitEdge(), emits, {
	mod,
	classes,
	scrollbars = 'y',
	type = 'hover',
	scrollbarSize,
	offsetScrollbars = false,
	overscrollBehavior,
	scrollHideDelay = 1000,
	startScrollPosition,
	viewportProps,
	autoSize,
	...rest
} (+11 more)

### Community 16 - "ModalManager"
Cohesion: 0.10
Nodes (9): handleLoad(), mockTreeData, ModalManager, filterTree(), findTreeItem(), flatTree(), removeTreeNodes(), traverse() (+1 more)

### Community 17 - "menu-sub.vue"
Cohesion: 0.10
Nodes (14): useDelayedHover(), activeChildClose, id, menu, MenuSubProps, {
	open: openWithDelay,
	close: closeWithDelay,
}, opened, parentContext (+6 more)

### Community 18 - "handlers.ts"
Cohesion: 0.21
Nodes (17): COMBOBOX_ATTRS, ComboboxAttrs, getFirstIndex(), getNextIndex(), getPreviousIndex(), clearSelected(), ComboboxHandlerOptions, DefaultFn (+9 more)

### Community 19 - "types/index.ts"
Cohesion: 0.10
Nodes (16): { is = 'kbd', size, ...rest }, KbdVars, style, ctx, {
	mod,
	icon,
	trailingIcon,
	description,
	color,
	disabled,
	active,
	staticRSection,
	...rest
}, style, currentStepIx, {
	items,
	radius = 'full',
	align = 'left',
	size,
	lineWidth = 4,
	gap,
	color,
	classes,
	mod,
	reverse,
	orientation = 'vertical',
	valueKey = 'value',
	...rest
} (+8 more)

### Community 20 - "getThemeColor"
Cohesion: 0.21
Nodes (14): CssVariable, NuanceColorShade, NuanceTheme, getColorVar(), getGradient(), getGradientOutline(), getThemeColor(), parseThemeColor() (+6 more)

### Community 21 - "combobox-option.vue"
Cohesion: 0.15
Nodes (16): ComboboxGroupProps, {
	label,
	mod,
	data,
	iconPosition,
	checkIcon,
	withCheckIcon,
	...rest
}, uid, value, ComboboxOptionProps, {
	data,
	iconPosition = 'left',
	checkIcon,
	withCheckIcon = true,
	mod: _mod,
	checked,
	selected,
}, { icons }, mod (+8 more)

### Community 22 - "select.vue"
Cohesion: 0.12
Nodes (17): ComboboxData, ComboboxRootEmits, display, emit, focused, { icons }, inputValue, opened (+9 more)

### Community 23 - "notification.vue"
Cohesion: 0.11
Nodes (13): loaders, LoaderType, LoaderVars, { size, color, type = 'oval' }, style, NotificationAction, NotificationClasses, NotificationOrientation (+5 more)

### Community 24 - "package.json"
Cohesion: 0.11
Nodes (18): description, files, license, main, name, optional, peerDependenciesMeta, nuxt (+10 more)

### Community 25 - "accordion/accordion.vue"
Cohesion: 0.14
Nodes (15): AccordionProps, AccordionValue, AccordionVars, {
	mod,
	loop = true,
	variant = 'default',
	transitionDuration = 200,
	disableChevronRotation,
	chevronPosition = 'right',
	chevronSize,
	chevron,
	disabled,
	order,
	radius,
	keepMounted = true,
	classes,
	...rest
}, state, style, uid, value (+7 more)

### Community 26 - "app-shell/index.ts"
Cohesion: 0.11
Nodes (11): { is = 'aside', ...rest }, { is = 'footer', ...rest }, { is = 'header', ...rest }, { is = 'main', ...rest }, { is = 'nav', ...rest }, AppShellSectionProps, { is = 'section', mod, grow, ...rest }, AppShellState (+3 more)

### Community 27 - "dialog-close-button.vue"
Cohesion: 0.13
Nodes (12): ActionIconGroupProps, {
	is,
	mod,
	orientation = 'horizontal',
	...rest
}, injectionKey, useDialogState, [useProvide, useState], useProvideDialogState, close, { icons } (+4 more)

### Community 28 - "box.vue"
Cohesion: 0.11
Nodes (12): mod, props, style, theme, STYLE_MAP, ButtonGroupProps, {
	is,
	mod,
	orientation = 'horizontal',
	...rest
}, CardSectionProps (+4 more)

### Community 29 - "collapse.vue"
Cohesion: 0.12
Nodes (16): collapse(), CollapseClasses, CollapseProps, CollapseSlots, CollapseTriggerProps, contentId, dataState, {
	disabled,
	keepMounted = true,
	transitionDuration = 200,
	transitionTimingFunction = 'ease',
	animateOpacity = true,
	mod,
	classes,
	...rest
} (+8 more)

### Community 30 - "menu-sub-item.vue"
Cohesion: 0.13
Nodes (13): createItemKeydownHandler(), getSiblings(), ctx, {
	disabled,
	closeMenuOnClick,
	...rest
}, MenuItemProps, onKeyDown, sub, ctx (+5 more)

### Community 31 - "menu-sub-dropdown.vue"
Cohesion: 0.16
Nodes (15): getItemText(), isRepeatedChar(), useTypeAhead(), UseTypeAheadOptions, ctx, dropdown, getDropdown(), onKeyDown() (+7 more)

### Community 32 - "NuanceGradient"
Cohesion: 0.23
Nodes (9): ModuleOptions, AppConfig, AppConfigInput, @nuxt/schema, NuanceIcons, NuanceGradient, ActiveVariantsMap, DEFAULT_ACTIVE_VARIANTS (+1 more)

### Community 33 - "nav-icon-link.vue"
Cohesion: 0.16
Nodes (11): linkProps, NuxtLinkParams, pickLinkProps(), { link, rest }, LinkButtonProps, props, { link, rest: { underline, ...rest } }, LinkProps (+3 more)

### Community 34 - "calendar-root.vue"
Cohesion: 0.17
Nodes (15): injectionKey, [Provide, Inject], State, useCalendarState, useProvideCalendarState, CalendarRootProps, config, date (+7 more)

### Community 35 - "input-base.vue"
Cohesion: 0.20
Nodes (12): injectionKey, useInputWrapperState, [useProvide, useState], useProvideInputWrapper, WrapperContext, InputVariant, api, props (+4 more)

### Community 36 - "tree-item.vue"
Cohesion: 0.12
Nodes (16): TreeItem, active, ctx, data, { data: state, pending, execute }, expanded, { handleClick, handleKeyDown }, { icon: fileIcon, color } (+8 more)

### Community 37 - "dependencies"
Cohesion: 0.13
Nodes (16): defu, es-toolkit, @formkit/tempo, dependencies, defu, es-toolkit, @floating-ui/vue, @formkit/tempo (+8 more)

### Community 38 - "exports"
Cohesion: 0.12
Nodes (16): import, types, import, types, exports, ./components, ./composables, ./modals (+8 more)

### Community 39 - "avatar/avatar.vue"
Cohesion: 0.15
Nodes (13): AvatarClasses, AvatarVariant, AvatarVars, ctx, { icons, variantResolver }, initials, {
	name,
	radius,
	placeholder,
	color,
	variant,
	allowedInitialsColors,
	gradient,
	size,
	classes,
	mod,
	src,
	...rest
}, resolvedPlaceholder (+5 more)

### Community 40 - "calendar-decade.vue"
Cohesion: 0.14
Nodes (10): ctx, currentYear, {
	date,
	size,
	selectable,
}, emit, handleSelect(), isDisabled(), selection, startYear (+2 more)

### Community 41 - "combobox/lib/context.ts"
Cohesion: 0.17
Nodes (12): { store, dropdownPadding }, style, aria, ComboboxTargetProps, { store: { targetRef } }, {
	withAriaAttributes = true,
	withExpandedAttribute = true,
	withKeyboardNavigation = true,
	targetType = 'input',
	autoComplete = 'off',
}, injectionKey, useComboboxState (+4 more)

### Community 42 - "date-time-picker.vue"
Cohesion: 0.12
Nodes (13): config, date, disabled, {
	format: lFormat,
	calendarProps,
	timePickerProps,

	rightSectionPE = 'all',

	withSeconds = false,
	clearable = false,

	...props
}, { icons }, isClearable, model, time (+5 more)

### Community 43 - "calendar-year.vue"
Cohesion: 0.15
Nodes (10): useCalendarSelectionState, ctx, dateYear, emit, handleSelect(), isDisabled(), isToday(), monthList (+2 more)

### Community 44 - "drawer-root.vue"
Cohesion: 0.18
Nodes (11): DialogEmits, DialogModel, DialogRootProps, DrawerRootProps, OmittedDialogRootProps, opened, {
	position = 'left',
	withoutOverlay = false,
	withinPortal = false,
	closeOnClickOutside = true,
	mod,
	classes,
	...rest
}, transition (+3 more)

### Community 45 - "progress-section.vue"
Cohesion: 0.17
Nodes (11): {
	mod,
	size,
	color,
	radius,
	striped,
	animated,
	withAria,
	orientation,
	transitionDuration,
}, ProgressProps, {
	orientation,
	mod,
	size,
	radius,
	transitionDuration,
	is,
	...rest
}, style, ariaAttributes, ProgressSectionProps, ProgressSectionVars, style (+3 more)

### Community 46 - "roving-focus/lib/context.ts"
Cohesion: 0.17
Nodes (11): injectionKey, SELECT_ATTR, State, [useProvide, useState], useRovingFocus, attrs, isHorizontal, isVertical (+3 more)

### Community 47 - "switch-group.vue"
Cohesion: 0.16
Nodes (11): injectionKey, SwitchGroupState, [useProvide, useState], useProvideSwitchGroup, useSwitchGroupState, id, {
	size,
	name,
	disabled,
	readOnly,
	maxSelectedValues,
	...rest
}, value (+3 more)

### Community 48 - "tree/types.ts"
Cohesion: 0.17
Nodes (11): filterTreeItems(), active, {
	color,
	variant = 'subtle',
	size = 'md',
	loadBranch,
	filter = 'directory',
	...props
}, { data: state, execute }, expanded, root, selected, TreeEmits (+3 more)

### Community 49 - "modals.vue"
Cohesion: 0.19
Nodes (12): handleConfirm(), handleDelete(), handleWizard(), historyData, innerOpen, outerOpen, parallelLog, result (+4 more)

### Community 50 - "action-icon/action-icon.vue"
Cohesion: 0.19
Nodes (12): ActionIconClasses, ActionIconSize, ActionIconVariant, ActionIconVars, {
	is = 'button',
	color = 'gray',
	size,
	iconSize,
	variant = 'default',
	gradient,
	loading,
	classes,
	radius,
	mod,
	icon,
	disabled,
	active,
	activeMode = 'pressed',
	activeVariant,
	activeColor = 'primary',
	...rest
}, ActionIconSectionProps, ActionIconSectionVars, {
	is,
	mod,
	gradient,
	radius,
	size,
	variant = 'default',
	color,
} (+4 more)

### Community 51 - "Classes"
Cohesion: 0.21
Nodes (11): { is = 'button', ...props }, UnstyledButtonProps, DatePickerProps, TextInputProps, InputBaseProps, ButtonInputProps, { classes, ...props }, model (+3 more)

### Community 52 - "use-calendar-selection.ts"
Cohesion: 0.19
Nodes (11): injectionKey, [Provide, Inject], useCalendarSelection(), UseCalendarSelectionProps, UseCalendarSelectionReturn, useProvideCalendarState, DateSelection, createStrictInjection() (+3 more)

### Community 53 - "notifications-provider.vue"
Cohesion: 0.16
Nodes (11): grouped, hoveredId, NotificationProviderProps, { notifications }, {
	position = 'bottom-right',
	autoClose = 4000,
	limit = 5,
	zIndex = 1,
	containerWidth = 440,
	transitionDuration = 250,
	pauseOnHover = 'all',
}, POSITIONS, ProviderVars, style (+3 more)

### Community 54 - "peerDependencies"
Cohesion: 0.15
Nodes (13): @nuxt/kit, @nuxt/icon, @nuxtjs/color-mode, @nuxt/icon, @nuxtjs/color-mode, peerDependencies, @nuxt/icon, @nuxt/kit (+5 more)

### Community 55 - "keywords"
Cohesion: 0.15
Nodes (13): nuxt, typescript, keywords, nuxt, component library, nuance-ui, nuxt, ui (+5 more)

### Community 56 - "devDependencies"
Cohesion: 0.15
Nodes (13): postcss-preset-mantine, postcss-simple-vars, postcss-preset-mantine, postcss-simple-vars, devDependencies, postcss, postcss-preset-mantine, postcss-simple-vars (+5 more)

### Community 57 - "history-sidebar.vue"
Cohesion: 0.17
Nodes (11): { data }, FormData, { handleSubmit }, onSubmit, result, schema, commands, cursor (+3 more)

### Community 58 - "app-shell.vue"
Cohesion: 0.18
Nodes (11): AppShellProps, AppShellVars, {
	is,
	mod,
	hideAside,
	hideFooter,
	hideHeader,
	hideNavbar,
	dateConfig,
	withBorder,
	layout = 'default',
	...rest
}, route, style, aside, footer, header (+3 more)

### Community 59 - "tree/lib/context.ts"
Cohesion: 0.22
Nodes (12): ButtonVariant, EventType, injectionKey, SelectMode, TreeContext, TreeState, [useProvide, useState], TreeProps (+4 more)

### Community 60 - "title.vue"
Cohesion: 0.22
Nodes (8): DialogTitleProps, { size = 'md', lh = '1', ...props }, DrawerTitleProps, props, props, {
	order = '2',
	textWrap,
	size,
	ff = 'headings',
	...rest
}, style, TitleProps

### Community 61 - "menu-checkbox-item.vue"
Cohesion: 0.17
Nodes (9): MenuCheckboxGroupState, model, [provideCheckboxGroup, useCheckboxGroup], useMenuCheckboxGroupState, checked, group, localChecked, MenuCheckboxItemProps (+1 more)

### Community 62 - "menu-search.vue"
Cohesion: 0.26
Nodes (12): clearActive(), ctx, getActiveIndex(), getDropdown(), getItems(), inputRef, MenuSearchProps, onKeyDown() (+4 more)

### Community 63 - "menu-radio-item.vue"
Cohesion: 0.17
Nodes (10): MenuSelectableItemProps, MenuRadioGroupState, model, [provideRadioGroup, useRadioGroup], useMenuRadioGroupState, checked, group, localChecked (+2 more)

### Community 64 - "composables/index.ts"
Cohesion: 0.21
Nodes (7): { icons }, props, theme, ThemeInstance, useTheme(), useVarsResolver(), TransformVars

### Community 65 - "notification-container.vue"
Cohesion: 0.19
Nodes (7): createId(), getAutoClose(), duration, emit, { progress }, props, global

### Community 66 - "components/breadcrumbs.vue"
Cohesion: 0.17
Nodes (10): itemsWithIcons, manualItems, breadcrumbs, BreadcrumbsItem, { icons }, inactive, {
	is = 'ol',
	mod,
	spacing,
	separator: _separator,
	color = 'primary',
	variant = 'subtle',
	size = 'compact-sm',
	items,
	...rest
}, separator (+2 more)

### Community 67 - "accordion-header.vue"
Cohesion: 0.17
Nodes (10): AccordionHeaderProps, AccordionHeaderSlots, chevronIcon, headerId, { icons }, { is, icon, chevron, ...rest }, item, panelId (+2 more)

### Community 68 - "core/index.ts"
Cohesion: 0.33
Nodes (5): CalendarHeaderProps, { icons }, {
	is = 'header',
	prevIcon,
	nextIcon,
	withPrev = true,
	withNext = true,
	nextDisabled,
	prevDisabled,
	disabled,
	...rest
}, resolvedNextIcon, resolvedPrevIcon

### Community 69 - "floating-indicator.vue"
Cohesion: 0.17
Nodes (10): FloatingIndicatorProps, FloatingIndicatorVars, {
	is = 'span',
	mod,
	target,
	parent,
	orientation = 'horizontal',
	transitionDuration: duration,
	...rest
}, _parent, { size, position }, style,_target, useFloatingIndicator() (+2 more)

### Community 70 - "number-input.vue"
Cohesion: 0.18
Nodes (8): focused, { icons }, {
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	step = 1,
	hideControls,
	icon,
	rightSectionPE = 'all',
	...rest
}, NumberInputProps, value, {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	...props
}, NumberFieldProps, {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
}

### Community 71 - "playground/package.json"
Cohesion: 0.18
Nodes (10): dependencies, nuxt, nuxt, name, private, scripts, build, dev (+2 more)

### Community 72 - "components/index.ts"
Cohesion: 0.24
Nodes (5): { spacing, ...rest }, style, useAvatarGroupState, [useProvide, useState], useProvideAvatarGroup

### Community 73 - "text-input.vue"
Cohesion: 0.24
Nodes (7): ExtractReturn, extractStyleProps(), STYLE_PROPS_KEYS, {
	classes,
	icon,
	...props
}, ref, { styles, rest }, value

### Community 74 - "components/segmented-control.vue"
Cohesion: 0.18
Nodes (10): activeTarget, groupName, items, labelRefs, {
	mod,
	data,
	size,
	radius,
	color,
	transitionDuration,
	transitionTimingFunction,
	fullWidth,
	orientation = 'horizontal',
	disabled,
	readOnly,
	withItemsBorders = true,
	...rest
}, rootRef, SegmentedControlItem, SegmentedControlVars (+2 more)

### Community 75 - "transition.vue"
Cohesion: 0.24
Nodes (8): emit, {
	name = 'pop-bottom-left',
	duration = 250,
	delay,
	tag = 'div',
	appear,
}, style, TransitionGroupProps, {
	name = 'pop-bottom-left',
	duration = 250,
	delay,
	appear,
	mode,
}, style, TransitionName, TransitionProps

### Community 76 - "tree-root.vue"
Cohesion: 0.18
Nodes (10): useProvideTreeState, active, {
	color,
	attr,
	loop,
	orientation,
	variant = 'subtle',
	size = 'md',
	iconResolver,
	removable = false,
	selectable = false,
	loadBranch,
	filter,
}, emit, expanded, { icons }, root, selected (+2 more)

### Community 77 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, dev, dev:build, dev:prepare, lint, lint:playground:ts, lint:ts, prepack (+2 more)

### Community 78 - "InputWrapperProps"
Cohesion: 0.24
Nodes (8): InputWrapperProps, {
	icon,
	autosize = false,
	multiline = true,
	resize,
	...props
}, inputRef, model, TextareaProps, {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
}, TextareaFieldProps, {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
}

### Community 79 - "menu-target.vue"
Cohesion: 0.20
Nodes (4): anchor, opened, MenuProps, ctx

### Community 80 - "menu-selectable-item.vue"
Cohesion: 0.22
Nodes (9): ctx, emit, { icons }, indicatorIcon, {
	mod,
	role,
	checked,
	indicator,
	closeMenuOnClick,
	disabled,
	...rest
}, onClick(), onKeyDown, renderIndicator (+1 more)

### Community 81 - "switch.vue"
Cohesion: 0.20
Nodes (9): checked, ctx, disabled, {
	id,
	radius,
	size: _size,
	color,
	name,
	value,
	error,
	labelPosition,
	onLabel,
	offLabel,
	withIndicator,
	disabled:_disabled,
	description,
	icon,
	label,
	mod,
}, modelValue, size, style, SwitchVars (+1 more)

### Community 84 - "combobox-root.vue"
Cohesion: 0.28
Nodes (7): ComboboxProps, emit, {
	loop = true,
	readOnly = false,
	size = 'sm',
	store: _store,
	dropdownPadding,
	...rest
}, opened, ComboboxStore, ComboboxDropdownEventSource, PopoverProps

### Community 85 - "dialog/index.ts"
Cohesion: 0.36
Nodes (5): DialogFooterProps, { is = 'footer', ...rest }, DrawerFooterProps, props, props

### Community 86 - "file-upload-button.vue"
Cohesion: 0.22
Nodes (8): emit, { files, open, onChange, onCancel, reset }, FileUploadButtonProps, FileUploadFiles, icon, { icons }, isMultiple, {
	multiple,
	accept,
	reset: _reset,
	directory,
	icon:_icon,
	...props
}

### Community 87 - "file-upload-icon.vue"
Cohesion: 0.22
Nodes (8): emit, { files, open, onChange, onCancel, reset }, FileUploadFiles, FileUploadIconProps, icon, { icons }, isMultiple, {
	multiple,
	accept,
	reset: _reset,
	directory,
	icon:_icon,
	...props
}

### Community 88 - "useConfig"
Cohesion: 0.22
Nodes (7): icon, { icon: _icon, ...rest }, { icons }, useConfig(), EmailFieldProps, {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
}, {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
}

### Community 89 - "confirm-modal.vue"
Cohesion: 0.25
Nodes (6): ConfirmLabels, ConfirmModalProps, loading, { opened, resolve: hide }, {
	title,
	description: body,
	labels,
	variant = 'default',
	cancelProps,
	confirmProps,
	onConfirm,
	onCancel,
	closeOnClickOutside = true,
	...rest
}, MaybePromise

### Community 90 - "pages/table.vue"
Cohesion: 0.25
Nodes (7): Checkbox, columns, data, helper, Icon, Payment, Text

### Community 91 - "pages/timeline.vue"
Cohesion: 0.29
Nodes (7): active, ActivityItem, activityItems, items, itemsWithIcons, lastSelected, TimelineItem

### Community 92 - "accordion-item.vue"
Cohesion: 0.25
Nodes (6): AccordionItemProps, dataState, itemDisabled, open, root, { value, disabled, mod, ...rest }

### Community 93 - "accordion-panel.vue"
Cohesion: 0.25
Nodes (7): AccordionPanelProps, headerId, item, { keepMounted, transitionDuration }, open, panelId, root

### Community 94 - "components/alert.vue"
Cohesion: 0.25
Nodes (7): AlertClasses, AlertVariant, AlertVars, { icons, variantResolver }, id, {
	mod,
	icon,
	color,
	title,
	radius,
	size = 'md',
	variant = 'light',
	withCloseButton,
	classes,
	closeButtonLabel,
	...rest
}, style

### Community 95 - "dialog-header.vue"
Cohesion: 0.36
Nodes (5): DialogHeaderProps, { is = 'header', ...rest }, DrawerHeaderProps, props, props

### Community 96 - "dialog-section.vue"
Cohesion: 0.36
Nodes (5): DialogSectionProps, { is = 'section', bordered, mod, ...rest }, DrawerSectionProps, props, props

### Community 97 - "password-input.vue"
Cohesion: 0.25
Nodes (6): { icons }, password, props, {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
}, PasswordFieldProps, {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
}

### Community 98 - "text.vue"
Cohesion: 0.25
Nodes (7): {
	is = 'p',
	truncate,
	lineClamp,
	inline,
	inherit,
	mod,
	variant,
	gradient,
	fz,
	ff,
	fw,
	lh,
	c,
	size,
	...rest
}, _mod, style, TextTruncate, TextVariant, TextVars, TitleOrder

### Community 99 - "notifications/types.ts"
Cohesion: 0.43
Nodes (6): NotificationAction, NotificationData, NotificationInput, NotificationOrientation, NotificationsState, StringOrVNode

### Community 100 - "tabs-tab.vue"
Cohesion: 0.33
Nodes (6): CheckboxCardProps, active, ctx, TabsTabProps, { value, mod, icon }, Mod

### Community 101 - "nav-link.vue"
Cohesion: 0.29
Nodes (6): {
	link,
	rest: {
		active,
		disabled,
		mod,
		variant = 'filled',
		color,
		noWrap,
		description,
		spacing,
		icon,
	},
}, NavLinkVariant, NavLinkVars, props, style, { variantResolver }

### Community 103 - "get-mod.ts"
Cohesion: 0.43
Nodes (3): isFalsy(), getMod(), transformKey()

### Community 104 - "pages/scroll-area.vue"
Cohesion: 0.33
Nodes (4): edges, overflow, programmaticRef, scrollPos

### Community 105 - "pages/segmented-control.vue"
Cohesion: 0.33
Nodes (5): basic, color, disabled, size, vertical

### Community 106 - "components/badge.vue"
Cohesion: 0.33
Nodes (5): BadgeVariant, BadgeVars, style, {
	variant = 'filled',
	size = 'md',
	radius = 'sm',
	color,
	fullWidth = false,
	circle,
	icon,
	fw,
	dotted,
	gradient,
	is,
	mod,
	...rest
}, { variantResolver }

### Community 107 - "roving-focus.vue"
Cohesion: 0.33
Nodes (5): useProvideRovingFocus, { init }, list, { loop = false, orientation = 'vertical' }, RovingFocusProps

### Community 108 - "pages/form.vue"
Cohesion: 0.40
Nodes (4): { handleSubmit }, onSubmit, result, schema

### Community 109 - "pages/menu.vue"
Cohesion: 0.50
Nodes (3): checkboxValue, lastClicked, radioValue

### Community 110 - "table.d.ts"
Cohesion: 0.50
Nodes (3): ColumnMeta, TableMeta, @tanstack/table-core

### Community 111 - "use-countdown.ts"
Cohesion: 0.50
Nodes (3): useCountdown(), UseCountdownOptions, UseCountdownReturn

### Community 112 - "text-field.vue"
Cohesion: 0.50
Nodes (3): {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
}, TextFieldProps, {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
}

## Knowledge Gaps
- **900 isolated node(s):** `propertiesOrder`, `*.module.css`, `name`, `version`, `description` (+895 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BoxProps` connect `BoxProps` to `chip.vue`, `tooltip.vue`, `runtime/utils/index.ts`, `dialog-root.vue`, `combobox-options-dropdown.vue`, `tabs-root.vue`, `components/scroll-area.vue`, `types/index.ts`, `combobox-option.vue`, `notification.vue`, `accordion/accordion.vue`, `app-shell/index.ts`, `dialog-close-button.vue`, `box.vue`, `collapse.vue`, `input-base.vue`, `avatar/avatar.vue`, `drawer-root.vue`, `progress-section.vue`, `action-icon/action-icon.vue`, `Classes`, `app-shell.vue`, `components/breadcrumbs.vue`, `accordion-header.vue`, `core/index.ts`, `floating-indicator.vue`, `components/index.ts`, `components/segmented-control.vue`, `dialog/index.ts`, `accordion-item.vue`, `components/alert.vue`, `dialog-header.vue`, `dialog-section.vue`, `text.vue`, `tabs-tab.vue`, `nav-link.vue`, `components/badge.vue`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `useConfig()` connect `useConfig` to `ui/table.vue`, `chip.vue`, `tooltip.vue`, `time-picker.vue`, `checkbox/checkbox.vue`, `runtime/utils/index.ts`, `date-picker.vue`, `getThemeColor`, `combobox-option.vue`, `select.vue`, `dialog-close-button.vue`, `menu-sub-item.vue`, `tree-item.vue`, `avatar/avatar.vue`, `date-time-picker.vue`, `action-icon/action-icon.vue`, `composables/index.ts`, `components/breadcrumbs.vue`, `accordion-header.vue`, `core/index.ts`, `number-input.vue`, `tree-root.vue`, `menu-selectable-item.vue`, `file-upload-button.vue`, `file-upload-icon.vue`, `components/alert.vue`, `password-input.vue`, `nav-link.vue`, `components/badge.vue`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `NuanceSize` connect `BoxProps` to `chip.vue`, `checkbox/checkbox.vue`, `runtime/utils/index.ts`, `dialog-root.vue`, `FieldBaseProps`, `date-picker.vue`, `calendar-month.vue`, `types/index.ts`, `combobox-option.vue`, `notification.vue`, `input-base.vue`, `avatar/avatar.vue`, `calendar-decade.vue`, `combobox/lib/context.ts`, `calendar-year.vue`, `progress-section.vue`, `switch-group.vue`, `action-icon/action-icon.vue`, `components/segmented-control.vue`, `InputWrapperProps`, `switch.vue`, `combobox-root.vue`, `components/alert.vue`, `text.vue`, `components/badge.vue`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `propertiesOrder`, `*.module.css`, `name` to the rest of the system?**
  _900 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui/table.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.05241090146750524 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0392156862745098 - nodes in this community are weakly interconnected._
- **Should `BoxProps` be split into smaller, more focused modules?**
  _Cohesion score 0.10666666666666667 - nodes in this community are weakly interconnected._