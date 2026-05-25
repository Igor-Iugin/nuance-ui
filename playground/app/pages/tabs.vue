<script setup lang='ts'>
import { ref } from 'vue'


const basic = ref('gallery')
const pills = ref('messages')
const outline = ref('account')
const vertical = ref('profile')
const verticalRight = ref('profile')
const deactivatable = ref<string | null>('overview')
const color = ref('news')
const keepMounted = ref('first')
</script>

<template>
	<div class='root'>
		<!-- ─── Basic (default) ─── -->
		<section>
			<p class='label'>
				Basic — value: {{ basic }}
			</p>
			<NTabsRoot v-model='basic' default-tab='gallery'>
				<NTabsList>
					<NTabsTab value='gallery'>
						Gallery
					</NTabsTab>
					<NTabsTab value='messages'>
						Messages
					</NTabsTab>
					<NTabsTab value='settings'>
						Settings
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='gallery'>
					Gallery panel content
				</NTabsPanel>
				<NTabsPanel value='messages'>
					Messages panel content
				</NTabsPanel>
				<NTabsPanel value='settings'>
					Settings panel content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Pills variant ─── -->
		<section>
			<p class='label'>
				Pills variant
			</p>
			<NTabsRoot v-model='pills' variant='pills'>
				<NTabsList>
					<NTabsTab value='messages'>
						Messages
					</NTabsTab>
					<NTabsTab value='notifications'>
						Notifications
					</NTabsTab>
					<NTabsTab value='drafts'>
						Drafts
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='messages'>
					Messages panel content
				</NTabsPanel>
				<NTabsPanel value='notifications'>
					Notifications panel content
				</NTabsPanel>
				<NTabsPanel value='drafts'>
					Drafts panel content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Outline variant ─── -->
		<section>
			<p class='label'>
				Outline variant
			</p>
			<NTabsRoot v-model='outline' variant='outline'>
				<NTabsList>
					<NTabsTab value='account'>
						Account
					</NTabsTab>
					<NTabsTab value='security'>
						Security
					</NTabsTab>
					<NTabsTab value='notifications'>
						Notifications
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='account'>
					Account settings panel
				</NTabsPanel>
				<NTabsPanel value='security'>
					Security settings panel
				</NTabsPanel>
				<NTabsPanel value='notifications'>
					Notification preferences panel
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Colors ─── -->
		<section>
			<p class='label'>
				Colors
			</p>
			<NTabsRoot v-model='color' color='blue'>
				<NTabsList>
					<NTabsTab value='news'>
						News
					</NTabsTab>
					<NTabsTab value='sport'>
						Sport
					</NTabsTab>
					<NTabsTab value='tech'>
						Tech
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='news'>
					News content
				</NTabsPanel>
				<NTabsPanel value='sport'>
					Sport content
				</NTabsPanel>
				<NTabsPanel value='tech'>
					Tech content
				</NTabsPanel>
			</NTabsRoot>
			<NTabsRoot v-model='color' color='red' variant='pills'>
				<NTabsList>
					<NTabsTab value='news'>
						News
					</NTabsTab>
					<NTabsTab value='sport'>
						Sport
					</NTabsTab>
					<NTabsTab value='tech'>
						Tech
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='news'>
					News content
				</NTabsPanel>
				<NTabsPanel value='sport'>
					Sport content
				</NTabsPanel>
				<NTabsPanel value='tech'>
					Tech content
				</NTabsPanel>
			</NTabsRoot>
			<NTabsRoot v-model='color' color='green' variant='outline'>
				<NTabsList>
					<NTabsTab value='news'>
						News
					</NTabsTab>
					<NTabsTab value='sport'>
						Sport
					</NTabsTab>
					<NTabsTab value='tech'>
						Tech
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='news'>
					News content
				</NTabsPanel>
				<NTabsPanel value='sport'>
					Sport content
				</NTabsPanel>
				<NTabsPanel value='tech'>
					Tech content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Grow tabs list ─── -->
		<section class='full-width'>
			<p class='label'>
				Grow (tabs stretch full width)
			</p>
			<NTabsRoot v-model='basic'>
				<NTabsList grow>
					<NTabsTab value='gallery'>
						Gallery
					</NTabsTab>
					<NTabsTab value='messages'>
						Messages
					</NTabsTab>
					<NTabsTab value='settings'>
						Settings
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='gallery'>
					Gallery panel content
				</NTabsPanel>
				<NTabsPanel value='messages'>
					Messages panel content
				</NTabsPanel>
				<NTabsPanel value='settings'>
					Settings panel content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Icons ─── -->
		<section>
			<p class='label'>
				Icons
			</p>
			<NTabsRoot v-model='basic'>
				<NTabsList>
					<NTabsTab value='gallery' icon='lucide:image'>
						Gallery
					</NTabsTab>
					<NTabsTab value='messages' icon='lucide:message-circle'>
						Messages
					</NTabsTab>
					<NTabsTab value='settings' icon='lucide:settings'>
						Settings
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='gallery'>
					Gallery panel content
				</NTabsPanel>
				<NTabsPanel value='messages'>
					Messages panel content
				</NTabsPanel>
				<NTabsPanel value='settings'>
					Settings panel content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Allow tab deactivation ─── -->
		<section>
			<p class='label'>
				Allow tab deactivation — value: {{ deactivatable }}
			</p>
			<NTabsRoot v-model='deactivatable' allow-tab-deactivation>
				<NTabsList>
					<NTabsTab value='overview'>
						Overview
					</NTabsTab>
					<NTabsTab value='activity'>
						Activity
					</NTabsTab>
					<NTabsTab value='settings'>
						Settings
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='overview'>
					Overview panel
				</NTabsPanel>
				<NTabsPanel value='activity'>
					Activity panel
				</NTabsPanel>
				<NTabsPanel value='settings'>
					Settings panel
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Vertical (left) ─── -->
		<section>
			<p class='label'>
				Vertical placement: left
			</p>
			<NTabsRoot
				v-model='vertical'
				orientation='vertical'
				placement='left'
				variant='outline'
			>
				<NTabsList>
					<NTabsTab value='profile'>
						Profile
					</NTabsTab>
					<NTabsTab value='billing'>
						Billing
					</NTabsTab>
					<NTabsTab value='integrations'>
						Integrations
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='profile'>
					Profile settings content
				</NTabsPanel>
				<NTabsPanel value='billing'>
					Billing settings content
				</NTabsPanel>
				<NTabsPanel value='integrations'>
					Integrations settings content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Vertical (right) ─── -->
		<section>
			<p class='label'>
				Vertical placement: right
			</p>
			<NTabsRoot v-model='verticalRight' orientation='vertical' placement='right'>
				<NTabsList>
					<NTabsTab value='profile'>
						Profile
					</NTabsTab>
					<NTabsTab value='billing'>
						Billing
					</NTabsTab>
					<NTabsTab value='integrations'>
						Integrations
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='profile'>
					Profile settings content
				</NTabsPanel>
				<NTabsPanel value='billing'>
					Billing settings content
				</NTabsPanel>
				<NTabsPanel value='integrations'>
					Integrations settings content
				</NTabsPanel>
			</NTabsRoot>
		</section>

		<!-- ─── Keep mounted ─── -->
		<section>
			<p class='label'>
				Keep mounted: false (panels unmount when inactive)
			</p>
			<NTabsRoot v-model='keepMounted' :keep-mounted='false'>
				<NTabsList>
					<NTabsTab value='first'>
						First
					</NTabsTab>
					<NTabsTab value='second'>
						Second
					</NTabsTab>
					<NTabsTab value='third'>
						Third
					</NTabsTab>
				</NTabsList>
				<NTabsPanel value='first'>
					First panel (unmounted when inactive)
				</NTabsPanel>
				<NTabsPanel value='second'>
					Second panel (unmounted when inactive)
				</NTabsPanel>
				<NTabsPanel value='third'>
					Third panel (unmounted when inactive)
				</NTabsPanel>
			</NTabsRoot>
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
