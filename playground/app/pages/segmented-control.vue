<script setup lang='ts'>
import { ref } from 'vue'


const basic = ref('React')
const size = ref('md')
const vertical = ref('daily')
const disabled = ref('one')
const color = ref('Vue')
</script>

<template>
	<div class='root'>
		<!-- ─── Basic ─── -->
		<section>
			<p class='label'>
				Basic — value: {{ basic }}
			</p>
			<NSegmentedControl
				v-model='basic'
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Sizes ─── -->
		<section>
			<p class='label'>
				Sizes
			</p>
			<NSegmentedControl
				v-model='size'
				size='xs'
				:data='["xs", "sm", "md", "lg", "xl"]'
			/>
			<NSegmentedControl
				v-model='size'
				size='sm'
				:data='["xs", "sm", "md", "lg", "xl"]'
			/>
			<NSegmentedControl
				v-model='size'
				size='md'
				:data='["xs", "sm", "md", "lg", "xl"]'
			/>
			<NSegmentedControl
				v-model='size'
				size='lg'
				:data='["xs", "sm", "md", "lg", "xl"]'
			/>
			<NSegmentedControl
				v-model='size'
				size='xl'
				:data='["xs", "sm", "md", "lg", "xl"]'
			/>
		</section>

		<!-- ─── Colors ─── -->
		<section>
			<p class='label'>
				Colors
			</p>
			<NSegmentedControl
				v-model='color'
				color='blue'
				:data='["React", "Vue", "Svelte"]'
			/>
			<NSegmentedControl
				v-model='color'
				color='green'
				:data='["React", "Vue", "Svelte"]'
			/>
			<NSegmentedControl
				v-model='color'
				color='red'
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Radius ─── -->
		<section>
			<p class='label'>
				Radius
			</p>
			<NSegmentedControl
				v-model='basic'
				radius='xs'
				:data='["React", "Vue", "Svelte"]'
			/>
			<NSegmentedControl
				v-model='basic'
				radius='md'
				:data='["React", "Vue", "Svelte"]'
			/>
			<NSegmentedControl
				v-model='basic'
				radius='xl'
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Full width ─── -->
		<section class='full-width'>
			<p class='label'>
				Full width
			</p>
			<NSegmentedControl
				v-model='basic'
				full-width
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Vertical ─── -->
		<section>
			<p class='label'>
				Vertical — value: {{ vertical }}
			</p>
			<NSegmentedControl
				v-model='vertical'
				orientation='vertical'
				:data='["daily", "weekly", "monthly"]'
			/>
		</section>

		<!-- ─── Disabled items ─── -->
		<section>
			<p class='label'>
				Disabled items
			</p>
			<NSegmentedControl
				v-model='disabled'
				:data='[
					{ value: "one", label: "One" },
					{ value: "two", label: "Two", disabled: true },
					{ value: "three", label: "Three" },
				]'
			/>
		</section>

		<!-- ─── Fully disabled ─── -->
		<section>
			<p class='label'>
				Fully disabled
			</p>
			<NSegmentedControl
				v-model='basic'
				disabled
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Read only ─── -->
		<section>
			<p class='label'>
				Read only
			</p>
			<NSegmentedControl
				v-model='basic'
				read-only
				:data='["React", "Vue", "Svelte"]'
			/>
		</section>

		<!-- ─── Without item borders ─── -->
		<section>
			<p class='label'>
				Without item borders
			</p>
			<NSegmentedControl
				v-model='basic'
				:with-items-borders='false'
				:data='["React", "Vue", "Svelte"]'
			/>
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

section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: flex-start;
}

.full-width {
	align-items: stretch;
}

.label {
	margin: 0;

	font-size: 0.75rem;
	color: var(--color-gray-6);
}
</style>
