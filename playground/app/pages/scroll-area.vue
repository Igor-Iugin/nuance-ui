<script lang='ts' setup>
import { ref, useTemplateRef } from 'vue'

// ─── Edge counters ───
const edges = ref({ top: 0, bottom: 0, left: 0, right: 0 })

// ─── Scroll position & overflow ───
const scrollPos = ref({ x: 0, y: 0 })
const overflow = ref({ x: false, y: false })

// ─── Programmatic scroll ───
const programmaticRef = useTemplateRef<{ viewport: HTMLElement | null }>('programmaticRef')

function scrollTo(target: 'top' | 'center' | 'bottom') {
	const el = programmaticRef.value?.viewport
	if (!el)
		return

	const top
		= target === 'top'
			? 0
			: target === 'center'
				? el.scrollHeight / 2
				: el.scrollHeight

	el.scrollTo({ top, behavior: 'smooth' })
}
</script>

<template>
	<div class='root'>
		<!-- ─── ScrollArea: edge emits ─── -->
		<section class='section'>
			<p class='label'>
				Edge emits (top / bottom / left / right)
			</p>
			<div class='counters'>
				<span>top: {{ edges.top }}</span>
				<span>bottom: {{ edges.bottom }}</span>
				<span>left: {{ edges.left }}</span>
				<span>right: {{ edges.right }}</span>
			</div>
			<NScrollArea
				class='area'
				scrollbars='xy'
				type='hover'
				@top='edges.top++'
				@bottom='edges.bottom++'
				@left='edges.left++'
				@right='edges.right++'
			>
				<div class='wide-grid'>
					<NCard v-for='t in 100' :key='t'>
						item {{ t }}
					</NCard>
				</div>
			</NScrollArea>
		</section>

		<!-- ─── ScrollArea: scrollPosition + overflow ─── -->
		<section class='section'>
			<p class='label'>
				scrollPosition / overflow emits
			</p>
			<div class='counters'>
				<span>x: {{ scrollPos.x.toFixed(0) }}</span>
				<span>y: {{ scrollPos.y.toFixed(0) }}</span>
				<span>overflow-x: {{ overflow.x }}</span>
				<span>overflow-y: {{ overflow.y }}</span>
			</div>
			<NScrollArea
				class='area'
				scrollbars='xy'
				type='auto'
				@scroll-position='scrollPos = $event'
				@overflow='overflow = $event'
			>
				<div class='wide-grid'>
					<NCard v-for='t in 60' :key='t'>
						item {{ t }}
					</NCard>
				</div>
			</NScrollArea>
		</section>

		<!-- ─── ScrollArea: types showcase ─── -->
		<section class='section'>
			<p class='label'>
				type: hover / scroll / auto / never
			</p>
			<div class='types-grid'>
				<div v-for='t in (["hover", "scroll", "auto", "never"] as const)' :key='t'>
					<p class='label'>
						{{ t }}
					</p>
					<NScrollArea class='area-sm' :type='t'>
						<NCard v-for='i in 30' :key='i'>
							{{ t }} #{{ i }}
						</NCard>
					</NScrollArea>
				</div>
			</div>
		</section>

		<!-- ─── ScrollArea: offsetScrollbars ─── -->
		<section class='section'>
			<p class='label'>
				offsetScrollbars: false / true / 'y' / 'present'
			</p>
			<div class='types-grid'>
				<div v-for='o in ([false, true, "y", "present"] as const)' :key='String(o)'>
					<p class='label'>
						{{ String(o) }}
					</p>
					<NScrollArea class='area-sm' :offset-scrollbars='o' type='auto'>
						<NCard v-for='i in 30' :key='i'>
							row #{{ i }}
						</NCard>
					</NScrollArea>
				</div>
			</div>
		</section>

		<!-- ─── ScrollArea: startScrollPosition ─── -->
		<section class='section'>
			<p class='label'>
				startScrollPosition (y: 500)
			</p>
			<NScrollArea class='area' :start-scroll-position='{ y: 500 }'>
				<NCard v-for='t in 80' :key='t'>
					row {{ t }}
				</NCard>
			</NScrollArea>
		</section>

		<!-- ─── ScrollArea: programmatic scroll via viewportRef ─── -->
		<section class='section'>
			<p class='label'>
				Programmatic scroll via exposed viewport
			</p>
			<div class='controls'>
				<NButton @click='scrollTo("top")'>
					Top
				</NButton>
				<NButton @click='scrollTo("center")'>
					Center
				</NButton>
				<NButton @click='scrollTo("bottom")'>
					Bottom
				</NButton>
			</div>
			<NScrollArea ref='programmaticRef' class='area' type='auto'>
				<NCard v-for='t in 80' :key='t'>
					row {{ t }}
				</NCard>
			</NScrollArea>
		</section>

		<!-- ─── ScrollArea: horizontal only ─── -->
		<section class='section'>
			<p class='label'>
				scrollbars='x' (horizontal only)
			</p>
			<NScrollArea class='area' scrollbars='x' type='auto'>
				<div class='row-wide'>
					<NCard v-for='t in 30' :key='t'>
						col {{ t }}
					</NCard>
				</div>
			</NScrollArea>
		</section>

		<!-- ─── ScrollArea: autoSize ─── -->
		<section class='section'>
			<p class='label'>
				autoSize: content drives width via min-content (table example)
			</p>
			<NScrollArea class='area' scrollbars='xy' type='auto' auto-size>
				<table class='wide-table'>
					<thead>
						<tr>
							<th v-for='c in 12' :key='c'>
								Column {{ c }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for='r in 40' :key='r'>
							<td v-for='c in 12' :key='c'>
								r{{ r }} / c{{ c }} — long cell content
							</td>
						</tr>
					</tbody>
				</table>
			</NScrollArea>
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
	margin: 0;

	font-size: 0.75rem;
	color: var(--color-gray-6);
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.area {
	height: 300px;

	border: 1px solid var(--color-default-border);
	border-radius: 0.5rem;
}

.area-sm {
	height: 160px;

	border: 1px solid var(--color-default-border);
	border-radius: 0.5rem;
}

.counters {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;

	font-family: monospace;
	font-size: 0.75rem;
	color: var(--color-gray-7);
}

.controls {
	display: flex;
	gap: 0.5rem;
}

.wide-grid {
	display: grid;
	grid-template-columns: repeat(8, minmax(120px, 1fr));
	gap: 0.5rem;

	padding: 0.5rem;
}

.row-wide {
	display: flex;
	gap: 0.5rem;

	padding: 0.5rem;
}

.types-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 1rem;
}

.wide-table {
	border-collapse: collapse;

	& th,
	& td {
		padding: 0.5rem 1rem;

		border: 1px solid var(--color-default-border);

		text-align: left;
		white-space: nowrap;
	}
}
</style>
