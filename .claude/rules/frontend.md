---
globs: ["*.vue", "*.ts"]
---

## Стиль кода

Комментарии для разделения кода на логические блоки используй комментарии формата:
```
// ─── {NAME} ───
```

## Структура компонентов

Каждый компонент в `src/runtime/components/<name>/` следует единой схеме:

```
components/<name>/
├── index.ts                  — публичные экспорты (типы + composables)
├── <name>.vue                — корневой компонент
├── <name>-<part>.vue         — подкомпоненты, если их мало (≤ 4)
├── ui/                       — подкомпоненты, если их много (calendar, combobox, table)
├── lib/                      — внутренняя логика: contexts, composables, helpers
│   ├── context.ts
│   └── use-*.ts
├── lib.ts                    — допустимо вместо папки `lib/`, если реально один файл
├── types.ts                  — типы, не привязанные к .vue (при необходимости)
└── <name>.module.css         — стили (если вынесены)
```

### Правила

- **Типы компонента** — только `types.ts` (не `model.ts`, не `.d.ts`). Исключение: `table.d.ts` с `declare module` для расширения чужих модулей.
- **`lib.ts` vs `lib/`** — если внутренней логики один файл, используй плоский `lib.ts`. Как только появляется второй файл — папка `lib/`.
- **Никаких папок с единственным `index.ts`** внутри компонента (например, `types/index.ts` с одним файлом → просто `types.ts`).
- **Префикс `_`** в названии папки разрешён **только** для папок, содержащих `.vue` компоненты, которые не должны быть доступны пользователю напрямую (например, `loader/_loaders/`, `modals/_confirm-modal/`, `tree/_ui/`). Для `lib/`, `ui/`, `types/` префикс не используется — они и так приватны по соглашению (не экспортируются из `index.ts`).

### `components/<name>/index.ts`

Формат:
```ts
// Типы корневого и подкомпонентов
export type * from './<name>-<part>.vue'
export type * from './<name>.vue'
// Публичные composables / утилиты из lib
export { useXxxState } from './lib/context'
// Локальные типы
export type * from './types'
```

### `components/index.ts` (корневой)

Для `.vue`-файлов, лежащих плоско в `components/`, **всегда** используй `export type * from './foo.vue'`, а не `export * from './foo.vue'`. Компоненты регистрируются Nuxt-модулем, поэтому рантайм-экспорт не нужен — только типы.

Для компонентов-директорий (имеющих свой `index.ts`) используй `export * from './<name>'`, так как их `index.ts` уже сам управляет тем, что публично (composables — рантайм, `.vue` — только типы).


# Engine

## Координаты и viewport

- **FederatedPointerEvent (Pixi-события):** используй `e.global.x/y` для передачи в `viewport.toWorld()`. Это screen-координаты canvas.
- **Нативный PointerEvent (window.pointermove/pointerup):** используй `e.layerX/layerY` для `viewport.toWorld()`. Это координаты относительно canvas-элемента.
- **Никогда не используй `clientX/clientY` с `viewport.toWorld()`** — это координаты относительно окна браузера, а не canvas. Разница = отступ canvas от угла окна (toolbar, sidebar и т.п.), что даёт смещение вниз-вправо.
