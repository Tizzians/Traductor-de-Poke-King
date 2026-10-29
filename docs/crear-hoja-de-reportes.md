# Crear tu propia hoja de reportes

Cuando un usuario pulsa «Enviar reporte», la extensión manda el texto a una **aplicación web de Google Apps Script** que lo guarda en una hoja de cálculo tuya. Se hace una sola vez y es gratis.

## Pasos

1. Entra en [sheets.google.com](https://sheets.google.com) con tu cuenta de Google y crea una **hoja en blanco**. Ponle un nombre, por ejemplo «Reportes PokeKING».
2. En el menú de la hoja: **Extensiones → Apps Script**.
3. Borra el código de ejemplo y pega todo el contenido de [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Pulsa el icono de guardar.
4. Arriba a la derecha: **Implementar → Nueva implementación**.
   - Pulsa el engranaje junto a «Seleccionar tipo» y elige **Aplicación web**.
   - **Ejecutar como:** *Yo*.
   - **Quién tiene acceso:** *Cualquier persona*.
   - Pulsa **Implementar**.
5. Google te pedirá permisos. Pulsa **Autorizar acceso**, elige tu cuenta y, si aparece «Google no ha verificado esta aplicación», pulsa **Configuración avanzada → Ir a (nombre del proyecto)**. Es tu propio script, así que es seguro.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. Abre `extension/background.js`, busca `REPORT_URL` y pega la URL entre las comillas:

   ```js
   const REPORT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

8. Vuelve a cargar la extensión en el navegador.

## Probarlo

- Abre la URL `/exec` en una pestaña: debe mostrar `{"success":true,"message":"El servicio de reportes está activo."}`.
- Desde Pokeking, selecciona un texto, pulsa **Reportar error** y envía un reporte de prueba. En la hoja aparecerá una pestaña **Reportes** con una fila nueva.

## Cosas que conviene saber

- **Si cambias el código** del script: **Implementar → Administrar implementaciones →** lápiz **→ Versión: Nueva versión**. La URL se mantiene.
- **«Cualquier persona»** es necesario para que la extensión pueda enviar sin iniciar sesión. Eso significa que cualquiera con la URL podría enviar reportes falsos. El script limita la longitud de cada campo y neutraliza fórmulas, pero no puede autenticar a quien envía.
- **La hoja contiene los datos que los usuarios deciden enviar** (texto reportado, página, y los campos opcionales que escriban). Mantén la hoja privada y no la compartas públicamente.
- Si no configuras `REPORT_URL`, el botón de reporte mostrará que los reportes aún no están configurados, y no se enviará nada a ningún sitio.
