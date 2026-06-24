<script lang='ts' setup>
const open = ref(false)
</script>

<template>
	<div class='root'>
		<!-- ─── Basic ─── -->
		<section>
			<p class='label'>
				Basic
			</p>
			<NCollapsibleRoot>
				<NCollapsibleTrigger>
					<NButton variant='outline'>
						Toggle
					</NButton>
				</NCollapsibleTrigger>
				<NCollapsibleContent>
					<div class='panel'>
						Hidden content revealed on toggle.
					</div>
				</NCollapsibleContent>
			</NCollapsibleRoot>
		</section>

		<!-- ─── Controlled ─── -->
		<section>
			<p class='label'>
				Controlled (v-model)
			</p>
			<NCollapsibleRoot v-model:open='open'>
				<NCollapsibleTrigger>
					<NButton variant='outline'>
						{{ open ? 'Close' : 'Open' }}
					</NButton>
				</NCollapsibleTrigger>
				<NCollapsibleContent>
					<div class='panel'>
						Controlled by external state: <strong>{{ open }}</strong>
					</div>
				</NCollapsibleContent>
			</NCollapsibleRoot>
		</section>

		<!-- ─── Disabled ─── -->
		<section>
			<p class='label'>
				Disabled
			</p>
			<NCollapsibleRoot :disabled='true'>
				<NCollapsibleTrigger>
					<NButton variant='outline'>
						Toggle (disabled)
					</NButton>
				</NCollapsibleTrigger>
				<NCollapsibleContent>
					<div class='panel'>
						You should not see this.
					</div>
				</NCollapsibleContent>
			</NCollapsibleRoot>
		</section>

		<!-- ─── Unmount on hide ─── -->
		<section>
			<p class='label'>
				unmountOnHide
			</p>
			<NCollapsibleRoot :unmount-on-hide='true'>
				<NCollapsibleTrigger>
					<NButton variant='outline'>
						Toggle
					</NButton>
				</NCollapsibleTrigger>
				<NCollapsibleContent>
					<div class='panel'>
						Content unmounted when closed (check DOM).
					</div>
				</NCollapsibleContent>
			</NCollapsibleRoot>
		</section>

		<!-- ─── CSS animation ─── -->
		<section>
			<p class='label'>
				CSS height animation
			</p>
			<NCollapsibleRoot>
				<NCollapsibleTrigger>
					<NButton variant='outline'>
						Toggle
					</NButton>
				</NCollapsibleTrigger>
				<NCollapsibleContent class='animated-content'>
					<div class='panel'>
						<p>Line one</p>
						<p>Line two</p>
						<p>Line three — height animated via CSS variable</p>
					</div>
				</NCollapsibleContent>
			</NCollapsibleRoot>
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

.panel {
	margin-top: 0.5rem;
	padding: 0.75rem 1rem;

	border: 1px solid var(--color-gray-3);
	border-radius: 0.25rem;
}

.animated-content {
	overflow: hidden;

	transition: height 500ms ease;

	&[data-state='open'] {
		height: var(--collapsible-content-height);
	}

	&[data-state='closed'] {
		height: 0;
	}
}
</style>
