# Implementación de CRUD de órdenes en DynamoDB

El sistema debe permitir la creación, lectura, actualización y eliminación de órdenes en una tabla DynamoDB. Cada orden tiene un identificador único, un estado, un monto y una fecha de creación. El sistema debe validar que el monto de la orden sea positivo y que el identificador de la orden no esté duplicado. En caso de error en la validación, el sistema debe registrar el error y retornar un mensaje descriptivo.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | CRUD de ordenes sobre DynamoDB |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 6 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Creación de órdenes

**Objetivo:** Permitir la creación de nuevas órdenes con validación de campos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- El sistema debe permitir la creación de una nueva orden con los campos: identificador único, estado, monto y fecha de creación. Validar que el monto sea positivo y que el identificador no esté duplicado. En caso de error, registrar el error y retornar un mensaje descriptivo.

**Entregable:** Una API REST que permite la creación de nuevas órdenes con validación de campos.

<details>
<summary>Pistas de conocimiento</summary>

- La validación de campos debe ser robusta y retornar mensajes descriptivos en caso de error.

</details>

### Fase 2: Lectura de órdenes

**Objetivo:** Permitir la consulta de órdenes por identificador.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- El sistema debe permitir la consulta de una orden por su identificador único. En caso de que la orden no exista, el sistema debe retornar un mensaje descriptivo.

**Entregable:** Una API REST que permite la consulta de órdenes por identificador.

<details>
<summary>Pistas de conocimiento</summary>

- La consulta debe ser eficiente y retornar un mensaje descriptivo en caso de orden no encontrada.

</details>

### Fase 3: Actualización de órdenes

**Objetivo:** Permitir la actualización de órdenes con validación de campos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- El sistema debe permitir la actualización de una orden existente con los campos: estado y monto. Validar que el monto sea positivo. En caso de error, registrar el error y retornar un mensaje descriptivo.

**Entregable:** Una API REST que permite la actualización de órdenes con validación de campos.

<details>
<summary>Pistas de conocimiento</summary>

- La validación de campos debe ser robusta y retornar mensajes descriptivos en caso de error.
- Terraform: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es una orden y cuáles son sus atributos?
- **paraQueSirve**: ¿Para qué sirve la validación de campos en la creación y actualización de órdenes?
- **comoSeUsa**: ¿Cómo se usa la API REST para crear, consultar y actualizar órdenes?
- **erroresComunes**: ¿Cuáles son los errores comunes al crear, consultar y actualizar órdenes y cómo se manejan?

## Criterios de Evaluacion

- Implementación de la creación de órdenes con validación de campos.
- Implementación de la consulta de órdenes por identificador.
- Implementación de la actualización de órdenes con validación de campos.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `app` | `app/` | practice, chapter | server | Node | Express, DynamoDB |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd app && npm install && npm run build` — componente `app` (practice, chapter).

### Contratos entre componentes

- `app` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd app && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
