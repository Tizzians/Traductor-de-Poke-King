// Capa inglés -> español.
// El diccionario remoto traduce chino -> inglés; aquí cada valor en inglés se pasa a su
// nombre oficial en español. Lo que no esté en esta lista se queda tal cual (en inglés),
// por ejemplo los nombres de Pokémon, que son iguales en español.
// Claves: en minúsculas, sin espacios sobrantes.
(function () {
    "use strict";

    const TYPES = {
        "bug": "Bicho", "dark": "Siniestro", "dragon": "Dragón", "electric": "Eléctrico",
        "fairy": "Hada", "fighting": "Lucha", "fire": "Fuego", "flying": "Volador",
        "ghost": "Fantasma", "grass": "Planta", "ground": "Tierra", "ice": "Hielo",
        "normal": "Normal", "poison": "Veneno", "psychic": "Psíquico", "rock": "Roca",
        "steel": "Acero", "water": "Agua"
    };

    const ABILITIES = {
        "normalize": "Normalidad", "steadfast": "Impasible", "defiant": "Rebeldía",
        "insomnia": "Insomnio", "toxic boost": "Ímpetu Tóxico", "flare boost": "Ímpetu Ardiente",
        "wind rider": "Surcavientos", "big pecks": "Sacapecho", "water absorb": "Absorbe Agua",
        "volt absorb": "Absorbe Elec", "flash fire": "Absorbe Fuego", "regenerator": "Regeneración",
        "ice body": "Cuerpo Gélido", "analytic": "Cálculo Final", "speed boost": "Impulso",
        "neutralizing gas": "Gas Reactivo", "simple": "Simple", "thick fat": "Sebo",
        "imposter": "Impostor", "chlorophyll": "Clorofila", "synchronize": "Sincronía",
        "sand spit": "Expulsarena", "contrary": "Respondón", "solid rock": "Roca Sólida",
        "rock head": "Cabeza Roca", "compound eyes": "Ojo Compuesto", "multiscale": "Multiescamas",
        "serene grace": "Dicha", "solar power": "Poder Solar", "wonder skin": "Piel Milagro",
        "competitive": "Competitividad", "intimidate": "Intimidación", "effect spore": "Efecto Espora",
        "frisk": "Fisgón", "vital spirit": "Espíritu Vital", "dry skin": "Piel Seca",
        "illusion": "Ilusión", "storm drain": "Colector", "aftermath": "Detonación",
        "sheer force": "Potencia Bruta", "moody": "Veleta", "telepathy": "Telepatía",
        "hyper cutter": "Corte Fuerte", "clear body": "Cuerpo Puro", "prankster": "Bromista",
        "swift swim": "Nado Rápido", "anger point": "Irascible", "own tempo": "Ritmo Propio",
        "battle armor": "Armadura Batalla", "sand stream": "Chorro Arena", "technician": "Experto",
        "sand rush": "Ímpetu Arena", "slush rush": "Quitanieves", "harvest": "Cosecha",
        "no guard": "Indefenso", "cloud nine": "Aclimatación", "drought": "Sequía",
        "tinted lens": "Cromolente", "mummy": "Momia", "justified": "Justiciero", "guts": "Agallas",
        "poison point": "Punto Tóxico", "poison heal": "Antídoto", "water veil": "Velo Agua",
        "sand force": "Poder Arena", "arena trap": "Trampa Arena", "sand veil": "Velo Arena",
        "healer": "Alma Cura", "hustle": "Entusiasmo", "damp": "Humedad", "levitate": "Levitación",
        "torrent": "Torrente", "flame body": "Cuerpo Llama", "magma armor": "Escudo Magma",
        "sniper": "Francotirador", "blaze": "Mar Llamas", "pure power": "Energía Pura",
        "motor drive": "Electromotor", "disguise": "Disfraz", "mold breaker": "Rompemoldes",
        "weak armor": "Armadura Frágil", "shell armor": "Caparazón", "magnet pull": "Imán",
        "wonder guard": "Superguardia", "marvel scale": "Escama Especial", "infiltrator": "Allanamiento",
        "rough skin": "Piel Tosca", "inner focus": "Foco Interno", "unnerve": "Nerviosismo",
        "unaware": "Ignorante", "heatproof": "Ignífugo", "scrappy": "Intrépido", "moxie": "Autoestima",
        "natural cure": "Cura Natural", "reckless": "Audaz", "swarm": "Enjambre",
        "cursed body": "Cuerpo Maldito", "gluttony": "Gula", "super luck": "Afortunado",
        "shadow tag": "Sombra Trampa", "defeatist": "Flaqueza", "unburden": "Liviano",
        "filter": "Filtro", "skill link": "Encadenado", "oblivious": "Despiste",
        "cute charm": "Gran Encanto", "adaptability": "Adaptable", "lightning rod": "Pararrayos",
        "heavy metal": "Metal Pesado", "iron barbs": "Punta Acero", "iron fist": "Puño Férreo",
        "sharpness": "Cortante", "keen eye": "Vista Lince", "overcoat": "Funda", "drizzle": "Llovizna",
        "snow warning": "Nevada", "rain dish": "Cura Lluvia", "snow cloak": "Manto Níveo",
        "static": "Elec. Estática", "pickpocket": "Hurto", "sap sipper": "Herbívoro",
        "magician": "Prestidigitador", "magic bounce": "Espejo Mágico", "magic guard": "Muro Mágico",
        "sticky hold": "Viscosidad", "hydration": "Hidratación", "sturdy": "Robustez",
        "soundproof": "Insonorizar", "huge power": "Potencia", "shed skin": "Mudar", "pressure": "Presión"
    };

    const ITEMS = {
        "sash": "Banda Focus", "focus band": "Cinta Focus", "choice band": "Cinta Elegida",
        "choice scarf": "Pañuelo Elegido", "choice specs": "Gafas Elegidas",
        "assault vest": "Chaleco Asalto", "leftovers": "Restos", "leftover": "Restos",
        "life orb": "Vidasfera", "light ball": "Bola Luminosa", "light clay": "Arcilla Luminosa",
        "air balloon": "Globo Helio", "rocky helmet": "Casco Dentado", "black sludge": "Lodo Negro",
        "expert belt": "Cinta Experto", "muscle band": "Cinta Fuerte", "wise glasses": "Gafas Especiales",
        "eviolite": "Mineral Evolutivo", "flame orb": "Llamasfera", "toxic orb": "Toxisfera",
        "weakness policy": "Seguro Debilidad", "safety goggles": "Gafas Protectoras",
        "leek": "Puerro", "lucky punch": "Puño Suerte", "metal coat": "Revest. Metálico",
        "mystic water": "Agua Mística", "charcoal": "Carbón", "magnet": "Imán",
        "never-melt ice": "Antiderretir", "miracle seed": "Semilla Milagro",
        "black belt": "Cinturón Negro", "black glasses": "Gafas de Sol", "hard stone": "Piedra Dura",
        "sharp beak": "Pico Afilado", "poison barb": "Flecha Venenosa", "soft sand": "Arena Fina",
        "silver powder": "Polvo Plata", "spell tag": "Hechizo", "twisted spoon": "Cuchara Torcida",
        "silk scarf": "Pañuelo Seda", "dragon fang": "Colmillo Dragón", "bright powder": "Polvo Brillo",
        "scope lens": "Periscopio", "zoom lens": "Lente Zoom", "wide lens": "Lupa",
        "king's rock": "Roca del Rey", "razor claw": "Garra Afilada", "razor fang": "Colmillo Agudo",
        "iron ball": "Bola Férrea", "lagging tail": "Cola Plúmbea", "power herb": "Hierba Única",
        "mental herb": "Hierba Mental", "white herb": "Hierba Blanca", "damp rock": "Roca Lluvia",
        "heat rock": "Roca Calor", "icy rock": "Roca Helada", "smooth rock": "Roca Suave",
        "thick club": "Hueso Grueso", "sitrus berry": "Baya Aranja", "lum berry": "Baya Ziuela",
        "hyper potion": "Hiperpoción", "max pot": "Máx. Poción", "full heal": "Cura Total",
        "full restore": "Restaurar Todo", "revive": "Revivir", "energy root": "Raíz Energía",
        "x atk": "Ataque X", "x def": "Defensa X", "x speed": "Velocidad X",
        "x spa": "At. Esp. X", "x sp def": "Def. Esp. X", "dire hit": "Crítico X"
    };

    const NATURES = {
        "adamant": "Firme", "bashful": "Tímido", "bold": "Osado", "brave": "Audaz",
        "calm": "Sereno", "docile": "Dócil", "gentle": "Amable", "hardy": "Fuerte",
        "hasty": "Activo", "impish": "Agitado", "jolly": "Alegre", "lax": "Flojo",
        "lonely": "Huraño", "mild": "Afable", "modest": "Modesto", "naive": "Ingenuo",
        "naughty": "Pícaro", "quiet": "Manso", "quirky": "Raro", "rash": "Alocado",
        "relaxed": "Plácido", "sassy": "Grosero", "serious": "Serio", "timid": "Miedoso"
    };

    const MOVES = {
        "acid": "Ácido", "acid armor": "Armadura Ácida", "acid spray": "Bomba Ácida",
        "acrobatics": "Acróbata", "acupressure": "Acupresión", "aerial ace": "Golpe Aéreo",
        "aeroblast": "Aerochorro", "after you": "Cortesía", "agility": "Agilidad",
        "air cutter": "Aire Afilado", "air slash": "Aire Cortante", "amnesia": "Amnesia",
        "ancient power": "Poder Pasado", "aqua jet": "Acua Jet", "aqua ring": "Anillo Acua",
        "aqua tail": "Acua Cola", "arm thrust": "Empujón", "aromatherapy": "Aromaterapia",
        "aromatic mist": "Niebla Aromática", "astonish": "Impresionar", "attack order": "Al Ataque",
        "attract": "Atracción", "aura sphere": "Esfera Aural", "aurora beam": "Rayo Aurora",
        "autotomize": "Aligeramiento", "avalanche": "Alud", "baby-doll eyes": "Ojitos Tiernos",
        "barrage": "Bombardeo", "barrier": "Barrera", "baton pass": "Relevo", "beat up": "Paliza",
        "belch": "Eructo", "belly drum": "Tambor", "bestow": "Ofrenda", "bide": "Paciencia",
        "bind": "Atadura", "bite": "Mordisco", "blast burn": "Anillo Ígneo",
        "blaze kick": "Patada Ígnea", "blizzard": "Ventisca", "block": "Bloqueo",
        "body slam": "Golpe Cuerpo", "bone club": "Hueso Palo", "bone rush": "Ataque Óseo",
        "bonemerang": "Huesomerang", "boomburst": "Estruendo", "bounce": "Bote",
        "brave bird": "Pájaro Osado", "brick break": "Demolición", "brine": "Salmuera",
        "bubble": "Burbuja", "bubble beam": "Rayo Burbuja", "bug bite": "Picadura",
        "bug buzz": "Zumbido", "bulk up": "Corpulencia", "bulldoze": "Terratemblor",
        "bullet punch": "Puño Bala", "bullet seed": "Recurrente", "calm mind": "Paz Mental",
        "camouflage": "Camuflaje", "captivate": "Seducción", "charge": "Carga",
        "charge beam": "Rayo Carga", "charm": "Encanto", "circle throw": "Llave Giro",
        "clamp": "Tenaza", "clear smog": "Niebla Clara", "close combat": "A Bocajarro",
        "coil": "Enrosque", "comet punch": "Puño Cometa", "confuse ray": "Rayo Confuso",
        "confusion": "Confusión", "constrict": "Restricción", "copycat": "Copión",
        "cosmic power": "Masa Cósmica", "cotton guard": "Rizo Algodón", "cotton spore": "Esporagodón",
        "counter": "Contraataque", "covet": "Antojo", "crabhammer": "Martillazo",
        "cross chop": "Tajo Cruzado", "cross poison": "Veneno X", "crunch": "Triturar",
        "crush claw": "Garra Brutal", "crush grip": "Estrujón", "curse": "Maldición",
        "dark pulse": "Pulso Umbrío", "dark void": "Brecha Negra", "dazzling gleam": "Brillo Mágico",
        "defense curl": "Rizo Defensa", "defog": "Despejar", "destiny bond": "Mismo Destino",
        "detect": "Detección", "dig": "Excavar", "disable": "Anulación", "disarming voice": "Voz Cautivadora",
        "discharge": "Descarga", "dive": "Buceo", "dizzy punch": "Puño Mareo",
        "doom desire": "Deseo Oculto", "double hit": "Doble Golpe", "double kick": "Doble Patada",
        "double slap": "Doble Bofetón", "double team": "Doble Equipo", "double-edge": "Doble Filo",
        "draco meteor": "Cometa Draco", "dragon ascent": "Ascenso Draco", "dragon breath": "Dragoaliento",
        "dragon claw": "Garra Dragón", "dragon dance": "Danza Dragón", "dragon hammer": "Martillo Dragón",
        "dragon pulse": "Pulso Dragón", "dragon rage": "Furia Dragón", "dragon rush": "Carga Dragón",
        "dragon tail": "Cola Dragón", "drain punch": "Puño Drenaje", "draining kiss": "Beso Drenaje",
        "dream eater": "Comesueños", "drill peck": "Pico Taladro", "drill run": "Taladradora",
        "dynamic punch": "Puño Dinámico", "earth power": "Tierra Viva", "earthquake": "Terremoto",
        "echoed voice": "Eco Voz", "eerie impulse": "Onda Anómala", "egg bomb": "Bomba Huevo",
        "electric terrain": "Campo Eléctrico", "electrify": "Electrificación", "electro ball": "Bola Voltio",
        "electroweb": "Electrotela", "embargo": "Embargo", "ember": "Ascuas", "encore": "Otra vez",
        "endeavor": "Esfuerzo", "endure": "Aguante", "energy ball": "Energibola", "eruption": "Estallido",
        "explosion": "Explosión", "extrasensory": "Paranormal", "extreme speed": "Velocidad Extrema",
        "fake out": "Sorpresa", "fake tears": "Llanto Falso", "false swipe": "Falsotortazo",
        "feather dance": "Danza Pluma", "feint": "Amago", "feint attack": "Finta",
        "fiery dance": "Danza Llama", "fire blast": "Llamarada", "fire fang": "Colmillo Ígneo",
        "fire pledge": "Voto Fuego", "fire punch": "Puño Fuego", "fire spin": "Giro Fuego",
        "first impression": "Primer Impacto", "fissure": "Fisura", "flail": "Azote",
        "flame burst": "Pirotecnia", "flame charge": "Nitrocarga", "flame wheel": "Rueda Fuego",
        "flamethrower": "Lanzallamas", "flare blitz": "Envite Ígneo", "flash": "Destello",
        "flash cannon": "Foco Resplandor", "flatter": "Camelo", "fling": "Lanzamiento",
        "flower shield": "Defensa Floral", "fly": "Vuelo", "focus blast": "Onda Certera",
        "focus energy": "Foco Energía", "focus punch": "Puño Certero", "follow me": "Señuelo",
        "force palm": "Palmeo", "foul play": "Juego Sucio", "frenzy plant": "Planta Feroz",
        "frustration": "Frustración", "fury attack": "Ataque Furia", "fury cutter": "Corte Furia",
        "fury swipes": "Golpes Furia", "fusion bolt": "Rayo Fusión", "fusion flare": "Llama Fusión",
        "future sight": "Premonición", "gastro acid": "Bilis", "giga drain": "Gigadrenado",
        "giga impact": "Giga Impacto", "glare": "Deslumbrar", "grass knot": "Hierba Lazo",
        "grass pledge": "Voto Planta", "grass whistle": "Silbato", "grassy terrain": "Campo de Hierba",
        "gravity": "Gravedad", "growl": "Gruñido", "growth": "Desarrollo", "grudge": "Rencor",
        "guillotine": "Guillotina", "gunk shot": "Lanzamugre", "gust": "Tornado", "gyro ball": "Giro Bola",
        "hail": "Granizo", "hammer arm": "Machada", "happy hour": "Hora Feliz", "harden": "Fortaleza",
        "haze": "Niebla", "head smash": "Testarazo", "headbutt": "Cabezazo", "heal bell": "Campana Cura",
        "heal block": "Anticura", "heal pulse": "Pulso Cura", "healing wish": "Deseo Cura",
        "heart stamp": "Sello Corazón", "heat crash": "Golpe Calor", "heat wave": "Onda Ígnea",
        "heavy slam": "Cuerpo Pesado", "helping hand": "Refuerzo", "hex": "Infortunio",
        "hidden power": "Poder Oculto", "high horsepower": "Fuerza Equina", "high jump kick": "Patada Salto Alta",
        "horn attack": "Cornada", "horn drill": "Perforador", "howl": "Aullido", "hurricane": "Vendaval",
        "hydro cannon": "Hidrocañón", "hydro pump": "Hidrobomba", "hyper beam": "Hiperrayo",
        "hyper fang": "Hipercolmillo", "hyper voice": "Vozarrón", "hypnosis": "Hipnosis",
        "ice ball": "Bola Hielo", "ice beam": "Rayo Hielo", "ice burn": "Llama Gélida",
        "ice fang": "Colmillo Hielo", "ice hammer": "Martillo Hielo", "ice punch": "Puño Hielo",
        "ice shard": "Canto Helado", "icicle crash": "Chuzos", "icicle spear": "Carámbano",
        "icy wind": "Viento Hielo", "imprison": "Cerca", "incinerate": "Calcinación",
        "inferno": "Infierno", "infestation": "Acoso", "ingrain": "Arraigo", "ion deluge": "Cortina Plasma",
        "iron defense": "Defensa Férrea", "iron head": "Cabeza de Hierro", "iron tail": "Cola Férrea",
        "jump kick": "Patada Salto", "karate chop": "Golpe Kárate", "king's shield": "Escudo Real",
        "knock off": "Desarme", "last resort": "Última Baza", "lava plume": "Humareda",
        "leaf blade": "Hoja Aguda", "leaf storm": "Lluevehojas", "leech life": "Chupavidas",
        "leech seed": "Drenadoras", "leer": "Malicioso", "lick": "Lengüetazo",
        "light screen": "Pantalla de Luz", "liquidation": "Hidroariete", "lock-on": "Fijar Blanco",
        "lovely kiss": "Beso Amoroso", "low kick": "Patada Baja", "lucky chant": "Conjuro",
        "lunar dance": "Danza Lunar", "magic coat": "Capa Mágica", "magic room": "Zona Mágica",
        "magical leaf": "Hoja Mágica", "magnet bomb": "Bomba Imán", "magnet rise": "Levitón",
        "magnitude": "Magnitud", "me first": "Yo Primero", "mean look": "Mal de Ojo",
        "meditate": "Meditación", "mega drain": "Megaagotar", "mega kick": "Megapatada",
        "mega punch": "Megapuño", "megahorn": "Megacuerno", "memento": "Legado",
        "metal burst": "Represalia", "metal claw": "Garra Metal", "metal sound": "Eco Metálico",
        "meteor mash": "Puño Meteoro", "metronome": "Metrónomo", "milk drink": "Batido",
        "mimic": "Mimético", "mind reader": "Telépata", "minimize": "Reducción",
        "miracle eye": "Gran Ojo", "mirror coat": "Manto Espejo", "mirror move": "Espejo",
        "mirror shot": "Disparo Espejo", "mist": "Neblina", "misty terrain": "Campo de Niebla",
        "moonblast": "Fuerza Lunar", "moonlight": "Luz Lunar", "morning sun": "Sol Matinal",
        "mud bomb": "Bomba Fango", "mud shot": "Disparo Lodo", "mud sport": "Chapoteo Lodo",
        "mud-slap": "Bofetón Lodo", "muddy water": "Agua Lodosa", "nasty plot": "Maquinación",
        "natural gift": "Don Natural", "nature power": "Adaptación", "night daze": "Pulso Noche",
        "night shade": "Tinieblas", "night slash": "Tajo Umbrío", "nightmare": "Pesadilla",
        "nuzzle": "Moflete Estático", "octazooka": "Pulpocañón", "odor sleuth": "Rastreo",
        "ominous wind": "Viento Aciago", "outrage": "Enfado", "overheat": "Sofoco",
        "pay day": "Día de Pago", "payback": "Vendetta", "peck": "Picotazo", "perish song": "Canto Mortal",
        "petal blizzard": "Ventisca Floral", "petal dance": "Danza Pétalo", "phantom force": "Golpe Fantasma",
        "pin missile": "Pin Misil", "play rough": "Jugarreta", "pluck": "Picoteo",
        "poison fang": "Colmillo Veneno", "poison gas": "Gas Venenoso", "poison jab": "Puya Nociva",
        "poison powder": "Polvo Veneno", "poison tail": "Cola Veneno", "pound": "Destructor",
        "powder snow": "Nieve Polvo", "power gem": "Joya de Luz", "power trick": "Truco Fuerza",
        "power whip": "Latigazo", "present": "Presente", "protect": "Protección", "psybeam": "Psicorrayo",
        "psych up": "Psicoalteración", "psychic": "Psíquico", "psychic terrain": "Campo Psíquico",
        "psycho boost": "Psicoataque", "psycho cut": "Psicocorte", "psycho shift": "Psicotraspaso",
        "psyshock": "Psicocarga", "psystrike": "Onda Mental", "psywave": "Psicoonda",
        "punishment": "Castigo", "pursuit": "Persecución", "quash": "Último Lugar",
        "quick attack": "Ataque Rápido", "quick guard": "Anticipo", "quiver dance": "Danza Aleteo",
        "rage": "Furia", "rage powder": "Polvo Ira", "rain dance": "Danza Lluvia",
        "rapid spin": "Giro Rápido", "razor leaf": "Hoja Afilada", "razor shell": "Concha Filo",
        "razor wind": "Viento Cortante", "recover": "Recuperación", "recycle": "Reciclaje",
        "reflect": "Reflejo", "refresh": "Alivio", "relic song": "Canto Arcaico", "rest": "Descanso",
        "retaliate": "Desquite", "revenge": "Revancha", "reversal": "Inversión",
        "roar": "Rugido", "roar of time": "Distorsión", "rock blast": "Pedrada",
        "rock climb": "Treparrocas", "rock polish": "Pulimento", "rock slide": "Avalancha",
        "rock smash": "Golpe Roca", "rock throw": "Lanzarrocas", "rock tomb": "Tumba Rocas",
        "role play": "Imitación", "roost": "Respiro", "round": "Canon", "sacred fire": "Fuego Sagrado",
        "sacred sword": "Espada Santa", "safeguard": "Velo Sagrado", "sand attack": "Ataque Arena",
        "sand tomb": "Bucle Arena", "sandstorm": "Tormenta Arena", "scald": "Escaldar",
        "scary face": "Cara Susto", "scratch": "Arañazo", "screech": "Chirrido",
        "secret power": "Poder Secreto", "seed bomb": "Bomba Germen", "seed flare": "Fogonazo",
        "seismic toss": "Movimiento Sísmico", "self-destruct": "Autodestrucción",
        "shadow ball": "Bola Sombra", "shadow claw": "Garra Umbría", "shadow force": "Golpe Umbrío",
        "shadow punch": "Puño Sombra", "shadow sneak": "Sombra Vil", "sharpen": "Afilar",
        "sheer cold": "Cero Absoluto", "shell smash": "Rompecoraza", "shell trap": "Coraza Trampa",
        "shock wave": "Onda Voltio", "signal beam": "Rayo Señal", "silver wind": "Viento Plata",
        "simple beam": "Onda Simple", "sing": "Canto", "sketch": "Esquema", "skill swap": "Intercambio",
        "sky attack": "Ataque Aéreo", "sky drop": "Caída Libre", "sky uppercut": "Gancho Alto",
        "slack off": "Relajo", "slam": "Atizar", "slash": "Cuchillada", "sleep powder": "Somnífero",
        "sleep talk": "Sonámbulo", "sludge": "Residuos", "sludge bomb": "Bomba Lodo",
        "sludge wave": "Onda Tóxica", "smack down": "Antiaéreo", "smelling salts": "Estimulante",
        "smog": "Polución", "smokescreen": "Pantalla de Humo", "snarl": "Alarido", "snatch": "Robo",
        "snore": "Ronquido", "soak": "Empapar", "solar beam": "Rayo Solar", "solar blade": "Cuchilla Solar",
        "sonic boom": "Bomba Sónica", "spacial rend": "Corte Vacío", "spark": "Chispa",
        "spider web": "Telaraña", "spikes": "Púas", "spiky shield": "Barrera Espinosa",
        "spit up": "Escupir", "spite": "Resentimiento", "splash": "Salpicadura", "spore": "Espora",
        "stealth rock": "Trampa Rocas", "steel wing": "Ala de Acero", "sticky web": "Red Viscosa",
        "stockpile": "Reserva", "stomp": "Pisotón", "stomping tantrum": "Pataleta",
        "stone edge": "Roca Afilada", "stored power": "Poder Reserva", "string shot": "Disparo Demora",
        "struggle": "Forcejeo", "stun spore": "Paralizador", "submission": "Sumisión",
        "substitute": "Sustituto", "sucker punch": "Golpe Bajo", "sunny day": "Día Soleado",
        "super fang": "Superdiente", "superpower": "Fuerza Bruta", "supersonic": "Supersónico",
        "surf": "Surf", "swagger": "Contoneo", "swallow": "Tragar", "sweet kiss": "Beso Dulce",
        "sweet scent": "Dulce Aroma", "swift": "Rapidez", "switcheroo": "Trapicheo",
        "swords dance": "Danza Espada", "synchronoise": "Sincrorruido", "synthesis": "Síntesis",
        "tackle": "Placaje", "tail glow": "Luminocola", "tail whip": "Látigo", "tailwind": "Viento Afín",
        "take down": "Derribo", "tera blast": "Teraexplosión", "taunt": "Mofa", "teeter dance": "Danza Caos",
        "telekinesis": "Telequinesis", "teleport": "Teletransporte", "terrain pulse": "Pulso Terreno",
        "thief": "Ladrón", "thousand arrows": "Mil Flechas", "thunder": "Trueno",
        "thunder fang": "Colmillo Rayo", "thunder punch": "Puño Trueno", "thunder shock": "Impactrueno",
        "thunder wave": "Onda Trueno", "thunderbolt": "Rayo", "tickle": "Cosquillas",
        "topsy-turvy": "Reversión", "torment": "Tormento", "toxic": "Tóxico",
        "toxic spikes": "Púas Tóxicas", "transform": "Transformación", "tri attack": "Triataque",
        "trick": "Truco", "trick room": "Espacio Raro", "trick-or-treat": "Halloween",
        "triple kick": "Triple Patada", "trump card": "Triunfo", "twineedle": "Doble Ataque",
        "twister": "Ciclón", "u-turn": "Ida y Vuelta", "uproar": "Alboroto", "v-create": "V de Fuego",
        "vacuum wave": "Onda Vacío", "venoshock": "Carga Tóxica", "vine whip": "Látigo Cepa",
        "vise grip": "Agarre", "volt switch": "Voltiocambio", "volt tackle": "Placaje Eléctrico",
        "wake-up slap": "Espabila", "water gun": "Pistola Agua", "water pledge": "Voto Agua",
        "water pulse": "Hidropulso", "water sport": "Chapoteo", "waterfall": "Cascada",
        "weather ball": "Meteorobola", "whirlpool": "Torbellino", "whirlwind": "Remolino",
        "wild charge": "Voltio Cruel", "will-o-wisp": "Fuego Fatuo", "wing attack": "Ataque Ala",
        "wish": "Deseo", "withdraw": "Refugio", "wonder room": "Zona Extraña", "wood hammer": "Mazazo",
        "work up": "Avivar", "worry seed": "Abatidoras", "wrap": "Constricción", "x-scissors": "Tijera X",
        "yawn": "Bostezo", "absorb": "Absorber", "soft-boiled": "Amortiguador", "mr. mime": "Mr. Mime", "mime jr.": "Mime Jr.", "zap cannon": "Electrocañón", "zen headbutt": "Cabezazo Zen"
    };

    // Textos de la web, mensajes y palabras sueltas (los segmentos del diccionario son cortos).
    const GENERAL = {
        "download": "descargar", "above": "arriba", "absolutely": "absolutamente",
        "according to": "según", "account info": "Información de la cuenta",
        "account level": "Nivel de cuenta", "account status": "Estado de la cuenta",
        "account types": "Tipos de cuenta", "add": "añadir", "advanced": "avanzado",
        "adventure": "aventura", "afraid": "miedo", "again": "otra vez", "against": "contra",
        "all": "todo", "all teams": "todos los equipos", "and": "y", "and above": "y superior",
        "area": "área", "around": "alrededor", "at": "en", "avoid": "evitar",
        "back row": "fila trasera", "back to login": "Volver a iniciar sesión", "don't have account": "¿No tienes cuenta", "click here for solve": "Ver solución", "simple form": "Tabla simple", "bag": "bolsa",
        "ball": "bola", "battle": "combate", "battle log": "registro de combate",
        "be careful": "ten cuidado", "careful": "cuidado", "beat": "vencer", "become": "convertirse en",
        "before log out": "antes de cerrar sesión", "before pushing": "antes de barrer",
        "below": "abajo", "between": "entre", "big": "grande", "bird": "ave", "black": "negro",
        "body": "cuerpo", "break": "romper", "burn": "quemadura", "but": "pero", "can": "puede",
        "can be changed to": "se puede cambiar por", "cannot": "no puede",
        "cannot catch": "no se puede capturar", "cannot kill": "no se puede derrotar",
        "change": "cambiar", "change to": "cambiar a", "chapter": "capítulo", "check": "comprobar",
        "choose": "elegir", "click": "clic", "close": "cerrar", "close account": "cerrar cuenta",
        "code": "CÓDIGO", "continue": "continuar", "continuously": "continuamente",
        "critical hit": "golpe crítico", "currently enabled": "activado actualmente",
        "damage": "daño", "danger": "peligro", "data": "datos", "deal with": "lidiar con",
        "default": "por defecto", "delete branch": "eliminar rama", "detailed": "detallado",
        "did not sleep": "no se durmió", "didn't kill": "no lo derrotó", "directly": "directamente",
        "do": "hacer", "don't": "no", "don't care": "da igual", "double": "doble", "doubled": "doblado",
        "edit": "editar", "edition": "edición", "egg": "Chansey", "email": "correo", "end": "final",
        "enemy": "rival", "enter": "entrar", "enter league": "Ver liga", "except": "excepto",
        "exceed": "superar", "explode": "explotar", "extreme": "extremo", "facing": "frente a",
        "fail": "fallar", "faint": "Debilitado", "fainted": "debilitado", "fake": "falso", "fall": "caer",
        "fast": "rápido", "fastest": "el más rápido", "feedback": "comentarios",
        "few times": "varias veces", "field": "campo", "fighting": "lucha", "finish": "terminar",
        "first": "primero", "first move": "mover primero", "first shot": "primer disparo",
        "first step": "primer paso", "first try": "probar primero", "fix": "fijar", "fixed": "fijo",
        "flinch": "retroceso", "follow": "seguir", "follow up": "continuar", "for": "para",
        "for gamblers only": "solo para apostadores", "forbid": "prohibir",
        "forgot username/password": "¿Olvidaste tu usuario o contraseña", "freeze": "congelar", "front": "frente",
        "full": "lleno", "full health": "salud completa", "gamble": "apostar", "general": "general",
        "get frozen": "congelarse", "get hit": "recibir golpe", "gets": "recibe", "give": "dar",
        "go": "ir", "go back and select": "volver y seleccionar", "go crazy": "enloquecer",
        "good": "bueno", "guard": "proteger", "half": "mitad", "hand": "mano", "hard": "duro",
        "have": "tiene", "have to hit": "hay que golpear", "heal": "curar", "heal full": "curar por completo",
        "health": "salud", "health bar": "barra de salud", "healthy": "sano", "heart": "corazón",
        "heat": "calor", "heavy": "pesado", "help": "ayuda", "help center": "centro de ayuda",
        "high": "alto", "hit": "golpe", "hp": "PS", "hp above": "PS por encima de", "huge": "enorme",
        "i": "yo", "if": "si", "if lose": "si pierde", "important info": "información importante",
        "improve": "mejorar", "improved": "mejorado", "in advance": "de antemano",
        "include": "incluir", "increase": "aumentar", "information": "información",
        "injury": "herida", "inside": "dentro", "invalid": "inválido", "is": "es", "is a": "es",
        "it": "eso", "item": "objeto", "judge": "juzgar", "jump": "saltar", "just": "solo",
        "keep": "mantener", "kick": "patada", "kill": "derrota", "adapt to circumstances": "adaptarse a las circunstancias", "killed": "derrotado", "king": "rey",
        "last move": "mover último", "lazy": "perezoso", "less than": "menos que", "let": "dejar",
        "life": "vida", "limit": "límite", "line": "línea", "list": "lista", "live": "vivir",
        "load": "cargar", "lock": "bloquear", "log out": "cerrar sesión", "login": "iniciar sesión",
        "login successful": "inicio de sesión exitoso", "long": "largo", "look again": "mirar de nuevo",
        "look for": "buscar", "lose": "perder", "low": "bajo", "low hp": "PS bajos", "luck": "suerte",
        "lucky king": "rey de la suerte", "machine": "máquina", "many": "muchos", "meat": "carne",
        "meet": "encontrar", "method": "método", "miss": "fallo", "money": "dinero",
        "monster": "monstruo", "moon": "luna", "most": "más", "move": "mover", "mud": "barro",
        "must": "debe", "need": "necesita", "need more": "necesita más",
        "need to wait for": "hay que esperar a", "new": "nuevo", "new branches": "nuevas ramas",
        "next": "siguiente", "no": "no", "no faint": "no se debilita",
        "no intimidate": "No tiene Intimidación", "ability": "habilidad", "no need ice punch": "no hace falta Puño Hielo",
        "no need to": "no hace falta", "no need to heal": "no hace falta curar",
        "no need to say more": "no hace falta decir más", "not": "no", "not enough": "no es suficiente",
        "not enough hp": "PS insuficientes", "not yet": "todavía no", "notes": "notas",
        "number": "N.º", "quantity / measure": "Cantidad", "of": "de", "old": "viejo", "once": "una vez", "one": "uno",
        "one shot": "un disparo", "one time": "una vez", "oneself": "uno mismo", "only": "solo",
        "open": "abrir", "opening": "apertura", "operate": "operar", "operation": "operación",
        "option to solve": "opción para resolver", "or": "o", "orb": "esfera", "original": "original",
        "other": "otro", "outside": "fuera", "overload": "sobrecarga", "paralyze": "paralizar",
        "paralysed": "paralizado", "paralyzed": "paralizado", "pass": "pasar", "password": "contraseña",
        "period": "periodo", "perish together": "caen juntos", "person": "persona",
        "personal center": "centro personal", "piece": "pieza", "place": "lugar", "play": "jugar",
        "play on own": "juega a tu manera", "please": "por favor", "please enter": "Introduce tu",
        "pop": "explotar", "portrait": "retrato", "position": "posición", "power": "poder",
        "prefer": "preferir", "press": "pulsar", "primary account": "cuenta principal",
        "prioritize": "priorizar", "priority": "prioridad", "probability": "probabilidad",
        "problem": "problema", "protect": "proteger", "pull": "tirar", "push": "barrer",
        "push again": "barrer otra vez", "put": "poner", "random": "aleatorio", "rate": "tasa",
        "reach": "alcanzar", "read": "leer", "reason": "razón", "recommend": "recomendar",
        "record": "registro", "recover": "recuperar", "red": "rojo", "reduce": "reducir",
        "register": "Regístrate", "registration failed": "registro fallido",
        "registration failed! email already registered!": "¡Registro fallido! ¡El correo ya está registrado!",
        "registration failed! username already exists": "¡Registro fallido! El nombre de usuario ya existe",
        "registration is successful, please log in to your email to activate your account":
            "Registro exitoso, accede a tu correo para activar tu cuenta",
        "registration time": "Fecha de registro", "regular account": "cuenta normal",
        "remain": "resta", "remaining": "restante", "remark": "nota", "remember": "recordar",
        "remove": "quitar", "return": "volver", "repeat": "repetir", "report": "reportar", "report it": "repórtalo",
        "requires ice punch": "requiere Puño Hielo", "reset": "Restablecer",
        "reset failed! the email account does not exist! please register first!":
            "¡Restablecimiento fallido! ¡La cuenta de correo no existe! ¡Regístrate primero!",
        "reset username/password": "restablecer usuario/contraseña", "resist": "resistir",
        "right?": "¿verdad?", "risk": "riesgo", "row": "fila", "run to": "Cambia a", "chasing speed": "Superar en velocidad",
        "sack": "Sacrificar", "same as above": "igual que arriba", "save": "guardar",
        "say it in the group": "dilo en el grupo", "scale": "escama", "sea": "mar", "second": "segundo",
        "second step": "segundo paso", "see": "ver", "see if": "Ver si tiene", "seed": "semilla",
        "select": "Seleccionar", "selected": "seleccionado", "send out": "sacar", "shadow": "sombra",
        "shake": "sacudir", "shell": "concha", "shield": "escudo", "shoot": "disparar", "shot": "disparo",
        "should": "debería", "signal": "señal", "situation": "situación", "skill": "habilidad",
        "sky": "cielo", "sleep": "dormir", "slow": "lento", "small": "pequeño",
        "small chance": "poca probabilidad", "snow": "nieve", "solve": "resolver", "spare": "de reserva",
        "speak": "hablar", "spirit": "espíritu", "stable": "estable", "start": "inicio",
        "state": "estado", "statistics": "estadísticas", "status condition": "estado alterado",
        "stay": "Permanece en el campo", "stay on field": "Permanece en el campo", "steel": "acero", "step": "paso",
        "step on": "pisar", "still": "todavía", "stop": "parar", "straight": "recto",
        "strength": "fuerza", "strengthen": "potenciar", "strike": "golpe", "submit": "enviar",
        "success": "éxito", "success or not": "éxito o no", "suggest": "sugerir", "switch": "Cambiar",
        "take": "tomar", "take a gamble": "arriesgarse", "take away": "llevarse", "team": "equipo",
        "temporarily": "temporalmente", "test": "probar", "testing": "en prueba", "that": "eso",
        "then": "luego", "thing": "cosa", "think": "pensar", "this": "esto", "this level": "este nivel",
        "threat": "amenaza", "three": "tres", "three ways": "tres formas",
        "three ways to play": "tres formas de jugar", "throw": "lanzar", "time": "tiempo",
        "times": "veces", "to": "a", "too": "demasiado", "touch": "tocar", "true": "verdadero",
        "trust": "confiar", "try": "intentar", "turn": "turno", "two": "dos", "two shot": "dos disparos",
        "two times": "dos veces", "two ways": "dos formas", "two ways to play": "dos formas de jugar",
        "under": "bajo", "unexpected": "inesperado", "unknown": "desconocido", "use": "usar",
        "username": "usuario", "valid": "válido", "very": "muy", "view help": "ver ayuda",
        "view battle log": "ver registro de combate", "wait": "esperar", "wait for": "esperar a",
        "wake up": "despertar", "walk": "caminar", "want": "querer", "water": "agua", "wave": "ola",
        "welcome to login": "Bienvenido, inicia sesión", "what": "qué", "whether": "si",
        "whole": "entero", "will": "va a", "will go": "irá", "with": "con", "within": "dentro de",
        "wonderful": "maravilloso", "wood": "madera", "word": "palabra", "worry": "preocuparse",
        "wrong": "incorrecto", "wrong password": "contraseña incorrecta",
        "wrong username": "usuario incorrecto", "you": "tú",
        "the site or code are not my work, contact the code author instead to show your gratitude.":
            "La web y los códigos no son obra mía; contacta con el autor del código para agradecérselo.",
        "last warning: turn off exp.reamp": "Última advertencia: desactiva el amplificador de experiencia",
        "code bounded successfully": "Código vinculado correctamente",
        "champion": "Campeón", "confirm team": "Confirmar equipo",
        "label descriptions and use of custom labels": "Descripción de etiquetas y uso de etiquetas personalizadas",
        "use of data sharing code": "Uso del código de datos compartidos",
        "basic knowledge portal by": "Portal de conocimientos básicos de",
        "pokemmo personal note information query tool": "una herramienta de PokeMMO para consultar apuntes y datos personales",
        "pokemmo": "una herramienta de PokeMMO para consultar",
        "personal note information query tool": "apuntes y datos personales", "region select": "Seleccionar región", "direction": "dirección", "indeed": "efectivamente", "drop": "bajar", "dropped": "bajó", "def drop": "baja de defensa", "frog": "Toxicroak", "spd tank": "aguante especial", "more": "más", "better": "mejor", "a": "", "instant ko": "KO instantáneo", "nail": "Trampa Rocas", "survive": "Sobrevive", "choice item": "Objeto Elegido", "pay attention to lock": "Atención a objeto elegido", "can't kill instantly": "No se puede derrotar de golpe", "can’t kill instantly": "No se puede derrotar de golpe", "force foe to swap": "Para forzar el cambio", "dont encore": "No hagas Otra vez", "ghost": "Gengar", "instant ko": "KO instantáneo",
        "see who moves first": "ver quién se mueve primero"
    };

    // Correcciones en chino -> español que mandan sobre el diccionario remoto
    // (porque falta la entrada, o porque su traducción no encaja en español).
    const OVERRIDES = {
        "打开": "Abrir",
        "关闭": "Cerrar",
        "正常": "Normal",
        "普通账户": "Cuenta normal",
        "初级账户": "Cuenta básica",
        "高级账户": "Cuenta avanzada",
        "当前为启用状态": "Actualmente activado",
        "当前为停用状态": "Actualmente desactivado",
        "确队辅助模块展示": "Módulo auxiliar de confirmación de equipo",
        "辅助模块展示": "Módulo auxiliar",
        "（": "(", "）": ")", "【": "[", "】": "]"
    };

    // Fechas chinas (2025年11月27日 15时54分39秒) -> 27/11/2025 15:54:39
    const DATE_RE = /(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日(?:\s*(\d{1,2})时\s*(\d{1,2})分(?:\s*(\d{1,2})秒)?)?/g;
    const pad = n => String(n).padStart(2, "0");

    function translateExtras(text) {
        return text.replace(DATE_RE, (m, y, mo, d, h, mi, s) => {
            let out = `${pad(d)}/${pad(mo)}/${y}`;
            if (h !== undefined) out += ` ${pad(h)}:${pad(mi)}` + (s !== undefined ? `:${pad(s)}` : "");
            return out;
        });
    }

    // Tipos como palabras sueltas. "ghost" lo decide el usuario (Gengar) y "normal" se queda en minúscula.
    const TYPE_WORDS = { "flying type": "Volador" };
    for (const [en, es] of Object.entries(TYPES)) {
        if (en !== "ghost" && en !== "normal") TYPE_WORDS[en] = es;
    }

    // Palabras y frases chinas -> español. Llevan espacio final al insertarse (como el diccionario remoto).
    const WORDS = {
        "一号位": "1st slot", "二号位": "2nd slot", "三号位": "3rd slot", "四号位": "4th slot", "五号位": "5th slot", "六号位": "6th slot",
        "压迫感": "Presión", "看有无": "Ver si tiene", "看有没有": "Ver si tiene", "看是否有": "Ver si tiene", "看是否": "Ver si tiene",
        "有无": "si tiene", "有没有": "si tiene", "高于": "Arriba de", "小于": "Menos de", "低于": "Menos de", "少于": "Menos de", "龙舞": "Danza Dragón",
        "威尔": "Will", "无": "no tiene", "没有": "no tiene", "无威吓": "No tiene Intimidación",
        "加热洛托姆": "Rotom Calor", "清洗洛托姆": "Rotom Lavado", "结冰洛托姆": "Rotom Frío",
        "旋转洛托姆": "Rotom Ventilador", "切割洛托姆": "Rotom Corte",
        "进入联盟": "Ver liga", "分享人": "Compartido por", "分享": "Compartir", "标题": "Título",
        "发表时间": "Fecha de publicación", "攻略分享": "Compartir estrategias", "攻略": "Estrategias",
        "积分": "puntos", "怎么": "cómo", "白嫖码": "código gratuito", "野味": "Wild taste",
        "请前往": "Por favor, ve a", "B站": "Bilibili", "贴吧": "Tieba", "查询": "y consulta",
        "相关队伍": "para el equipo en cuestión", "具体方法": "el método concreto", "分享码": "y el código compartido",
        "无法": "no puede", "已": "ya",
        "，": ",", "。": ".", "；": ";", "：": ":", "！": "!", "？": "?", "、": ",",
        "则": "entonces", "视": "según", "不视": "sin importar", "视情况": "según la situación",
        "该": "este", "模块": "módulo", "该模块": "este módulo",
        "可在": "En el", "关闭该模块": "puedes desactivar este módulo",
        "个": " ", "对位": "enfrentamiento", "减防": "baja de defensa", "多好": "mejor", "更好": "mejor",
        "回血": "curar PS", "推队": "barrer al equipo", "补钉": "reponer Trampa Rocas",
        "防御药": "Defensa X", "攻击药": "Ataque X", "速度药": "Velocidad X",
        "特攻药": "At. Esp. X", "特防药": "Def. Esp. X",
        "252攻击": "252 Ataque", "252攻": "252 Ataque", "252速度": "252 Velocidad", "252速": "252 Velocidad",
        "252防御": "252 Defensa", "252防": "252 Defensa", "252特攻": "252 At. Esp.", "252特防": "252 Def. Esp.",
        "252血": "252 PS", "极限": "Máximo", "特耐": "aguante especial",
        "确": "efectivamente", "有": "tiene", "蛙": "Toxicroak", "战斗": "combate", "技能": "movimiento",
        "看技能": "ver movimiento", "招": "movimiento", "低血": "PS bajos", "注意": "atención", "慎重": "con cuidado",
        "重选地区": "Seleccionar región", "重选天王": "Seleccionar Campeón", "下一个天王": "Siguiente Campeón"
    };

    // Texto que es exactamente esto (p. ej. la fila de tipos de un Pokémon).
    const EXACT = Object.assign(Object.create(null), {
        "龙": "Dragón", "飞行": "Volador", "火": "Fuego", "水": "Agua", "电": "Eléctrico", "草": "Planta",
        "冰": "Hielo", "格斗": "Lucha", "毒": "Veneno", "地面": "Tierra", "超能力": "Psíquico",
        "虫": "Bicho", "岩石": "Roca", "幽灵": "Fantasma", "恶": "Siniestro", "钢": "Acero",
        "一般": "Normal", "妖精": "Hada"
    });

    const CREDITS_TEXT = "¡Hola, soy Taddeus! Primero que nada, gracias por instalar mi extensión, me hace mucha ilusión ayudar a mi comunidad y más cuando se trata de farmeos. Si quieres sentir algo bonito en tu corazón, considera donarme algo a mí, mi IGN es TaddeusMaster.";

    const MAP = Object.assign(Object.create(null), GENERAL, TYPE_WORDS, NATURES, ITEMS, ABILITIES, MOVES);

    function capitalize(text) {
        return text.replace(/(^|[\s-])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
    }

    // Traduce un valor del diccionario inglés conservando los espacios de los extremos
    // (el diccionario los usa como separadores). Si no hay traducción devuelve el original.
    function translateValue(value) {
        if (typeof value !== "string") return value;
        const lead = value.match(/^\s*/)[0];
        const trail = value.match(/\s*$/)[0];
        const core = value.trim().replace(/\s+/g, " ");
        if (!core) return value;

        const key = core.toLowerCase();

        // Mensaje de créditos y donaciones del diccionario: se sustituye por el de esta versión.
        if (key.startsWith("hi! please consider a small donation")) return lead + CREDITS_TEXT + trail;

        let es = MAP[key];

        if (es === undefined) {
            let m = key.match(/^(.+) berry$/);
            if (m) {
                es = "Baya " + capitalize(m[1]);
            } else if ((m = key.match(/^(.+) gem$/)) && TYPES[m[1]]) {
                es = "Gema " + TYPES[m[1]];
            }
        }
        // Sin traducción: los nombres de Pokémon llegan en minúsculas ("garchomp", "ho-oh");
        // una sola palabra minúscula (3+ letras) se escribe con mayúscula inicial.
        if (es === undefined && core === key && key.length >= 3 && /^[a-z][a-z0-9'.\-♀♂]*$/.test(key)) {
            es = key.replace(/(^|-)([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
        }
        return es === undefined ? value : lead + es + trail;
    }


    // ---- Texto que ya viene en inglés ----
    // Muchos equipos los escriben en inglés los propios autores ("Waterfall --> See under",
    // "Tbolt kill", "Encore shadow punch"); el diccionario chino->inglés no los toca.
    // Aquí se traducen movimientos, habilidades, objetos y jerga habitual de estrategia.

    const STRATEGY_EN = {
        "stay": "Permanece en el campo", "stay on field": "Permanece en el campo",
        "switch": "Cambiar", "switches": "cambia", "sack": "Sacrificar",
        "kill": "derrota", "kills": "derrota", "killed": "derrotado",
        "sweep": "barrer", "sweeps": "barre", "outspeed": "supera en velocidad", "outspeeds": "supera en velocidad",
        "ohko": "KO de un golpe", "2hko": "KO en 2 golpes", "3hko": "KO en 3 golpes",
        "crit": "crítico", "crits": "críticos", "setup": "preparación", "speed tie": "empate de velocidad",
        "heal": "curar", "heals": "cura", "self lock": "autobloqueo",
        "stat boost": "subida de estadísticas", "after stat boost": "tras subir estadísticas",
        "see under": "ver abajo", "see above": "ver arriba", "see below": "ver abajo",
        "can randomly run": "puede cambiar al azar", "randomly": "al azar",
        "tbolt": "Rayo", "espeed": "Velocidad Extrema", "e-speed": "Velocidad Extrema",
        "encore": "Otra vez", "no encore": "No hagas Otra vez", "dont encore": "No hagas Otra vez",
        "don't encore": "No hagas Otra vez", "no intimidate": "No tiene Intimidación",
        "test": "prueba", "drill": "Taladradora", "exca": "Excadrill", "chomp": "Garchomp", "dnite": "Dragonite",
        "rocks": "Trampa Rocas",
        "atk": "Ataque", "def": "Defensa", "spa": "At. Esp.", "spd": "Def. Esp.", "spe": "Velocidad",
        "speed": "Velocidad", "hp": "PS", "attack": "Ataque", "defense": "Defensa",
        "sp. atk": "At. Esp.", "sp. def": "Def. Esp.", "special attack": "At. Esp.", "special defense": "Def. Esp.",
        "spd tank": "aguante especial",
        "paralyzed": "paralizado", "paralysis": "parálisis", "burned": "quemado", "poisoned": "envenenado",
        "asleep": "dormido", "frozen": "congelado", "confused": "confuso", "flinch": "retroceso",
        "switch in": "entra", "switch out": "sale", "switch to": "cambia a", "switches to": "cambia a",
        "switch into": "cambia a", "switches into": "cambia a",
        "priority": "prioridad", "boost": "potenciación", "boosts": "potencia", "boosted": "potenciado",
        "unboosted": "sin potenciar", "drop": "bajada", "drops": "baja", "dropped": "bajó",
        "heal up": "curarse", "full health": "salud completa", "low hp": "PS bajos",
        "once": "una vez", "twice": "dos veces", "before": "antes de", "after": "tras", "then": "luego",
        "always": "siempre", "never": "nunca", "cannot": "no puede", "can't": "no puede",
        "weak to": "débil a", "resists": "resiste", "immune to": "inmune a", "immune": "inmune",
        "faster": "más rápido", "slower": "más lento", "turn": "turno", "turns": "turnos",
        "lure": "atraer", "lures": "atrae", "revenge kill": "derrota de venganza",
        "ice": "Hielo", "ground": "Tierra", "grass": "Planta", "fire": "Fuego", "water": "Agua",
        "electric": "Eléctrico", "rock": "Roca", "steel": "Acero", "fighting": "Lucha", "flying": "Volador",
        "psychic": "Psíquico", "poison": "Veneno", "dark": "Siniestro", "dragon": "Dragón",
        "fairy": "Hada", "bug": "Bicho"
    };

    // Naturalezas: solo las que no son palabras corrientes del inglés.
    const EN_NATURES = ["adamant", "jolly", "timid", "modest", "impish", "naive", "naughty", "lonely",
        "hasty", "sassy", "quirky", "bashful", "docile"];

    // Palabras sueltas que en inglés corriente significan otra cosa ("the rest", "fly", "static"):
    // solo se traducen si empiezan en mayúscula (nombre de movimiento o habilidad).
    const EN_CAPS_ONLY = new Set(["rest", "fly", "dig", "dive", "flash", "charge", "swift", "rage", "gust", "curse",
        "detect", "disable", "endure", "fling", "harden", "howl", "lick", "mimic", "roar", "snore", "soak", "stomp",
        "spark", "tackle", "thief", "wrap", "pound", "scratch", "slam", "slash", "coil", "struggle", "splash",
        "bounce", "confusion", "constrict", "static", "simple", "filter", "trace", "guts", "stall", "pressure",
        "harvest", "moody", "healer", "justified", "defeatist", "unaware", "magnet", "charcoal", "leek"]);

    // Palabras que se dejan fuera del todo porque son demasiado corrientes en inglés.
    const EN_SKIP = new Set(["round", "present", "growth", "mist", "bind", "hail", "counter", "trick", "wish",
        "spite", "charm", "sing", "sketch", "hex", "block", "return"]);

    const EN_TERMS = Object.create(null);
    for (const source of [MOVES, ABILITIES, ITEMS]) {
        for (const [key, value] of Object.entries(source)) if (!EN_SKIP.has(key)) EN_TERMS[key] = value;
    }
    for (const nature of EN_NATURES) EN_TERMS[nature] = NATURES[nature];
    Object.assign(EN_TERMS, STRATEGY_EN);
    EN_CAPS_ONLY.delete("stay");

    let enRegex = null;

    function buildEnglishRegex() {
        const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ +/g, "\\s+");
        const alternation = Object.keys(EN_TERMS)
            .sort((a, b) => b.length - a.length)
            .map(escape)
            .join("|");
        enRegex = new RegExp(
            "(?<![A-Za-zÁÉÍÓÚÑáéíóúñ0-9_])(?:" + alternation + ")(?![A-Za-zÁÉÍÓÚÑáéíóúñ0-9_])", "gi");
    }

    function translateEnglish(text) {
        if (typeof text !== "string" || !/[A-Za-z]{2}/.test(text)) return text;
        if (!enRegex) buildEnglishRegex();
        return text.replace(enRegex, (match) => {
            const key = match.toLowerCase().replace(/\s+/g, " ");
            const es = EN_TERMS[key];
            if (es === undefined) return match;
            if (EN_CAPS_ONLY.has(key) && /^[a-z]/.test(match)) return match;
            // Se conserva la mayúscula inicial que tuviera el original.
            return /^[A-Z]/.test(match) && /^[a-záéíóúñ]/.test(es) ? es[0].toUpperCase() + es.slice(1) : es;
        });
    }

    globalThis.POKEKING_ES = { translateValue, translateExtras, translateEnglish, overrides: OVERRIDES, words: WORDS, exact: EXACT };
})();
