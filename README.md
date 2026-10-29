# Pokeking Traductor (Español)

Extensión de navegador que traduce al **español** el contenido en chino de [pokeking.icu](https://pokeking.icu): movimientos, habilidades, objetos, naturalezas y los textos de la web, para poder seguir los equipos y estrategias de la Elite 4 sin copiar y pegar en traductores externos.

> Extensión no oficial. No tiene relación con Pokeking, Nintendo, Game Freak ni The Pokémon Company.

## Características

- Traducción automática mientras navegas, con los nombres oficiales en español.
- También traduce los equipos **escritos en inglés** por la comunidad (movimientos, habilidades, objetos y jerga como "Tbolt kill" o "See under").
- Botón **CN / ES** para alternar entre el texto original en chino y la traducción (recuerda tu elección).
- Pasa el ratón sobre un texto traducido para ver el original en chino.
- **Modo oscuro** (botón «Oscuro/Claro»): fondo negro, letras blancas y el rojo reservado a las líneas del paso a paso.
- **Reporte de errores**: selecciona el texto incorrecto (clic derecho en PC, o tocar y pulsar «Reportar error» en móvil) y envía la corrección.
- El diccionario se actualiza solo cada hora, sin reinstalar.
- Funciona en Chrome, Edge y Firefox (incluido Firefox para Android).

## Instalación

### Chrome / Edge / Opera (PC)

1. Descarga el ZIP más reciente de la sección **Releases** y descomprímelo.
2. Abre `chrome://extensions` (o `edge://extensions`) y activa el **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta descomprimida (la que contiene `manifest.json`).

### Firefox

- Para probarla: abre `about:debugging#/runtime/this-firefox` → **Cargar complemento temporal** → elige `manifest.json`.
- Una instalación permanente requiere publicarla en [addons.mozilla.org](https://addons.mozilla.org).

### iOS

Apple no permite extensiones fuera de su tienda, por lo que no hay soporte.

## Cómo funciona

1. La extensión descarga un diccionario comunitario **chino → inglés** (alojado en GitHub Pages) y lo guarda en el navegador.
2. Una capa propia (`extension/dictionary_es.js`) pasa cada valor del inglés al **español oficial** y añade correcciones y frases en chino que el diccionario original no cubre.
3. Un script (`extension/content.js`) sustituye el texto de la página, vigila los cambios y aplica el modo oscuro.

Lo que no tiene traducción en `dictionary_es.js` se queda en inglés.

## Mejorar las traducciones

Todo está en `extension/dictionary_es.js`, con formato `"clave": "Traducción"`:

| Bloque | Clave | Para qué |
|---|---|---|
| `MOVES`, `ABILITIES`, `ITEMS`, `NATURES`, `GENERAL` | inglés, en minúsculas | Cambiar cómo se muestra un valor del diccionario original. |
| `WORDS`, `OVERRIDES` | chino | Añadir o corregir palabras y frases chinas directamente. |
| `EXACT` | chino | Textos que son exactamente esa palabra (p. ej. los tipos). |
| `STRATEGY_EN` | inglés, en minúsculas | Jerga y abreviaturas de equipos escritos en inglés. Los movimientos, habilidades y objetos de `MOVES`, `ABILITIES` e `ITEMS` también se traducen cuando aparecen en inglés. |

Las pull requests con traducciones y correcciones son bienvenidas.

## Desarrollo

```bash
git clone https://github.com/Tizzians/Traductor-de-Poke-King.git
cd Traductor-de-Poke-King
./scripts/empaquetar.sh    # crea pokeking-traductor-es-<versión>.zip
```

No hay dependencias ni paso de compilación: el código de `extension/` es el que se carga en el navegador.

## Privacidad y avisos

- No se recopilan datos personales, historial ni analíticas. Ver [PRIVACY.md](PRIVACY.md).
- **Reportes de error:** al pulsar «Enviar reporte», el texto y los campos que escribas se envían a una hoja de cálculo de Google propia del autor, mediante Google Apps Script. Si `REPORT_URL` (en `extension/background.js`) está vacía, no se envía nada. Para crear tu propia hoja: [docs/crear-hoja-de-reportes.md](docs/crear-hoja-de-reportes.md).
- **Dependencia externa:** el diccionario base se descarga de la dirección indicada en `DICTIONARY_URL` (`extension/background.js`). Si ese sitio deja de estar disponible, no se traducirá nada nuevo.

## Autor

Te amo mucho por leer esto papu :v  
Si quieres donarme, mi IGN es "TaddeusMaster", si me ruge la tripa, hacer esto no fue fácil :'v

Quiero hacer un agradecimiento a mi amiga de nombre Anyoleth por proporcionar el dibujo para el icono de mi extensión, sin ella este bonito dibujito de Chansey no hubiera sido realidad.

También quiero hacer un agradecimiento al señor "WileyTheBang" por crear la idea de crear una extensión que traduzca Poke-King, sin él este trabajo no hubiera sido realidad en primer lugar.

## Licencia

[MIT](LICENSE). Este proyecto incluye código de un proyecto anterior publicado bajo la misma licencia; su aviso de copyright se conserva en el archivo de licencia, como exige la propia licencia.
