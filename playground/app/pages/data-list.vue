<script lang='ts' setup>
import type { NuanceSize } from '@nui/types'


const size = ref<NuanceSize>('sm')
const orientation = ref<'horizontal' | 'vertical'>('horizontal')
const withDivider = ref(false)

// Toggled to verify `classes` stays reactive after the prop changes
const highlight = ref(false)
</script>

<template>
	<div class='root'>
		<!-- ─── Default ─── -->
		<section>
			<p class='label'>
				Default
			</p>
			<NDataList>
				<NDataListItem>
					<NDataListItemLabel>Name</NDataListItemLabel>
					<NDataListItemValue>Nuance UI</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Version</NDataListItemLabel>
					<NDataListItemValue>0.4.16</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>License</NDataListItemLabel>
					<NDataListItemValue>MIT</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── Orientation: vertical ─── -->
		<section>
			<p class='label'>
				Orientation: vertical
			</p>
			<NDataList orientation='vertical'>
				<NDataListItem>
					<NDataListItemLabel>Shipping address</NDataListItemLabel>
					<NDataListItemValue>Tverskaya st. 12, Moscow, 125009</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Billing address</NDataListItemLabel>
					<NDataListItemValue>Nevsky ave. 28, Saint Petersburg, 191186</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── With divider ─── -->
		<section>
			<p class='label'>
				With divider
			</p>
			<NDataList with-divider>
				<NDataListItem>
					<NDataListItemLabel>Status</NDataListItemLabel>
					<NDataListItemValue>Delivered</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Carrier</NDataListItemLabel>
					<NDataListItemValue>DHL Express</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Tracking</NDataListItemLabel>
					<NDataListItemValue>JD0140023456789</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── Labels with icons ─── -->
		<section>
			<p class='label'>
				Labels with icons
			</p>
			<NDataList>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:mail'>
						Email
					</NDataListItemLabel>
					<NDataListItemValue>hello@nuance-ui.dev</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:phone'>
						Phone
					</NDataListItemLabel>
					<NDataListItemValue>+7 495 123-45-67</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:map-pin' color='blue'>
						Location
					</NDataListItemLabel>
					<NDataListItemValue>Moscow, Russia</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── Sizes ─── -->
		<section>
			<p class='label'>
				Sizes
			</p>
			<div class='sizes'>
				<NDataList v-for='s in (["xs", "sm", "md", "lg", "xl"] as const)' :key='s' :size='s'>
					<NDataListItem>
						<NDataListItemLabel>Size</NDataListItemLabel>
						<NDataListItemValue>{{ s }}</NDataListItemValue>
					</NDataListItem>
				</NDataList>
			</div>
		</section>

		<!-- ─── Custom label width ─── -->
		<section>
			<p class='label'>
				Custom labelWidth
			</p>
			<NDataList label-width='220px'>
				<NDataListItem>
					<NDataListItemLabel>Registration number</NDataListItemLabel>
					<NDataListItemValue>1157746476234</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Taxpayer ID</NDataListItemLabel>
					<NDataListItemValue>7736207543</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── Styles API (reactive `classes`) ─── -->
		<section>
			<p class='label'>
				Styles API — classes must stay reactive
			</p>
			<NButton size='xs' @click='highlight = !highlight'>
				{{ highlight ? 'Reset styles' : 'Apply custom classes' }}
			</NButton>
			<NDataList
				:classes='{
					label: highlight ? "accent-label" : undefined,
					value: highlight ? "accent-value" : undefined,
				}'
				class='api-demo'
			>
				<NDataListItem>
					<NDataListItemLabel>Plan</NDataListItemLabel>
					<NDataListItemValue>Enterprise</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel>Seats</NDataListItemLabel>
					<NDataListItemValue>250</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>

		<!-- ─── Playground ─── -->
		<section>
			<p class='label'>
				Playground
			</p>
			<div class='controls'>
				<NSegmentedControl v-model='size' :data='["xs", "sm", "md", "lg", "xl"]' size='xs' />
				<NSegmentedControl v-model='orientation' :data='["horizontal", "vertical"]' size='xs' />
				<NCheckbox v-model='withDivider' label='With divider' />
			</div>
			<NDataList :size='size' :orientation='orientation' :with-divider='withDivider'>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:package'>
						Order
					</NDataListItemLabel>
					<NDataListItemValue>#4815-1623</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:credit-card'>
						Payment
					</NDataListItemLabel>
					<NDataListItemValue>Visa •••• 4242</NDataListItemValue>
				</NDataListItem>
				<NDataListItem>
					<NDataListItemLabel icon='lucide:truck'>
						Delivery
					</NDataListItemLabel>
					<NDataListItemValue>Express, 2 business days</NDataListItemValue>
				</NDataListItem>
			</NDataList>
		</section>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	flex-direction: column;

	gap: 2rem;

	padding: 2rem;
}

.label {
	margin: 0 0 0.5rem;

	font-size: 0.75rem;
	color: var(--color-gray-6);
}

.sizes {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-xs);
}

.controls {
	display: flex;
	flex-wrap: wrap;

	gap: var(--spacing-sm);
	align-items: center;

	margin-bottom: var(--spacing-sm);
}

.api-demo {
	margin-top: var(--spacing-sm);
}
</style>

<style>
.accent-label {
	font-weight: 600;
	color: var(--color-blue-6);
}

.accent-value {
	font-family: monospace;
}
</style>
