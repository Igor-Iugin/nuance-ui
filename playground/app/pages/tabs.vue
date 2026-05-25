<script setup lang='ts'>
const activeUser = ref('igor')
const activeControl = ref('by-user')
</script>

<template>
	<div class='root'>
		<!-- ─── Basic (default) ─── -->
		<section>
			<p class='label'>
				Basic
			</p>
			<NTabsRoot default-tab='gallery'>
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

		<!-- ─── Access management demo ─── -->
		<section class='access-section'>
			<div class='access-header'>
				<h2 class='access-title'>
					Управление доступом
				</h2>
				<NSegmentedControl
					v-model='activeControl'
					:data='[
						{ value: "by-user", label: "По пользователю", icon: "lucide:user" },
						{ value: "by-otp", label: "По ОТП", icon: "lucide:key-round" },
					]'
				/>
			</div>

			<div class='access-body'>
				<!-- Users list -->
				<NTabsRoot
					v-model='activeUser'
					orientation='vertical'
					variant='pills'
					class='users-tabs'
				>
					<NTabsList class='users-list'>
						<NTabsTab value='igor'>
							<template #leftSection>
								<span class='avatar avatar--blue'>ИЮ</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Igor Yugin</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
						<NTabsTab value='anna'>
							<template #leftSection>
								<span class='avatar avatar--purple'>АС</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Анна Соколова</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
						<NTabsTab value='dmitry'>
							<template #leftSection>
								<span class='avatar avatar--olive'>ДО</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Дмитрий Орлов</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
						<NTabsTab value='maria'>
							<template #leftSection>
								<span class='avatar avatar--orange'>МЗ</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Мария Зайцева</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
						<NTabsTab value='sergey'>
							<template #leftSection>
								<span class='avatar avatar--teal'>СП</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Сергей Петров</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
						<NTabsTab value='elena'>
							<template #leftSection>
								<span class='avatar avatar--green'>ЕИ</span>
							</template>
							<span class='user-info'>
								<span class='user-name'>Елена Иванова</span>
								<span class='user-meta'>4 ОТР</span>
							</span>
						</NTabsTab>
					</NTabsList>

					<!-- OTP panels -->
					<NTabsPanel value='igor' class='otp-panel'>
						<OtpPanel
							name='Igor Yugin'
							handle='@i.yugin'
							count='4 из 6'
							:items='[
								{ id: "TE", name: "Test", desc: "Тестовое ОТП для рабочих нужд", active: false },
								{ id: "PD", name: "Production DB", desc: "Доступ к продовой базе данных", active: true },
								{ id: "VL", name: "Vault", desc: "HashiCorp Vault административный", active: true },
								{ id: "CI", name: "CI/CD Bot", desc: "Сервисный токен для пайплайнов", active: false },
								{ id: "MO", name: "Monitoring", desc: "Grafana + Prometheus alert manager", active: true },
								{ id: "BK", name: "Backup", desc: "Доступ к S3-бакету с бэкапами", active: true },
							]'
						/>
					</NTabsPanel>
					<NTabsPanel value='anna' class='otp-panel'>
						<OtpPanel
							name='Анна Соколова'
							handle='@a.sokolova'
							count='4 из 6'
							:items='[
								{ id: "TE", name: "Test", desc: "Тестовое ОТП для рабочих нужд", active: true },
								{ id: "PD", name: "Production DB", desc: "Доступ к продовой базе данных", active: false },
								{ id: "VL", name: "Vault", desc: "HashiCorp Vault административный", active: true },
								{ id: "CI", name: "CI/CD Bot", desc: "Сервисный токен для пайплайнов", active: true },
								{ id: "MO", name: "Monitoring", desc: "Grafana + Prometheus alert manager", active: false },
								{ id: "BK", name: "Backup", desc: "Доступ к S3-бакету с бэкапами", active: true },
							]'
						/>
					</NTabsPanel>
					<NTabsPanel value='dmitry' class='otp-panel'>
						<OtpPanel name='Дмитрий Орлов' handle='@d.orlov' count='4 из 6' :items='[]' />
					</NTabsPanel>
					<NTabsPanel value='maria' class='otp-panel'>
						<OtpPanel name='Мария Зайцева' handle='@m.zaitseva' count='4 из 6' :items='[]' />
					</NTabsPanel>
					<NTabsPanel value='sergey' class='otp-panel'>
						<OtpPanel name='Сергей Петров' handle='@s.petrov' count='4 из 6' :items='[]' />
					</NTabsPanel>
					<NTabsPanel value='elena' class='otp-panel'>
						<OtpPanel name='Елена Иванова' handle='@e.ivanova' count='4 из 6' :items='[]' />
					</NTabsPanel>
				</NTabsRoot>
			</div>
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

/* ─── Access management ─── */
.access-section {
	gap: 1rem;
	align-items: stretch;

	padding: 1.5rem;
	border-radius: 0.75rem;

	background-color: var(--color-dark-8, #1a1f2e);
}

.access-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.access-title {
	margin: 0;

	font-size: 1.25rem;
	font-weight: 600;
	color: var(--color-white);
}

.access-body {
	display: flex;
	flex: 1;
}

.users-tabs {
	flex: 1;
}

.users-list {
	width: 16rem;
	min-width: 16rem;
}

.avatar {
	display: inline-flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;

	width: 2rem;
	height: 2rem;
	border-radius: 0.375rem;

	font-size: 0.75rem;
	font-weight: 600;
	color: white;
}

.avatar--blue {
	background-color: #3b82f6;
}

.avatar--purple {
	background-color: #8b5cf6;
}

.avatar--olive {
	background-color: #84cc16;
}

.avatar--orange {
	background-color: #f59e0b;
}

.avatar--teal {
	background-color: #06b6d4;
}

.avatar--green {
	background-color: #10b981;
}

.user-info {
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
	align-items: flex-start;
}

.user-name {
	font-size: 0.875rem;
	font-weight: 500;
}

.user-meta {
	font-size: 0.75rem;

	opacity: 0.6;
}

.otp-panel {
	flex: 1;

	padding-inline-start: 1rem;
}
</style>
