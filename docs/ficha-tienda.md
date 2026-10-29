# Ficha para las tiendas — Pokeking Traductor (Español) 1.9.1

## Nombre
Pokeking Traductor (Español)

## Resumen (máx. 132 caracteres)
Traductor de Poke-King en español, forzador del modo oscuro y sistema de reportes. Además te hace 5% más guapo por usarla ;)

## Descripción larga
Esta extensión funciona como Traductor de Poke-King en español, forzador del modo oscuro y como sistema de reportes, además que te hace 5% más guapo por usarla ;)

Pokeking Traductor (Español) traduce al español el contenido en chino de pokeking.icu mientras navegas, para que puedas seguir los equipos y estrategias de la Elite 4 sin copiar y pegar en traductores externos.

- Traducción automática de movimientos, habilidades, objetos, naturalezas y textos de la web con sus nombres oficiales en español.
- Botón CN/ES para alternar entre el texto original en chino y la traducción. La extensión recuerda tu elección.
- Modo oscuro con un botón «Oscuro/Claro» que también recuerda tu elección.
- También traduce los equipos escritos en inglés (movimientos, habilidades, objetos, tipos y jerga habitual de estrategia).
- Pasa el ratón sobre cualquier texto traducido para ver el original en chino.
- Reporte de errores: selecciona el texto incorrecto (clic derecho en PC, o tocar y pulsar «Reportar error» en móvil) y envía la corrección sugerida.
- El diccionario se actualiza solo cada hora, sin reinstalar la extensión.
- Funciona en Chrome, Edge y Firefox (incluido Firefox para Android).

Extensión no oficial, sin relación con Pokeking ni con Nintendo, Game Freak o The Pokémon Company. Software libre bajo licencia MIT.

## Propósito único (Chrome Web Store)
Traducir al español el contenido del sitio Pokeking mientras se navega.

## Justificación de permisos
| Permiso | Para qué se usa |
|---|---|
| `storage` | Guardar el diccionario descargado y tus preferencias (CN/ES y modo oscuro). |
| `alarms` | Actualizar el diccionario cada hora. |
| `contextMenus` | Añadir «Reportar error / mala traducción» al clic derecho. |
| `scripting` | Leer el texto seleccionado cuando eliges esa opción del menú. |
| `*://*.pokeking.icu/*` | Es el único sitio donde la extensión traduce. |
| `https://compscimmo.github.io/*` | Descargar el diccionario de traducciones. |
| `https://script.google.com/*`, `https://script.googleusercontent.com/*` | Enviar los reportes de error que el usuario decide mandar. |

No se usa código remoto: el diccionario es solo datos (JSON) y no se ejecuta.

## Privacidad
- La extensión **no recopila** datos personales, historial ni analíticas.
- Solo envía información cuando el usuario pulsa «Enviar reporte»: el texto reportado, la traducción actual, la dirección de la página, el contexto de la ruta (región, miembro, Pokémon líder) y los campos opcionales que el usuario escriba (nombre en el juego, equipo, código, comentario).
- Esos reportes van a una hoja de Google Apps Script del proyecto, para corregir el diccionario.
- Todo lo demás (diccionario y preferencias) se guarda localmente en el navegador.
- Texto completo en `PRIVACY.md`.

## Antes de enviar a revisión
- Capturas: 1280×800 (Chrome) de una página de Pokeking traducida, del modo oscuro y del formulario de reporte.
- URL de política de privacidad: publica `PRIVACY.md` en una página pública (GitHub Pages sirve) y pega el enlace.
- Si cambias el destino de los reportes, actualiza `REPORT_URL` en `background.js` y esta ficha.
