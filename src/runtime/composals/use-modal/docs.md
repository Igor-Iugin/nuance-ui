# Modal System

Система управления модальными окнами на основе промисов. Позволяет открывать модалки императивно из любого места приложения и получать результат через `await`.

## Архитектура

```
ModalManager (singleton)        — хранит состояния всех модалок, управляет жизненным циклом
  ├─ create() / createLazy()    — регистрирует компонент модалки и возвращает функцию-открывашку
  ├─ show() / hide() / reject() — императивное управление
  └─ state()                    — реактивное состояние для использования внутри компонента

useModal(id)                    — composable для компонента модалки (opened + resolve)

ModalProvider                   — рендерит все активные модалки в DOM
```

## Быстрый старт

### 1. Регистрация модалки

```ts
// src/runtime/components/modals/_my-modal/index.ts
import { $modals } from '@nui/composals'

import MyModal from './my-modal.vue'


export const openMyModal = $modals.create<MyModalProps, string>(
	'my-modal',
	MyModal,
)
```

### 2. Компонент модалки

```vue
<!-- my-modal.vue -->
<script setup lang="ts">
import { useModal } from '@nui/composals'


defineProps<{ message: string }>()

const { opened, resolve } = useModal('my-modal')
</script>

<template>
	<ModalRoot v-model:open='opened'>
		<p>{{ message }}</p>
		<button @click="resolve('ok')">
			OK
		</button>
	</ModalRoot>
</template>
```

### 3. Вызов из любого места

```ts
const result = await openMyModal({ message: 'Hello!' })
// result: 'ok'
```

---

## API

### `ModalManager`

> Файл: `modal-manager.ts`

Singleton-класс, управляющий реестром и жизненным циклом модальных окон. Экспортируется как `$modals`.

```ts
import { $modals } from '@nui/composals'
```

#### `create<TProps, TResult>(id, component)`

Регистрирует компонент модалки и возвращает типизированную функцию для её открытия.

```ts
const openModal = $modals.create<{ name: string }, boolean>(
	'greeting',
	GreetingModal,
)

const confirmed = await openModal({ name: 'World' })
```

- **id** — уникальный строковый идентификатор модалки
- **component** — Vue-компонент
- **Возвращает** — `(props?) => Promise<TResult>`

#### `createLazy<TProps, TResult>(id, loader)`

Аналогичен `create`, но компонент загружается лениво при первом открытии.

```ts
const openHeavyModal = $modals.createLazy<HeavyProps, void>(
	'heavy',
	() => import('./heavy-modal.vue'),
)
```

#### `show<T>(id, props?)`

Открывает ранее зарегистрированную модалку по `id`. Возвращает `Promise<T>`.

#### `hide(id, result?)`

Закрывает модалку, резолвит промис переданным `result`.

#### `reject(id, reason?)`

Закрывает модалку, реджектит промис переданным `reason`.

#### `state<Props, Resolve, Reject>(id)`

Возвращает `ComputedRef<ModalState>` — реактивное состояние модалки. Используется внутри компонента модалки через `useModal`.

#### `modals` (getter)

`ShallowRef<Map<string, ModalState>>` — реактивная карта всех активных модалок. Используется в `ModalProvider` для рендеринга.

#### Интерфейс `ModalState`

```ts
interface ModalState<Props, Resolve, Reject> {
	id: string
	component: Component
	props: Props
	opened: boolean
	resolve: (value?: Resolve) => void
	reject: (reason?: Reject) => void
}
```

---

### `useModal(id)`

> Файл: `use-modal.ts`

Composable для использования **внутри** компонента модалки. Связывает компонент с `ModalManager` по `id`.

```ts
const { opened, resolve } = useModal<MyProps, ResultType>('my-modal')
```

#### Возвращает

| Поле | Тип | Описание |
|------|-----|----------|
| `opened` | `WritableComputedRef<boolean>` | Двусторонний binding для открытия/закрытия. При установке в `false` вызывает `reject`. |
| `resolve` | `(reason: Resolve) => void` | Закрывает модалку и резолвит промис переданным значением. |

#### Типизация

```ts
function useModal<
	Props extends Record<string, unknown>,
	Resolve = unknown,
	Reject = unknown,
>(id: string): { opened: WritableComputedRef<boolean>, resolve: (reason: Resolve) => void }
```

> **Важно:** `id` должен совпадать с тем, что передан в `$modals.create()`.

---

### `ModalProvider`

> Файл: `modal-provider.vue`

Компонент-контейнер, который рендерит все активные модалки. Должен быть размещён один раз в корне приложения (обычно в `app.vue` или layout).

```vue
<template>
	<NuxtPage />
	<ModalProvider />
</template>
```

Внутри итерирует `$modals.modals` и рендерит каждую модалку через `<component :is="..." v-bind="props" />`.

---

## Встроенные модалки

### `ConfirmModal`

> Файл: `_confirm-modal/confirm-modal.vue`

Модалка подтверждения с кнопками «Confirm» / «Cancel». Зарегистрирована с `id = 'confirm'`.

#### Props (`ConfirmModalProps`)

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `title` | `string` | — | Заголовок модалки (обязательный) |
| `body` | `string` | — | Текст описания |
| `labels` | `{ confirm: string, cancel: string }` | `{ confirm: 'Confirm', cancel: 'Cancel' }` | Тексты кнопок |
| `variant` | `'default' \| 'danger'` | `'default'` | При `'danger'` кнопка подтверждения становится красной |
| `onCancel` | `() => void` | — | Колбэк при отмене |
| `onConfirm` | `() => MaybePromise<void>` | — | Колбэк при подтверждении (поддерживает async) |
| `cancelProps` | `Partial<ButtonProps>` | — | Дополнительные props для кнопки отмены |
| `confirmProps` | `Partial<ButtonProps>` | — | Дополнительные props для кнопки подтверждения |

Также принимает все props от `ModalRootProps` (например `size`).

#### Использование

```ts
import { openConfirmModal } from '@nui/components'

// Простое подтверждение
const confirmed = await openConfirmModal({
	title: 'Удалить запись?',
	body: 'Это действие нельзя отменить.',
	variant: 'danger',
	labels: { confirm: 'Удалить', cancel: 'Отмена' },
})

if (confirmed) {
	// пользователь подтвердил
}
```

#### Результат

- **Resolve** → `true` — пользователь нажал «Confirm»
- **Reject** → промис реджектится — пользователь нажал «Cancel» или закрыл модалку

> **Совет:** оборачивайте вызов в `try/catch`, чтобы обработать отмену:
> ```ts
> try {
> 	const confirmed = await openConfirmModal({ title: '...' })
> }
> catch {
> 	// пользователь отменил
> }
> ```

---

## Паттерны

### Wizard (пошаговые модалки)

Можно вызывать `openConfirmModal` последовательно для реализации пошагового сценария:

```ts
const steps = [
	{ title: 'Шаг 1', body: 'Начать?' },
	{ title: 'Шаг 2', body: 'Продолжить?' },
	{ title: 'Шаг 3', body: 'Завершить?', variant: 'danger' },
]

let current = 0
while (current < steps.length) {
	try {
		const confirmed = await openConfirmModal(steps[current])
		confirmed ? current++ : current--
	}
	catch {
		break // отмена
	}
}
```

### Создание кастомной модалки

1. Создайте компонент в `src/runtime/components/modals/_my-modal/`
2. Внутри компонента используйте `useModal(id)` для получения `opened` и `resolve`
3. В `index.ts` зарегистрируйте через `$modals.create()` и экспортируйте функцию-открывашку
4. Реэкспортируйте из `src/runtime/components/modals/index.ts`

### Lazy-модалки

Для тяжёлых модалок используйте `createLazy`, чтобы компонент загружался только при первом открытии:

```ts
export const openHeavyModal = $modals.createLazy<HeavyProps, void>(
	'heavy',
	() => import('./heavy-modal.vue'),
)
```

### Асинхронный onConfirm

`ConfirmModal` поддерживает асинхронный `onConfirm` — кнопка показывает loading-состояние до завершения:

```ts
await openConfirmModal({
	title: 'Сохранить?',
	onConfirm: async () => {
		await api.save(data)
	},
})
```
