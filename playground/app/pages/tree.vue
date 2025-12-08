<script setup lang='ts'>
import type { TreeItem } from '@nui/components'


const mockTreeData = ref<TreeItem[]>([
	{
		value: 'root/Documents',
		label: 'Documents',
		expanded: true,
		children: [
			{
				value: 'root/Documents/Work',
				label: 'Work',
				expanded: true,
				children: [
					{
						value: 'root/Documents/Work/Projects',
						label: 'Projects',
						children: [
							{
								value: 'root/Documents/Work/Projects/2024',
								label: '2024',
								children: [
									{
										value: 'root/Documents/Work/Projects/2024/Q1',
										label: 'Q1',
										children: [
											{
												value: 'root/Documents/Work/Projects/2024/Q1/budget.xlsx',
												label: 'budget.xlsx',
											},
											{
												value: 'root/Documents/Work/Projects/2024/Q1/report.pdf',
												label: 'report.pdf',
											},
										],
									},
									{
										value: 'root/Documents/Work/Projects/2024/Q2',
										label: 'Q2',
										children: [
											{
												value: 'root/Documents/Work/Projects/2024/Q2/analysis.docx',
												label: 'analysis.docx',
											},
										],
									},
								],
							},
							{
								value: 'root/Documents/Work/Projects/2023',
								label: '2023',
								children: [
									{
										value: 'root/Documents/Work/Projects/2023/archive.zip',
										label: 'archive.zip',
									},
								],
							},
						],
					},
					{
						value: 'root/Documents/Work/Meetings',
						label: 'Meetings',
						children: [
							{
								value: 'root/Documents/Work/Meetings/notes-2024-01.md',
								label: 'notes-2024-01.md',
							},
							{
								value: 'root/Documents/Work/Meetings/notes-2024-02.md',
								label: 'notes-2024-02.md',
							},
						],
					},
				],
			},
			{
				value: 'root/Documents/Personal',
				label: 'Personal',
				children: [
					{
						value: 'root/Documents/Personal/Photos',
						label: 'Photos',
						children: [
							{
								value: 'root/Documents/Personal/Photos/Vacation',
								label: 'Vacation',
								children: [
									{
										value: 'root/Documents/Personal/Photos/Vacation/Summer 2024',
										label: 'Summer 2024',
										children: [
											{
												value: 'root/Documents/Personal/Photos/Vacation/Summer 2024/beach.jpg',
												label: 'beach.jpg',
											},
											{
												value: 'root/Documents/Personal/Photos/Vacation/Summer 2024/sunset.jpg',
												label: 'sunset.jpg',
											},
											{
												value: 'root/Documents/Personal/Photos/Vacation/Summer 2024/mountains.jpg',
												label: 'mountains.jpg',
											},
										],
									},
								],
							},
						],
					},
					{
						value: 'root/Documents/Personal/Music',
						label: 'Music',
						children: [
							{
								value: 'root/Documents/Personal/Music/playlist.m3u',
								label: 'playlist.m3u',
							},
						],
					},
				],
			},
		],
	},
	{
		value: 'root/Downloads',
		label: 'Downloads',
		children: [
			{
				value: 'root/Downloads/Software',
				label: 'Software',
				children: [
					{
						value: 'root/Downloads/Software/Development',
						label: 'Development',
						children: [
							{
								value: 'root/Downloads/Software/Development/IDE',
								label: 'IDE',
								children: [
									{
										value: 'root/Downloads/Software/Development/IDE/Plugins',
										label: 'Plugins',
										children: [
											{
												value: 'root/Downloads/Software/Development/IDE/Plugins/eslint-plugin.vsix',
												label: 'eslint-plugin.vsix',
											},
											{
												value: 'root/Downloads/Software/Development/IDE/Plugins/prettier-plugin.vsix',
												label: 'prettier-plugin.vsix',
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
				value: 'root/Downloads/setup.exe',
				label: 'setup.exe',
			},
			{
				value: 'root/Downloads/readme.txt',
				label: 'readme.txt',
			},
		],
	},
	{
		value: 'root/Projects',
		label: 'Projects',
		disabled: true,
		children: [
			{
				value: 'root/Projects/Frontend',
				label: 'Frontend',
				children: [
					{
						value: 'root/Projects/Frontend/Vue',
						label: 'Vue',
						children: [
							{
								value: 'root/Projects/Frontend/Vue/Components',
								label: 'Components',
								children: [
									{
										value: 'root/Projects/Frontend/Vue/Components/UI',
										label: 'UI',
										children: [
											{
												value: 'root/Projects/Frontend/Vue/Components/UI/Button.vue',
												label: 'Button.vue',
											},
											{
												value: 'root/Projects/Frontend/Vue/Components/UI/Input.vue',
												label: 'Input.vue',
											},
											{
												value: 'root/Projects/Frontend/Vue/Components/UI/Tree.vue',
												label: 'Tree.vue',
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
		value: 'root/Archive',
		label: 'Archive',
	},
])
</script>

<template>
	<NTree v-model:tree='mockTreeData' removable selectable />
</template>
