# Nuance-UI

A modern UI kit module for Nuxt 3 with thoughtfully designed components and subtle interaction details.

## 📦 Installation

```bash
# npm
npm install nuance-ui

# yarn
yarn add nuance-ui

# pnpm
pnpm add nuance-ui
```

### Install modules

```bash
npx nuxt module add color-mode icon
```

## Quick Start

Add `nuance-ui` to the `modules` section of your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
	modules: ['nuance-ui'],
})
```

Now you can use components in your application:

```vue
<template>
	<div>
		<NButton variant='primary'>
			Click me
		</NButton>

		<NCard>
			<p>Card content goes here</p>
		</NCard>
	</div>
</template>
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Links

- Documentation **WIP**
- [GitHub](https://github.com/Igor-Iugin/nuance-ui)
- [NPM](https://www.npmjs.com/package/nuance-ui)

## Support

If you have questions or issues:

- [Create an Issue](https://github.com/Igor-Iugin/nuance-ui/issues)
- [Discussions](https://github.com/Igor-Iugin/nuance-ui/discussions)

## License

Licensed under the [MIT license](https://github.com/Igor-Iugin/nuance-ui/blob/main/LICENSE.md).
