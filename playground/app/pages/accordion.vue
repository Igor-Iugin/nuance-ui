<script lang='ts' setup>
const controlled = ref<string | null>(null)
</script>

<template>
	<div class='root'>
		<!-- ─── Default variant ─── -->
		<section>
			<p class='label'>
				Default
			</p>
			<NAccordion>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>What is Nuance UI?</NAccordionHeader>
					<NAccordionPanel>
						Nuance UI is a Vue 3 component library built on top of Nuxt, providing accessible and customizable components.
					</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>How do I install it?</NAccordionHeader>
					<NAccordionPanel>
						Install via <code>pnpm add nuance-ui</code> and add the module to your nuxt.config.ts.
					</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Is it accessible?</NAccordionHeader>
					<NAccordionPanel>
						Yes. All components follow WAI-ARIA patterns with proper keyboard navigation and ARIA attributes.
					</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Contained variant ─── -->
		<section>
			<p class='label'>
				Variant: contained
			</p>
			<NAccordion variant='contained'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Third item</NAccordionHeader>
					<NAccordionPanel>Content of the third item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Filled variant ─── -->
		<section>
			<p class='label'>
				Variant: filled
			</p>
			<NAccordion variant='filled'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Third item</NAccordionHeader>
					<NAccordionPanel>Content of the third item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Separated variant ─── -->
		<section>
			<p class='label'>
				Variant: separated
			</p>
			<NAccordion variant='separated'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Third item</NAccordionHeader>
					<NAccordionPanel>Content of the third item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Multiple ─── -->
		<section>
			<p class='label'>
				Multiple open
			</p>
			<NAccordion :multiple='true'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Third item</NAccordionHeader>
					<NAccordionPanel>Content of the third item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Default value ─── -->
		<section>
			<p class='label'>
				Default value: item-2
			</p>
			<NAccordion default-value='item-2'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item (open by default)</NAccordionHeader>
					<NAccordionPanel>This item was open on mount.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Third item</NAccordionHeader>
					<NAccordionPanel>Content of the third item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Controlled ─── -->
		<section>
			<p class='label'>
				Controlled (v-model): {{ controlled ?? 'none' }}
			</p>
			<NAccordion v-model='controlled'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Chevron left ─── -->
		<section>
			<p class='label'>
				chevronPosition: left
			</p>
			<NAccordion chevron-position='left'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Icon ─── -->
		<section>
			<p class='label'>
				Header icon
			</p>
			<NAccordion>
				<NAccordionItem value='item-1'>
					<NAccordionHeader icon='lucide:info'>
						Info
					</NAccordionHeader>
					<NAccordionPanel>Item with an info icon.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader icon='lucide:settings'>
						Settings
					</NAccordionHeader>
					<NAccordionPanel>Item with a settings icon.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader icon='lucide:user'>
						Profile
					</NAccordionHeader>
					<NAccordionPanel>Item with a user icon.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Disabled item ─── -->
		<section>
			<p class='label'>
				Disabled item
			</p>
			<NAccordion>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>Active item</NAccordionHeader>
					<NAccordionPanel>This item can be toggled.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2' disabled>
					<NAccordionHeader>Disabled item</NAccordionHeader>
					<NAccordionPanel>You should not see this.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-3'>
					<NAccordionHeader>Active item</NAccordionHeader>
					<NAccordionPanel>This item can be toggled.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Disabled accordion ─── -->
		<section>
			<p class='label'>
				Disabled accordion
			</p>
			<NAccordion disabled>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Content of the first item.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Content of the second item.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── keepMounted false ─── -->
		<section>
			<p class='label'>
				keepMounted: false
			</p>
			<NAccordion :keep-mounted='false'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Unmounted from DOM when closed.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Unmounted from DOM when closed.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── Disable chevron rotation ─── -->
		<section>
			<p class='label'>
				disableChevronRotation
			</p>
			<NAccordion disable-chevron-rotation>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Chevron does not rotate on open.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Chevron does not rotate on open.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
		</section>

		<!-- ─── order (WAI-ARIA heading) ─── -->
		<section>
			<p class='label'>
				order: 3 (h3 headers for WAI-ARIA)
			</p>
			<NAccordion order='3'>
				<NAccordionItem value='item-1'>
					<NAccordionHeader>First item</NAccordionHeader>
					<NAccordionPanel>Header wrapped in h3.</NAccordionPanel>
				</NAccordionItem>
				<NAccordionItem value='item-2'>
					<NAccordionHeader>Second item</NAccordionHeader>
					<NAccordionPanel>Header wrapped in h3.</NAccordionPanel>
				</NAccordionItem>
			</NAccordion>
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
</style>
