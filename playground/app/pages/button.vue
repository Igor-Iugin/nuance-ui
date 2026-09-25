<script setup lang='ts'>
import PopoverDropdown from '@nui/components/popover/popover-dropdown.vue'


const variants = [
	'default',
	'filled',
	'light',
	'outline',
	'subtle',
	'gradient',
	'gradient-outline',
] as const

const sizes = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
] as const

const inputSizes = [
	'input-xs',
	'input-sm',
	'input-md',
	'input-lg',
	'input-xl',
] as const
</script>

<template>
	<div class='root'>
		<!-- ─── VARIANTS ─── -->
		<section>
			<h3>Variants</h3>
			<div class='row'>
				<NButton v-for='variant in variants' :key='variant' :variant>
					{{ variant }}
				</NButton>
			</div>
		</section>

		<!-- ─── SIZES ─── -->
		<section>
			<h3>Sizes</h3>
			<div class='row'>
				<NButton v-for='size in sizes' :key='size' :size>
					{{ size }}
				</NButton>
			</div>
			<div class='row'>
				<NButton v-for='size in sizes' :key='size' :size='`compact-${size}`'>
					compact-{{ size }}
				</NButton>
			</div>
		</section>

		<!-- ─── SQUARE ─── -->
		<section>
			<h3>Square</h3>
			<div class='row'>
				<NButton v-for='size in sizes' :key='size' square icon='lucide:trash' :size />
			</div>
			<div class='row'>
				<NButton v-for='size in inputSizes' :key='size' square icon='lucide:trash' :size />
			</div>
			<div class='row'>
				<NButton v-for='variant in variants' :key='variant' square icon='lucide:trash' :variant />
			</div>
			<div class='row'>
				<NButton square icon='lucide:trash' icon-size='100%' />
				<NButton square icon='lucide:trash' radius='full' />
				<NButton square icon='lucide:trash' loading />
				<NButton square icon='lucide:trash' disabled />
			</div>
		</section>

		<!-- ─── BLOCK ─── -->
		<section>
			<h3>Block</h3>
			<NButton block>
				Block button
			</NButton>
		</section>

		<!-- ─── STATES ─── -->
		<section>
			<h3>States</h3>
			<div class='row'>
				<NButton loading>
					Loading
				</NButton>
				<NButton disabled>
					Disabled
				</NButton>
				<NButton active>
					Active
				</NButton>
				<NPopover>
					<NPopoverTarget>
						<NButton icon='lucide:box' trailing-icon='lucide:chevron-down'>
							Sections
						</NButton>
					</NPopoverTarget>
					<PopoverDropdown>
						Section list...
					</PopoverDropdown>
				</NPopover>
			</div>
		</section>

		<!-- ─── LINK ─── -->
		<section>
			<h3>Link</h3>
			<div class='row'>
				<NButton to='/button'>
					Internal
				</NButton>
				<NButton to='/button' active-mode='current'>
					Current-aware
				</NButton>
				<NButton to='https://nuxt.com' target='_blank'>
					External
				</NButton>
				<NButton to='/button' square icon='lucide:home' active-mode='current' />
				<NButton to='/button' disabled>
					Disabled link
				</NButton>
			</div>
		</section>

		<!-- ─── GROUPS ─── -->
		<section>
			<h3>Groups</h3>
			<div class='row'>
				<NButtonGroup>
					<NButton square icon='lucide:box' />
					<NButton square icon='lucide:chevron-down' w='12px' miw='auto' icon-size='100%' />
				</NButtonGroup>

				<NButtonGroup>
					<NButton size='sm'>
						Left
					</NButton>
					<NButton size='sm'>
						Middle
					</NButton>
					<NButton size='sm'>
						Right
					</NButton>
				</NButtonGroup>

				<NButtonGroup>
					<NButton>
						Action
					</NButton>
					<NButton square size='sm' icon='lucide:trash' />
					<NButton>
						More
					</NButton>
				</NButtonGroup>
			</div>

			<NButtonGroup orientation='vertical'>
				<NButton size='sm'>
					Top
				</NButton>
				<NButton size='sm'>
					Middle
				</NButton>
				<NButton size='sm'>
					Bottom
				</NButton>
			</NButtonGroup>
		</section>

		<!-- ─── SECTION ADDON ─── -->
		<section>
			<h3>Section addon</h3>
			<NButtonGroup>
				<NButtonSection size='input-md' variant='default'>
					https://
				</NButtonSection>
				<NButton size='input-md'>
					Go
				</NButton>
			</NButtonGroup>
		</section>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: flex-start;

	padding: 1rem;
}

.row {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	align-items: center;

	margin-bottom: 0.75rem;
}

h3 {
	margin-bottom: 0.5rem;
}
</style>
