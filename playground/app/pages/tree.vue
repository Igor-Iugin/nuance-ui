<script setup lang='ts'>
import type { TreeItem } from '@nui/components'
import type { AsyncData } from '#app'

import { findTreeItem } from '@nui/utils'


const mockTreeData = ref<TreeItem[]>([
	{
		path: '/Documents',
		name: 'Documents',
		type: 'directory',
		children: [
			{
				path: '/Documents/Work',
				name: 'Work',
				type: 'directory',
				children: [
					{
						path: '/Documents/Work/Projects',
						name: 'Projects',
						type: 'directory',
						children: [
							{
								path: '/Documents/Work/Projects/2024',
								name: '2024',
								type: 'directory',
								children: [
									{
										path: '/Documents/Work/Projects/2024/Q1',
										name: 'Q1',
										type: 'directory',
										children: [
											{
												path: '/Documents/Work/Projects/2024/Q1/budget.xlsx',
												name: 'budget.xlsx',
											},
											{
												path: '/Documents/Work/Projects/2024/Q1/report.pdf',
												name: 'report.pdf',
											},
										],
									},
									{
										path: '/Documents/Work/Projects/2024/Q2',
										name: 'Q2',
										type: 'directory',
										children: [
											{
												path: '/Documents/Work/Projects/2024/Q2/analysis.docx',
												name: 'analysis.docx',
											},
										],
									},
								],
							},
							{
								path: '/Documents/Work/Projects/2023',
								name: '2023',
								type: 'directory',
								children: [
									{
										path: '/Documents/Work/Projects/2023/archive.zip',
										name: 'archive.zip',
									},
								],
							},
						],
					},
					{
						path: '/Documents/Work/Meetings',
						name: 'Meetings',
						type: 'directory',
						children: [
							{
								path: '/Documents/Work/Meetings/notes-2024-01.md',
								name: 'notes-2024-01.md',
							},
							{
								path: '/Documents/Work/Meetings/notes-2024-02.md',
								name: 'notes-2024-02.md',
							},
						],
					},
				],
			},
			{
				path: '/Documents/Personal',
				name: 'Personal',
				type: 'directory',
				children: [
					{
						path: '/Documents/Personal/Photos',
						name: 'Photos',
						type: 'directory',
						children: [
							{
								path: '/Documents/Personal/Photos/Vacation',
								name: 'Vacation',
								type: 'directory',
								children: [
									{
										path: '/Documents/Personal/Photos/Vacation/Summer 2024',
										name: 'Summer 2024',
										type: 'directory',
										children: [
											{
												path: '/Documents/Personal/Photos/Vacation/Summer 2024/beach.jpg',
												name: 'beach.jpg',
											},
											{
												path: '/Documents/Personal/Photos/Vacation/Summer 2024/sunset.jpg',
												name: 'sunset.jpg',
											},
											{
												path: '/Documents/Personal/Photos/Vacation/Summer 2024/mountains.jpg',
												name: 'mountains.jpg',
											},
										],
									},
								],
							},
						],
					},
					{
						path: '/Documents/Personal/Music',
						name: 'Music',
						type: 'directory',
						children: [
							{
								path: '/Documents/Personal/Music/playlist.m3u',
								name: 'playlist.m3u',
							},
						],
					},
				],
			},
		],
	},
	{
		path: '/Downloads',
		name: 'Downloads',
		type: 'directory',
		children: [
			{
				path: '/Downloads/Software',
				name: 'Software',
				type: 'directory',
				children: [
					{
						path: '/Downloads/Software/Development',
						name: 'Development',
						type: 'directory',
						children: [
							{
								path: '/Downloads/Software/Development/IDE',
								name: 'IDE',
								type: 'directory',
								children: [
									{
										path: '/Downloads/Software/Development/IDE/Plugins',
										name: 'Plugins',
										type: 'directory',
										children: [
											{
												path: '/Downloads/Software/Development/IDE/Plugins/eslint-plugin.vsix',
												name: 'eslint-plugin.vsix',
											},
											{
												path: '/Downloads/Software/Development/IDE/Plugins/prettier-plugin.vsix',
												name: 'prettier-plugin.vsix',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				path: '/Downloads/setup.exe',
				name: 'setup.exe',
			},
			{
				path: '/Downloads/readme.txt',
				name: 'readme.txt',
			},
		],
	},
	{
		path: '/Projects',
		name: 'Projects',
		type: 'directory',
		children: [
			{
				path: '/Projects/Frontend',
				name: 'Frontend',
				type: 'directory',
				children: [
					{
						path: '/Projects/Frontend/Vue',
						name: 'Vue',
						type: 'directory',
						children: [
							{
								path: '/Projects/Frontend/Vue/Components',
								name: 'Components',
								type: 'directory',
								children: [
									{
										path: '/Projects/Frontend/Vue/Components/UI',
										name: 'UI',
										type: 'directory',
										children: [
											{
												path: '/Projects/Frontend/Vue/Components/UI/Button.vue',
												name: 'Button.vue',
											},
											{
												path: '/Projects/Frontend/Vue/Components/UI/Input.vue',
												name: 'Input.vue',
											},
											{
												path: '/Projects/Frontend/Vue/Components/UI/Tree.vue',
												name: 'Tree.vue',
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		path: '/Archive',
		name: 'Archive',
		type: 'directory',
	},
])

function handleLoad(path: string): AsyncData<TreeItem[], unknown> {
	const pending = ref<boolean>(false)
	const data = shallowRef<TreeItem[]>([])

	const execute = async () => {
		pending.value = true
		await new Promise(resolve => setTimeout(resolve, 500))
		pending.value = false

		if (path === '/')
			data.value = mockTreeData.value.map(({ children: _, ...item }) => item)
		else
			data.value = findTreeItem(mockTreeData.value, path)?.children ?? []
	}

	return { data, pending, execute } as AsyncData<TreeItem[], unknown>
}
</script>

<template>
	<div :class='$style.root'>
		<NTree :load-branch='handleLoad' selectable />
	</div>
</template>

<style module>
.root {
	max-width: 300px;
}
</style>
