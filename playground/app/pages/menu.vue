<script lang='ts' setup>
const checkboxValue = ref<string[]>([])
const radioValue = ref<string>()
const lastClicked = ref('')
</script>

<template>
	<div class='root'>
		<!-- ─── Basic ─── -->
		<section>
			<p class='label'>
				Basic
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Open menu</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuItem @click='lastClicked = "Profile"'>
						Profile
					</NMenuItem>
					<NMenuItem @click='lastClicked = "Settings"'>
						Settings
					</NMenuItem>
					<NMenuItem @click='lastClicked = "Help"'>
						Help
					</NMenuItem>
				</NMenuDropdown>
			</NMenu>
			<span v-if='lastClicked' class='hint'>Last clicked: {{ lastClicked }}</span>
		</section>

		<!-- ─── Labels and Divider ─── -->
		<section>
			<p class='label'>
				Labels and Divider
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Account</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuLabel>Account</NMenuLabel>
					<NMenuItem>Profile</NMenuItem>
					<NMenuItem>Email</NMenuItem>
					<NMenuDivider />
					<NMenuLabel>Danger zone</NMenuLabel>
					<NMenuItem color='red'>
						Delete account
					</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Disabled items ─── -->
		<section>
			<p class='label'>
				Disabled items
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Options</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuItem>Active item</NMenuItem>
					<NMenuItem disabled>
						Disabled item
					</NMenuItem>
					<NMenuItem>Active item</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── closeOnItemClick ─── -->
		<section>
			<p class='label'>
				closeOnItemClick
			</p>
			<NMenu close-on-item-click>
				<NMenuTarget>
					<NButton>Auto-close</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuItem>Item 1</NMenuItem>
					<NMenuItem>Item 2</NMenuItem>
					<NMenuItem>Item 3</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Checkbox items ─── -->
		<section>
			<p class='label'>
				Checkbox items — selected: {{ checkboxValue.join(', ') || 'none' }}
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Columns</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuCheckboxGroup v-model='checkboxValue'>
						<NMenuCheckboxItem value='name' icon='lucide:person-standing'>
							Name
						</NMenuCheckboxItem>
						<NMenuCheckboxItem value='email'>
							Email
						</NMenuCheckboxItem>
						<NMenuCheckboxItem value='role'>
							Role
						</NMenuCheckboxItem>
					</NMenuCheckboxGroup>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Radio items ─── -->
		<section>
			<p class='label'>
				Radio items — selected: {{ radioValue ?? 'none' }}
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Sort by</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuRadioGroup v-model='radioValue'>
						<NMenuRadioItem value='name'>
							Name
						</NMenuRadioItem>
						<NMenuRadioItem value='date'>
							Date
						</NMenuRadioItem>
						<NMenuRadioItem value='size'>
							Size
						</NMenuRadioItem>
					</NMenuRadioGroup>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Submenu ─── -->
		<section>
			<p class='label'>
				Submenu
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>File</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuItem>New file</NMenuItem>
					<NMenuItem>Open</NMenuItem>
					<NMenuSub>
						<NMenuSubItem>Export</NMenuSubItem>
						<NMenuSubDropdown>
							<NMenuItem>As PDF</NMenuItem>
							<NMenuItem>As PNG</NMenuItem>
							<NMenuItem>As SVG</NMenuItem>
						</NMenuSubDropdown>
					</NMenuSub>
					<NMenuDivider />
					<NMenuItem>Close</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Search ─── -->
		<section>
			<p class='label'>
				Search
			</p>
			<NMenu>
				<NMenuTarget>
					<NButton>Framework</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuSearch placeholder='Search...' />
					<NMenuItem>Vue</NMenuItem>
					<NMenuItem>React</NMenuItem>
					<NMenuItem>Svelte</NMenuItem>
					<NMenuItem>Angular</NMenuItem>
					<NMenuItem>Solid</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Hover trigger ─── -->
		<section>
			<p class='label'>
				trigger: hover
			</p>
			<NMenu trigger='hover'>
				<NMenuTarget>
					<NButton>Hover me</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuItem>Item 1</NMenuItem>
					<NMenuItem>Item 2</NMenuItem>
					<NMenuItem>Item 3</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── alignItemsLabels ─── -->
		<section>
			<p class='label'>
				alignItemsLabels: all
			</p>
			<NMenu align-items-labels='all'>
				<NMenuTarget>
					<NButton>Edit</NButton>
				</NMenuTarget>
				<NMenuDropdown>
					<NMenuCheckboxItem :close-menu-on-click='false'>
						Bold
					</NMenuCheckboxItem>
					<NMenuCheckboxItem :close-menu-on-click='false'>
						Italic
					</NMenuCheckboxItem>
					<NMenuDivider />
					<NMenuItem>Copy</NMenuItem>
					<NMenuItem>Paste</NMenuItem>
				</NMenuDropdown>
			</NMenu>
		</section>

		<!-- ─── Context menu ─── -->
		<section>
			<p class='label'>
				Context menu (right-click)
			</p>
			<NMenuContextMenu close-on-item-click>
				<template #trigger='{ onContextMenu }'>
					<div class='context-area' @contextmenu='onContextMenu'>
						Right-click here
					</div>
				</template>
				<NMenuItem>Cut</NMenuItem>
				<NMenuItem>Copy</NMenuItem>
				<NMenuItem>Paste</NMenuItem>
			</NMenuContextMenu>
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

.hint {
	display: block;

	margin-top: 0.5rem;

	font-size: 0.75rem;
	color: var(--color-gray-5);
}

.context-area {
	user-select: none;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 200px;
	height: 80px;

	border: 1px dashed var(--color-gray-4);
	border-radius: 8px;

	font-size: 0.875rem;
	color: var(--color-gray-6);
}
</style>
