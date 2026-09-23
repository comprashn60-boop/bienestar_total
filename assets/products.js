/* =========================================================
   DATOS: DEPARTAMENTOS Y MUNICIPIOS DE HONDURAS
========================================================= */
const HONDURAS = {
  "Atlántida": ["La Ceiba","El Porvenir","Esparta","Jutiapa","La Masica","San Francisco","Tela","Arizona"],
  "Colón": ["Trujillo","Balfate","Bonito Oriental","Iriona","Limón","Sabá","Santa Fe","Santa Rosa de Aguán","Sonaguera","Tocoa"],
  "Comayagua": ["Comayagua","Ajuterique","El Rosario","Esquías","Humuya","La Libertad","La Trinidad","Lamaní","Lejamaní","Meámbar","Minas de Oro","Ojos de Agua","San Jerónimo","San José de Comayagua","San José del Potrero","San Luis","San Sebastián","Siguatepeque","Villa de San Antonio","Las Lajas","Taulabé"],
  "Copán": ["Santa Rosa de Copán","Cabañas","Concepción","Copán Ruinas","Corquín","Cucuyagua","Dolores","Dulce Nombre","El Paraíso","Florida","La Jigua","La Unión","Nueva Arcadia","San Agustín","San Antonio","San Jerónimo","San José","San Juan de Opoa","San Nicolás","San Pedro de Copán","Santa Rita","Trinidad de Copán","Veracruz"],
  "Cortés": ["San Pedro Sula","Choloma","La Lima","Omoa","Pimienta","Potrerillos","Puerto Cortés","San Antonio de Cortés","San Francisco de Yojoa","San Manuel","Santa Cruz de Yojoa","Villanueva"],
  "El Paraíso": ["Yuscarán","Alauca","Danlí","El Paraíso","Güinope","Jacaleapa","Liure","Morocelí","Oropolí","Potrerillos","San Antonio de Flores","San Lucas","San Matías","Soledad","Teupasenti","Texiguat","Vado Ancho","Yauyupe","Trojes"],
  "Francisco Morazán": ["Distrito Central (Tegucigalpa)","Alubarén","Cedros","Curarén","El Porvenir","Guaimaca","Lepaterique","Maraita","Marale","Nueva Armenia","Ojojona","Orica","Reitoca","Sabanagrande","San Antonio de Oriente","San Buenaventura","San Ignacio","San Juan de Flores","San Miguelito","Santa Ana","Santa Lucía","Talanga","Tatumbla","Valle de Ángeles","Vallecillo","Villa de San Francisco"],
  "Gracias a Dios": ["Puerto Lempira","Brus Laguna","Ahuas","Juan Francisco Bulnes","Ramón Villeda Morales","Wampusirpi"],
  "Intibucá": ["La Esperanza","Camasca","Colomoncagua","Concepción","Dolores","Intibucá","Jesús de Otoro","Magdalena","Masaguara","San Antonio","San Isidro","San Juan","San Marcos de la Sierra","Santa Lucía","Yamaranguila","San Francisco de Opalaca"],
  "Islas de la Bahía": ["Roatán","Guanaja","José Santos Guardiola","Utila"],
  "La Paz": ["La Paz","Aguanqueterique","Cabañas","Cane","Chinacla","Guajiquiro","Lauterique","Marcala","Mercedes de Oriente","Opatoro","San Antonio del Norte","San José","San Juan","San Pedro de Tutule","Santa Ana","Santa Elena","Santa María","Santiago de Puringla","Yarula"],
  "Lempira": ["Gracias","Belén","Candelaria","Cololaca","Erandique","Gualcince","Guarita","La Campa","La Iguala","Las Flores","La Unión","La Virtud","Lepaera","Mapulaca","Piraera","San Andrés","San Francisco","San Juan Guarita","San Manuel Colohete","San Rafael","San Sebastián","Santa Cruz","Talgua","Tambla","Tomalá","Valladolid","Virginia","San Marcos de Caiquín"],
  "Ocotepeque": ["Nueva Ocotepeque","Belén Gualcho","Concepción","Dolores Merendón","Fraternidad","La Encarnación","La Labor","Lucerna","Mercedes","San Fernando","San Francisco del Valle","San Jorge","San Marcos","Santa Fe","Sensenti","Sinuapa"],
  "Olancho": ["Juticalpa","Campamento","Catacamas","Concordia","Dulce Nombre de Culmí","El Rosario","Esquipulas del Norte","Gualaco","Guarizama","Guata","Guayape","Jano","La Unión","Mangulile","Manto","Salamá","San Esteban","Santa María del Real","Silca","Yocón","Patuca"],
  "Santa Bárbara": ["Santa Bárbara","Arada","Atima","Azacualpa","Ceguaca","Concepción del Norte","Concepción del Sur","Chinda","El Níspero","Gualala","Ilama","Macuelizo","Naranjito","Nuevo Celilac","Petoa","Protección","Quimistán","San Francisco de Ojuera","San José de Colinas","San Luis","San Marcos","San Nicolás","San Pedro Zacapa","San Vicente Centenario","Santa Rita","Trinidad","Nueva Frontera"],
  "Valle": ["Nacaome","Alianza","Amapala","Aramecina","Caridad","Goascorán","Langue","San Francisco de Coray","San Lorenzo"],
  "Yoro": ["Yoro","Arenal","El Negrito","El Progreso","Jocón","Morazán","Olanchito","Santa Rita","Sulaco","Victoria","Yorito"]
};

/* =========================================================
   PRODUCTOS
========================================================= */
const products = [
  {
    id: 1,
    title: "Faja Reductora Térmica Colombiana",
    category: "FITNESS",
    badge: "Más Vendido",
    originalPrice: 890,
    price: 650,
    imagen: "images/faja-reductora-termica-colombiana-1.webp",
    benefits: [
      "Moldea la figura al instante",
      "Tejido térmico transpirable",
      "Reduce hasta 2 tallas visualmente",
      "Cómoda para uso diario"
    ]
  },
  {
    id: 5,
    title: "2 Bandas para Entrenar (1 Banda de Pedal + 1 Banda para Brazos)",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 850,
    price: 500,
    description: "Entrena ahorra tiempo: tonifica y fortalece brazos, abdomen, glúteos y piernas desde casa y donde quieras.",
    imagen: "images/2-bandas-entrenar.webp",
    benefits: [
      "Incluye 1 banda de pedal + 1 banda para brazos",
      "Tonifica y fortalece brazos, abdomen, glúteos y piernas",
      "Ligera, portátil y fácil de usar",
      "Envío Gratis y pago contra entrega"
    ]
  },
  {
    id: 6,
    title: "Alfombra para Ejercicios (Yoga, Pilates y Fitness)",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 750,
    price: 570,
    description: "Tu espacio, tu bienestar. Ideal para yoga, pilates, fitness y estiramientos, en casa o en el gimnasio.",
    imagen: "images/alfombra-yoga-ejercicios-1.webp",
    benefits: [
      "Ideal para yoga, pilates, fitness y estiramientos",
      "Material de alta calidad: suave, resistente y duradera",
      "Superficie antideslizante para mayor estabilidad",
      "Ligera y portátil, incluye cinta de transporte"
    ]
  },
  {
    id: 7,
    title: "Masajeador Recargable para Cólicos Menstruales",
    category: "BIENESTAR CORPORAL",
    badge: "Oferta",
    originalPrice: 950,
    price: 700,
    description: "Alivio, comodidad y bienestar en tus días difíciles. Terapia de calor y vibración en un diseño ligero y portátil.",
    imagen: "images/masajeador-colicos-menstruales-1.webp",
    benefits: [
      "3 niveles de calor y vibración",
      "Recargable y práctico",
      "Reduce la tensión y mejora la circulación",
      "Ligero, cómodo y portátil para usar en casa o donde quieras"
    ]
  },
  {
    id: 8,
    title: "Parches Kinoki para Pies",
    category: "BIENESTAR CORPORAL",
    badge: "Oferta",
    originalPrice: 450,
    price: 450,
    description: "10 almohadillas adhesivas para usar durante la noche. Fáciles y cómodas de colocar, ideales para complementar tu rutina de bienestar.",
    imagen: "images/parches-kinoki-pies-1.webp",
    benefits: [
      "Incluye 10 almohadillas adhesivas",
      "Úsalos durante la noche",
      "Fáciles y cómodos de colocar",
      "Ideal para complementar tu rutina de bienestar"
    ]
  },
  {
    id: 9,
    title: "Tabla de Flexiones Multifunción",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 850,
    price: 650,
    description: "Entrena cuerpo completo desde casa: pecho, brazos, abdomen y espalda con un solo equipo.",
    imagen: "images/tabla-flexiones-multifuncion-1.webp",
    benefits: [
      "Fortalece y tonifica pecho, brazos, abdomen y espalda",
      "Ideal para entrenar en casa",
      "Diferentes posiciones de entrenamiento",
      "Práctica, resistente y portátil"
    ]
  },
  {
    id: 10,
    title: "Tabla de Pilates Multifunción",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 1800,
    price: 1500,
    description: "Entrena todo tu cuerpo desde casa. Plegable y fácil de guardar, tu aliada para un cuerpo más fuerte, saludable y fit.",
    imagen: "images/tabla-pilates-multifuncion-1.webp",
    benefits: [
      "Tonifica abdomen, brazos, piernas y glúteos",
      "Fortalece y mejora tu flexibilidad",
      "Entrena cuando quieras, donde quieras",
      "Plegable y fácil de guardar"
    ]
  },
  {
    id: 11,
    title: "Body Gym de 4 Cuerdas",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 870,
    price: 750,
    description: "Entrena todo tu cuerpo desde casa con 4 cuerdas de alta resistencia. Fácil de usar y transportar.",
    imagen: "images/body-gym-4-cuerdas-1.jpg",
    benefits: [
      "Ideal para abdominales y glúteos",
      "Tonifica brazos y piernas",
      "4 cuerdas de alta resistencia",
      "Fácil de usar y transportar"
    ]
  },
  {
    id: 12,
    title: "Faja Moldeadora Reloj de Arena",
    category: "FITNESS",
    badge: "Oferta",
    originalPrice: 750,
    price: 650,
    description: "Define tu figura, realza tu belleza. Moldea tu cintura con efecto reloj de arena.",
    imagen: "images/faja-moldeadora-reloj-arena-1.webp",
    benefits: [
      "Moldea y define tu cintura",
      "Ayuda a estilizar tu silueta",
      "Cierre de ganchos ajustables",
      "Disponible en color negro, tallas S a 4XL"
    ]
  }
];

/* Número de WhatsApp Business (solo dígitos, con código de país) donde llegan los pedidos */
const WHATSAPP_NUMBER = "50487353593";

/* Descuentos por cantidad: 1 = normal, 2 = L.200 de descuento fijo */
const QTY_TIERS = [
  { qty: 1, label: "1 unidad", discountAmount: 0 },
  { qty: 2, label: "2 unidades", discountAmount: 200 }
];

function formatL(n) {
  return "L. " + n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
