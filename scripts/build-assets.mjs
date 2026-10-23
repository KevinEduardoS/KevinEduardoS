// Genera las imágenes SVG del README del perfil en assets/.
//   node scripts/build-assets.mjs
// Los textos y colores se editan aquí; el README solo referencia los archivos generados.
import { mkdir, writeFile } from 'node:fs/promises';

const FONT = "'Segoe UI', Ubuntu, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Ancho aproximado de un texto: suficiente para colocar etiquetas sin medir fuentes reales.
const textWidth = (text, size) => text.length * size * 0.56;

const wrap = (text, maxChars) => {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > maxChars) {
      lines.push(line.trim());
      line = word;
    } else {
      line += ' ' + word;
    }
  }
  return [...lines, line.trim()].filter(Boolean);
};

const chips = (labels, x, y, { size = 13, color = '#c9d1d9', stroke = '#30363d' } = {}) => {
  let cursor = x;
  return labels
    .map((label) => {
      const width = textWidth(label, size) + 24;
      const chip = `<rect x="${cursor}" y="${y}" width="${width}" height="28" rx="14" fill="#161b22" stroke="${stroke}"/>
    <text x="${cursor + width / 2}" y="${y + 18.5}" text-anchor="middle" font-family="${FONT}" font-size="${size}" fill="${color}">${escape(label)}</text>`;
      cursor += width + 8;
      return chip;
    })
    .join('\n    ');
};

// ---------- Cabecera ----------

const TEST_LINES = [
  ['login con credenciales inválidas', '1.2s'],
  ['añadir producto al carrito', '2.4s'],
  ['validación del formulario', '0.9s'],
  ['diagnóstico de fallo con IA', '1.7s'],
];

const header = () => {
  const cycle = 9;
  const lineKeyframes = TEST_LINES.map((_, index) => {
    const start = 12 + index * 9;
    return `@keyframes line${index} { 0%, ${start}% { opacity: 0; transform: translateY(6px); } ${start + 4}%, 88% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; } }`;
  }).join('\n    ');
  const summaryStart = 12 + TEST_LINES.length * 9 + 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="380" viewBox="0 0 1280 380" role="img" aria-label="Kevin Samboni — Ingeniero de software full stack, QA y testing">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0e1a"/>
      <stop offset="1" stop-color="#0d1117"/>
    </linearGradient>
    <radialGradient id="glowA"><stop offset="0" stop-color="#6366f1" stop-opacity="0.55"/><stop offset="1" stop-color="#6366f1" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB"><stop offset="0" stop-color="#0ea5e9" stop-opacity="0.4"/><stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowC"><stop offset="0" stop-color="#10b981" stop-opacity="0.35"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    <linearGradient id="role" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a5b4fc"/><stop offset="0.5" stop-color="#7dd3fc"/><stop offset="1" stop-color="#6ee7b7"/>
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#818cf8" stop-opacity="0.7"/><stop offset="1" stop-color="#34d399" stop-opacity="0.5"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#ffffff" stroke-opacity="0.045"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="gridMask"><rect width="1280" height="380" fill="url(#fade)"/></mask>
    <clipPath id="frame"><rect width="1280" height="380" rx="20"/></clipPath>
  </defs>
  <style>
    .float-a { animation: drift 16s ease-in-out infinite; transform-origin: center; }
    .float-b { animation: drift 20s ease-in-out infinite reverse; transform-origin: center; }
    .float-c { animation: drift 24s ease-in-out infinite; transform-origin: center; }
    @keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, -24px); } }
    .pulse { animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    ${lineKeyframes}
    @keyframes summary { 0%, ${summaryStart}% { opacity: 0; } ${summaryStart + 4}%, 88% { opacity: 1; } 96%, 100% { opacity: 0; } }
    ${TEST_LINES.map((_, index) => `.line${index} { animation: line${index} ${cycle}s ease-out infinite; }`).join('\n    ')}
    .summary { animation: summary ${cycle}s ease-out infinite; }
  </style>

  <g clip-path="url(#frame)">
    <rect width="1280" height="380" fill="url(#bg)"/>
    <rect width="1280" height="380" fill="url(#grid)" mask="url(#gridMask)"/>
    <circle class="float-a" cx="180" cy="40" r="300" fill="url(#glowA)"/>
    <circle class="float-b" cx="1060" cy="60" r="280" fill="url(#glowB)"/>
    <circle class="float-c" cx="700" cy="420" r="260" fill="url(#glowC)"/>
  </g>
  <rect x="0.5" y="0.5" width="1279" height="379" rx="20" fill="none" stroke="#30363d"/>

  <g font-family="${FONT}">
    <rect x="64" y="70" width="252" height="32" rx="16" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.35"/>
    <circle class="pulse" cx="86" cy="86" r="5" fill="#34d399"/>
    <text x="100" y="91" font-size="14" font-weight="600" fill="#6ee7b7">Abierto a nuevas oportunidades</text>

    <text x="62" y="174" font-size="68" font-weight="700" fill="#ffffff" letter-spacing="-1.5">Kevin Samboni</text>
    <text x="64" y="222" font-size="28" font-weight="600" fill="url(#role)">Ingeniero de Software · Full Stack</text>
    <text x="64" y="262" font-size="18" fill="#8b949e">Productos confiables con testing riguroso y automatización.</text>

    ${chips(['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Playwright', 'IA'], 64, 296, { size: 14, color: '#e6edf3', stroke: '#3d444d' })}
  </g>

  <g transform="translate(760 64)">
    <rect width="456" height="252" rx="14" fill="#010409" fill-opacity="0.85" stroke="url(#border)" stroke-width="1.5"/>
    <circle cx="22" cy="22" r="6" fill="#f87171" fill-opacity="0.8"/>
    <circle cx="42" cy="22" r="6" fill="#fbbf24" fill-opacity="0.8"/>
    <circle cx="62" cy="22" r="6" fill="#34d399" fill-opacity="0.8"/>
    <text x="228" y="27" text-anchor="middle" font-family="${MONO}" font-size="12" fill="#6e7681">qa-pipeline</text>
    <line x1="0" y1="44" x2="456" y2="44" stroke="#21262d"/>
    <g font-family="${MONO}" font-size="14">
      <text x="22" y="76" fill="#8b949e"><tspan fill="#7dd3fc">$</tspan> npx playwright test</text>
      ${TEST_LINES.map(
        ([name, time], index) => `<g class="line${index}">
        <text x="22" y="${110 + index * 28}" fill="#c9d1d9"><tspan fill="#34d399">✓</tspan>  ${escape(name)}</text>
        <text x="434" y="${110 + index * 28}" text-anchor="end" fill="#6e7681">${time}</text>
      </g>`,
      ).join('\n      ')}
      <text class="summary" x="22" y="230" fill="#34d399" font-weight="700">4 passed <tspan fill="#6e7681" font-weight="400">(6.2s)</tspan><tspan class="cursor" fill="#c9d1d9"> ▍</tspan></text>
    </g>
  </g>
</svg>
`;
};

// ---------- Lo que hago ----------

const FOCUS = [
  {
    title: 'Full Stack',
    color: '#818cf8',
    icon: '<path d="M8 10l-5 6 5 6M24 10l5 6-5 6M19 7l-6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    text: 'Frontend con React, TypeScript y Tailwind CSS, y backend con Node.js.',
  },
  {
    title: 'QA & Testing',
    color: '#34d399',
    icon: '<path d="M16 3l10 4v8c0 7-4.5 11.5-10 14-5.5-2.5-10-7-10-14V7z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M11 16l3.5 3.5L21 13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    text: 'Pruebas funcionales y de regresión, flujos críticos y automatización con Playwright.',
  },
  {
    title: 'IA & Automatización',
    color: '#7dd3fc',
    icon: '<path d="M16 4l2.6 7.4L26 14l-7.4 2.6L16 24l-2.6-7.4L6 14l7.4-2.6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="25" cy="25" r="2.2" fill="currentColor"/>',
    text: 'Modelos de lenguaje integrados en flujos reales y diseño de procesos automáticos.',
  },
];

const focus = () => {
  const width = 400;
  const gap = 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="200" viewBox="0 0 1280 200" role="img" aria-label="Full stack, QA y testing, IA y automatización">
  <g font-family="${FONT}">
  ${FOCUS.map((item, index) => {
    const x = index * (width + gap);
    return `<g transform="translate(${x} 0)">
    <clipPath id="card${index}"><rect x="0.5" y="0.5" width="${width - 1}" height="199" rx="16"/></clipPath>
    <rect x="0.5" y="0.5" width="${width - 1}" height="199" rx="16" fill="#0d1117"/>
    <rect x="0" y="0" width="${width}" height="4" fill="${item.color}" fill-opacity="0.9" clip-path="url(#card${index})"/>
    <rect x="0.5" y="0.5" width="${width - 1}" height="199" rx="16" fill="none" stroke="#30363d"/>
    <rect x="28" y="32" width="48" height="48" rx="12" fill="${item.color}" fill-opacity="0.12" stroke="${item.color}" stroke-opacity="0.35"/>
    <g transform="translate(36 40)" color="${item.color}">${item.icon}</g>
    <text x="96" y="64" font-size="22" font-weight="700" fill="#e6edf3">${escape(item.title)}</text>
    ${wrap(item.text, 44)
      .map((line, row) => `<text x="28" y="${120 + row * 26}" font-size="16" fill="#8b949e">${escape(line)}</text>`)
      .join('\n    ')}
  </g>`;
  }).join('\n  ')}
  </g>
</svg>
`;
};

// ---------- Proyectos ----------

const PROJECTS = [
  {
    file: 'project-testpilot',
    initials: 'TP',
    name: 'TestPilot',
    tag: 'IA · QA AUTOMATION',
    from: '#6366f1',
    to: '#10b981',
    text: 'Convierte lenguaje natural en pruebas Playwright, las ejecuta en un navegador real y usa IA para distinguir un error de la prueba de un bug real del sitio.',
    stack: ['TypeScript', 'React', 'Fastify', 'Playwright', 'Claude'],
    badge: 'Destacado',
  },
  {
    file: 'project-storylint',
    initials: 'SL',
    name: 'StoryLint',
    tag: 'QA · AGILE',
    from: '#f59e0b',
    to: '#ef4444',
    text: 'Analiza historias de usuario: detecta ambigüedades, propone criterios de aceptación, genera casos de prueba y puntúa su calidad de 0 a 100.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    badge: 'Demo en vivo',
  },
  {
    file: 'project-incidentflow',
    initials: 'IF',
    name: 'IncidentFlow',
    tag: 'FULL-STACK',
    from: '#0ea5e9',
    to: '#6366f1',
    text: 'Gestión de incidencias con flujo de estados validado en el servidor, tablero kanban, roles, auditoría y pruebas en tres capas.',
    stack: ['React', 'TypeScript', 'Node.js'],
  },
  {
    file: 'project-coffetech',
    initials: 'CT',
    name: 'CoffeTech',
    tag: 'MOBILE',
    from: '#a16207',
    to: '#f59e0b',
    text: 'Aplicación Android nativa desarrollada en Kotlin.',
    stack: ['Kotlin', 'Android'],
  },
];

const projectCard = (project) => `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="300" viewBox="0 0 640 300" role="img" aria-label="${escape(project.name)}: ${escape(project.text)}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${project.from}"/><stop offset="1" stop-color="${project.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="1" cy="0" r="1">
      <stop offset="0" stop-color="${project.to}" stop-opacity="0.18"/><stop offset="0.6" stop-color="${project.to}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="1" y="1" width="638" height="298" rx="18" fill="#0d1117"/>
  <rect x="1" y="1" width="638" height="298" rx="18" fill="url(#glow)"/>
  <rect x="1" y="1" width="638" height="298" rx="18" fill="none" stroke="url(#accent)" stroke-opacity="0.65" stroke-width="1.5"/>
  <g font-family="${FONT}">
    <rect x="32" y="32" width="56" height="56" rx="14" fill="url(#accent)"/>
    <text x="60" y="68" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">${project.initials}</text>
    <text x="108" y="56" font-size="12" font-weight="700" letter-spacing="1.6" fill="${project.to}">${escape(project.tag)}</text>
    <text x="108" y="84" font-size="28" font-weight="700" fill="#ffffff">${escape(project.name)}</text>
    ${
      project.badge
        ? `<rect x="${608 - textWidth(project.badge, 12) - 22}" y="36" width="${textWidth(project.badge, 12) + 22}" height="26" rx="13" fill="${project.to}" fill-opacity="0.14" stroke="${project.to}" stroke-opacity="0.45"/>
    <text x="${608 - (textWidth(project.badge, 12) + 22) / 2}" y="53.5" text-anchor="middle" font-size="12" font-weight="600" fill="${project.to}">${escape(project.badge)}</text>`
        : ''
    }
    ${wrap(project.text, 66)
      .map((line, row) => `<text x="32" y="${136 + row * 26}" font-size="17" fill="#8b949e">${escape(line)}</text>`)
      .join('\n    ')}
    ${chips(project.stack, 32, 232)}
    <text x="608" y="251" text-anchor="end" font-size="15" font-weight="600" fill="#e6edf3">Ver proyecto →</text>
  </g>
</svg>
`;

// ---------- Cierre ----------

const footer = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="120" viewBox="0 0 1280 120" role="img" aria-label="Gracias por visitar">
  <defs>
    <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6366f1"/><stop offset="0.5" stop-color="#0ea5e9"/><stop offset="1" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <style>
    .wave { animation: sway 10s ease-in-out infinite; }
    @keyframes sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-60px); } }
  </style>
  <path class="wave" d="M-80 70 C 140 30, 340 110, 600 70 S 1060 30, 1360 70 V120 H-80 Z" fill="url(#wave)" fill-opacity="0.25"/>
  <path d="M-20 85 C 220 50, 420 120, 660 85 S 1080 55, 1300 85 V120 H-20 Z" fill="url(#wave)" fill-opacity="0.55"/>
</svg>
`;

await mkdir(new URL('../assets/', import.meta.url), { recursive: true });
const outputs = {
  'header.svg': header(),
  'focus.svg': focus(),
  'footer.svg': footer(),
  ...Object.fromEntries(PROJECTS.map((project) => [`${project.file}.svg`, projectCard(project)])),
};
for (const [name, content] of Object.entries(outputs)) {
  await writeFile(new URL(`../assets/${name}`, import.meta.url), content);
}
console.log(`Generados: ${Object.keys(outputs).join(', ')}`);
