# SITVPI

Prototipo web académico, mobile-first y 100 % simulado del Sistema Interoperable de Transparencia y Verificación Patrimonial. No usa backend, APIs externas ni registros reales.

## Ejecutar localmente

Requiere cualquier servidor de archivos estáticos. Con Python:

```bash
python -m http.server 4173
```

Luego abre `http://localhost:4173`.

## Cédulas de prueba

- `79.465.056` — Caso A, aprobado
- `43.876.543` — Caso B, alerta amarilla
- `1.024.570.007` — Caso C, alerta roja

También se aceptan sin puntos, con espacios o guiones.

## Desplegar en Vercel

Desde la raíz del proyecto:

```bash
npx vercel
```

No se necesita comando de compilación; Vercel publica los archivos estáticos directamente. Para producción:

```bash
npx vercel --prod
```

Cuando Vercel entregue la URL pública, genera un QR con esa dirección y verifica el enlace en el celular antes de la ponencia.

## Estructura

- `index.html`: shell accesible y disclaimer permanente.
- `styles.css`: diseño institucional mobile-first y adaptación del reporte a escritorio.
- `data.js`: única fuente de verdad con los tres perfiles ficticios.
- `app.js`: flujo, normalización de cédula y simulación secuencial con `setTimeout`.
- `img/`: fondo institucional y logotipos mostrados durante la recopilación simulada.
- `vercel.json`: configuración de publicación estática.
