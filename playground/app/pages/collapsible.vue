<script lang='ts' setup>
const opened = ref(false)
</script>

<template>
	<div class='root'>
		<!-- ─── Basic ─── -->
		<section>
			<p class='label'>
				Basic
			</p>
			<NCollapse>
				<template #trigger='{ open, toggle, props }'>
					<NButton variant='outline' v-bind='props' @click='toggle'>
						{{ open ? 'Close' : 'Open' }}
					</NButton>
				</template>
				<div class='panel'>
					Hidden content revealed on toggle.
				</div>
			</NCollapse>
		</section>

		<!-- ─── Controlled ─── -->
		<section>
			<p class='label'>
				Controlled (v-model)
			</p>
			<NCollapse v-model:open='opened'>
				<template #trigger='{ toggle, props }'>
					<NButton variant='outline' v-bind='props' @click='toggle'>
						{{ opened ? 'Close' : 'Open' }}
					</NButton>
				</template>
				<div class='panel'>
					Controlled by external state: <strong>{{ opened }}</strong>
				</div>
			</NCollapse>
		</section>

		<!-- ─── Disabled ─── -->
		<section>
			<p class='label'>
				Disabled
			</p>
			<NCollapse :disabled='true'>
				<template #trigger='{ props }'>
					<NButton variant='outline' v-bind='props'>
						Toggle (disabled)
					</NButton>
				</template>
				<div class='panel'>
					You should not see this.
				</div>
			</NCollapse>
		</section>

		<!-- ─── keepMounted false ─── -->
		<section>
			<p class='label'>
				keepMounted: false (unmount after close)
			</p>
			<NCollapse :keep-mounted='false'>
				<template #trigger='{ open, toggle, props }'>
					<NButton variant='outline' v-bind='props' @click='toggle'>
						{{ open ? 'Close' : 'Open' }}
					</NButton>
				</template>
				<div class='panel'>
					Content unmounted from DOM when closed (check DevTools).
				</div>
			</NCollapse>
		</section>

		<!-- ─── No opacity ─── -->
		<section>
			<p class='label'>
				animateOpacity: false
			</p>
			<NCollapse :animate-opacity='false'>
				<template #trigger='{ open, toggle, props }'>
					<NButton variant='outline' v-bind='props' @click='toggle'>
						{{ open ? 'Close' : 'Open' }}
					</NButton>
				</template>
				<div class='panel'>
					<p>Line one</p>
					<p>Line two</p>
					<p>Line three — height only, no opacity</p>
				</div>
			</NCollapse>
		</section>

		<!-- ─── Default open ─── -->
		<section>
			<p class='label'>
				defaultOpen: true
			</p>
			<NCollapse :default-open='true'>
				<template #trigger='{ open, toggle, props }'>
					<NButton variant='outline' v-bind='props' @click='toggle'>
						{{ open ? 'Close' : 'Open' }}
					</NButton>
				</template>
				<div class='panel'>
					Starts open.
				</div>
			</NCollapse>
		</section>

		<!-- ─── No trigger slot ─── -->
		<section>
			<p class='label'>
				External control (no trigger slot)
			</p>
			<NButton variant='outline' @click='opened = !opened'>
				External toggle: {{ opened }}
			</NButton>
			<NCollapse v-model:open='opened'>
				<div class='panel'>
					Controlled purely from outside — no trigger slot used.
				</div>
			</NCollapse>
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
</style>
