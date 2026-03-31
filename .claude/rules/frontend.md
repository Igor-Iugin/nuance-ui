---
globs: ["*.vue", "*.ts"]
---

## Стиль кода

Комментарии для разделения кода на логические блоки используй комментарии формата:
```
// ─── {NAME} ───
```


# Engine

## Координаты и viewport

- **FederatedPointerEvent (Pixi-события):** используй `e.global.x/y` для передачи в `viewport.toWorld()`. Это screen-координаты canvas.
- **Нативный PointerEvent (window.pointermove/pointerup):** используй `e.layerX/layerY` для `viewport.toWorld()`. Это координаты относительно canvas-элемента.
- **Никогда не используй `clientX/clientY` с `viewport.toWorld()`** — это координаты относительно окна браузера, а не canvas. Разница = отступ canvas от угла окна (toolbar, sidebar и т.п.), что даёт смещение вниз-вправо.
