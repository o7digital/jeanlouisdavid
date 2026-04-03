export type NavItem = {
  label: string;
  description: string;
  icon: IconName;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  tone: "warm" | "cool" | "neutral";
};

export type WorkspaceCard = {
  title: string;
  description: string;
  icon: IconName;
  pills: string[];
};

export type FocusCard = {
  title: string;
  description: string;
  icon: IconName;
  bullets: string[];
};

export type TableRow = {
  name: string;
  branch: string;
  productivity: string;
  ticket: string;
  occupancy: string;
  focus: string;
};

export type AlertRow = {
  level: "critical" | "warning" | "info";
  title: string;
  description: string;
  owner: string;
};

export type RoadmapStep = {
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
};

export type ArchitectureCard = {
  title: string;
  description: string;
  icon: IconName;
};

export type IconName =
  | "grid"
  | "pulse"
  | "users"
  | "bottle"
  | "search"
  | "clock"
  | "chart"
  | "shield"
  | "store"
  | "spark"
  | "list"
  | "box";

export const adminNavigation: NavGroup[] = [
  {
    title: "Core",
    items: [
      {
        label: "Command center",
        description: "Vista ejecutiva con estado de sucursales, ventas y alertas.",
        icon: "pulse",
        badge: "nuevo",
      },
      {
        label: "Productividad",
        description: "Colaboradores, metas por turno y seguimiento de ticket promedio.",
        icon: "chart",
      },
      {
        label: "Clientes 360",
        description: "Historial, sesiones, cancelaciones y fidelizacion.",
        icon: "users",
      },
    ],
  },
  {
    title: "Operacion",
    items: [
      {
        label: "Catalogos",
        description: "Servicios, productos, precios, lineas y clasificaciones.",
        icon: "grid",
      },
      {
        label: "Inventario",
        description: "Stock por sucursal, ajustes, transferencias y consumo interno.",
        icon: "box",
      },
      {
        label: "Sucursales",
        description: "Salud operativa, licencias, staffing y comparativos.",
        icon: "store",
      },
    ],
  },
  {
    title: "Control",
    items: [
      {
        label: "Bitacora",
        description: "Trazabilidad de cambios, usuarios y eventos criticos.",
        icon: "list",
      },
      {
        label: "Permisos",
        description: "Roles por area, acceso fino y aprobaciones sensibles.",
        icon: "shield",
      },
      {
        label: "Busqueda global",
        description: "Un solo punto para clientes, productos, tickets y movimientos.",
        icon: "search",
      },
    ],
  },
];

export const metrics: Metric[] = [
  {
    label: "Ingresos del dia",
    value: "$184,320",
    delta: "+12.4% vs ayer",
    tone: "warm",
  },
  {
    label: "Ticket promedio",
    value: "$1,162",
    delta: "+6.8% sobre meta",
    tone: "cool",
  },
  {
    label: "Ocupacion agenda",
    value: "87%",
    delta: "14 huecos a resolver",
    tone: "neutral",
  },
  {
    label: "Riesgo de inventario",
    value: "09 SKU",
    delta: "3 sucursales afectadas",
    tone: "warm",
  },
];

export const workspaces: WorkspaceCard[] = [
  {
    title: "Panel ejecutivo",
    description:
      "Resume ventas, ocupacion, incidencias y comparativos por sucursal en una sola vista.",
    icon: "pulse",
    pills: ["sucursales", "ventas", "alertas"],
  },
  {
    title: "Mesa de productividad",
    description:
      "Sustituye las tablas blancas del legacy por prioridades, ranking y contexto de negocio.",
    icon: "chart",
    pills: ["colaboradores", "objetivos", "turnos"],
  },
  {
    title: "CRM salon",
    description:
      "Conecta historial de clientes, cancelaciones, recompra y proxima accion sugerida.",
    icon: "users",
    pills: ["historial", "agenda", "retencion"],
  },
  {
    title: "Catalogo vivo",
    description:
      "Precios y clasificaciones editables con versionado, impacto y validacion por rol.",
    icon: "grid",
    pills: ["servicios", "productos", "precios"],
  },
  {
    title: "Control de stock",
    description:
      "Une existencias, compras, consumo interno y transferencias sin cambiar de modulo.",
    icon: "bottle",
    pills: ["inventario", "compras", "consumo"],
  },
  {
    title: "Busqueda universal",
    description:
      "Encuentra cualquier entidad por nombre, folio, telefono o codigo en segundos.",
    icon: "search",
    pills: ["cliente", "ticket", "sku"],
  },
];

export const focusCards: FocusCard[] = [
  {
    title: "Problemas del sistema actual",
    description:
      "Las capturas muestran una interfaz con mucho espacio muerto, tablas sin jerarquia y modulos desconectados.",
    icon: "clock",
    bullets: [
      "Navegacion repetitiva y poco escalable.",
      "Informacion critica perdida dentro de tablas planas.",
      "No existe una vista transversal por sucursal o por colaborador.",
    ],
  },
  {
    title: "Propuesta de estructura",
    description:
      "Reorganizar el sistema por flujos de negocio y no por pantallas aisladas.",
    icon: "spark",
    bullets: [
      "Core: command center, productividad, clientes.",
      "Operacion: catalogos, inventario, sucursales.",
      "Control: permisos, bitacora, trazabilidad.",
    ],
  },
  {
    title: "Sistema complementario",
    description:
      "Montar una nueva capa de interfaz encima del backend legacy para migrar sin apagar operacion.",
    icon: "shield",
    bullets: [
      "Frontend nuevo por modulos prioritarios.",
      "APIs o adaptadores sobre el sistema existente.",
      "Migracion progresiva con doble convivencia.",
    ],
  },
];

export const collaboratorRows: TableRow[] = [
  {
    name: "Juan Resendiz",
    branch: "Santa Fe",
    productivity: "93%",
    ticket: "$1,246",
    occupancy: "88%",
    focus: "Color premium y upsell de tratamiento.",
  },
  {
    name: "Andrea Certucha",
    branch: "Santa Fe",
    productivity: "89%",
    ticket: "$1,198",
    occupancy: "84%",
    focus: "Huecos el jueves por la tarde.",
  },
  {
    name: "Araceli Gomez",
    branch: "Polanco",
    productivity: "97%",
    ticket: "$1,321",
    occupancy: "91%",
    focus: "Top performer en recurrencia.",
  },
  {
    name: "Omar Salgado",
    branch: "Recepcion",
    productivity: "81%",
    ticket: "$912",
    occupancy: "76%",
    focus: "Reducir cancelaciones de ultima hora.",
  },
];

export const alertRows: AlertRow[] = [
  {
    level: "critical",
    title: "Brazilian Dry Oil 100ml en minimo",
    description: "Santa Fe y Polanco tienen menos de 2 dias de cobertura.",
    owner: "Compras",
  },
  {
    level: "warning",
    title: "Agenda con 14 espacios vacios",
    description: "Hay huecos concentrados entre 13:00 y 16:00 en Santa Fe.",
    owner: "Recepcion",
  },
  {
    level: "info",
    title: "3 servicios con precios por validar",
    description: "Cambios pendientes de aprobacion antes del siguiente corte.",
    owner: "Catalogos",
  },
];

export const roadmap: RoadmapStep[] = [
  {
    phase: "Fase 01",
    title: "Capa de lectura del legacy",
    description:
      "Mapear tablas, endpoints y consultas actuales para exponer un contrato estable.",
    deliverables: ["inventario de datos", "adaptadores", "modelo comun"],
  },
  {
    phase: "Fase 02",
    title: "Nuevo shell operativo",
    description:
      "Lanzar login, navegacion principal, command center y busqueda global.",
    deliverables: ["layout", "roles", "panel ejecutivo"],
  },
  {
    phase: "Fase 03",
    title: "Migracion por dominios",
    description:
      "Rehacer productividad, clientes y catalogos con foco en velocidad y trazabilidad.",
    deliverables: ["tablas ricas", "filtros", "acciones masivas"],
  },
  {
    phase: "Fase 04",
    title: "Automatizacion y control",
    description:
      "Agregar alertas, aprobaciones, auditoria y comparativos entre sucursales.",
    deliverables: ["alert engine", "bitacora", "reportes"],
  },
];

export const architectureCards: ArchitectureCard[] = [
  {
    title: "UI shell unico",
    description: "Sidebar, top search, estados y acciones compartidas para todos los modulos.",
    icon: "grid",
  },
  {
    title: "Dominios desacoplados",
    description: "Cada area del negocio vive como modulo con datos y permisos propios.",
    icon: "box",
  },
  {
    title: "Capa adaptadora",
    description: "El backend legacy sigue operando mientras la nueva capa consume y normaliza.",
    icon: "shield",
  },
  {
    title: "Insight en tiempo real",
    description: "Alertas, metas y comparativos visibles sin abrir cinco pantallas distintas.",
    icon: "pulse",
  },
];
