# Radio

Radio and RadioCard use native radio inputs. RadioGroup provides the selected
value, a shared name, size, disabled, readOnly and required settings. Components
can be nested inside arbitrary layout wrappers, and Radio and RadioCard can be
mixed in the same group.

```vue
<script setup lang="ts">
import { ref } from 'vue'


const plan = ref<string | null>('personal')
</script>

<template>
	<NRadioGroup v-model='plan' name='plan' label='Plan' required>
		<NRadio value='personal' label='Personal' description='For individual use' />
		<NRadioCard value='team'>
			<NGroup p='md'>
				<NRadioIndicator />
				<span>Team</span>
			</NGroup>
		</NRadioCard>
	</NRadioGroup>
</template>
```

Outside a group, bind the same string model and name to related radios:
`<NRadio v-model="plan" name="plan" value="team" label="Team" />`.
The model holds the selected value, rather than a boolean. Clicking a selected
radio does not clear it; set the model to `null` to clear the selection.

Radio supports label, description and error props and slots, labelPosition,
five sizes (xs–xl), color, iconColor, filled/outline variants, and an icon slot.
RadioIndicator supports the same visual options, a default icon slot, and
checked/disabled props. Inside RadioCard it inherits checked, disabled and size.
It is decorative and cannot be used as an interactive control on its own.

RadioCard exposes checked and disabled in its default slot, and supports radius
and withBorder (true by default). Put non-interactive content inside its label;
keep links, buttons and other form controls outside the card.

Native attributes and listeners (including form, aria-label, focus and change)
are forwarded to the input of Radio and RadioCard. Class and style apply to the
outer wrapper; classes.input targets the input. Classes.body targets the card
label. Use classes to customize the other named elements as needed.

Use name for a stable form field key. Unnamed groups receive unique names to
preserve native exclusivity and keyboard navigation. Only the checked native
input contributes to FormData; disabled controls are omitted.
