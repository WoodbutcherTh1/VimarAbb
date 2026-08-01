export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  specs: ProductSpec[];
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  children: Category[];
  products: Product[];
}

export interface Brand {
  id: string;
  name: string;
  logoText: string;
  tagline: string;
  accentColor: string;
  categories: Category[];
}

function product(overrides: Partial<Product> & Pick<Product, "id" | "sku" | "name">): Product {
  return {
    description: "Premium electrical component engineered for reliability and modern design.",
    price: 49.9,
    currency: "EUR",
    image: `https://picsum.photos/seed/${overrides.id}/600/600`,
    inStock: true,
    featured: false,
    tags: [],
    specs: [
      { label: "Material", value: "Polycarbonate" },
      { label: "Rated Voltage", value: "230V" },
      { label: "IP Rating", value: "IP20" },
      { label: "Warranty", value: "2 Years" },
    ],
    ...overrides,
  };
}

function category(id: string, name: string, opts: Partial<Pick<Category, "children" | "products" | "image">> = {}): Category {
  return {
    id,
    name,
    image: opts.image,
    children: opts.children ?? [],
    products: opts.products ?? [],
  };
}

// ---------------------------------------------------------------------------
// VIMAR
// ---------------------------------------------------------------------------

const vimarPlanaSockets = category("plana-sockets", "Sockets", {
  products: [
    product({
      id: "vimar-plana-socket-2p",
      sku: "VMR-PL-2P16",
      name: "Plana 2P+E Socket 16A",
      description: "Elegant 2-pole + earth socket from the Plana series, satin finish.",
      price: 18.5,
      featured: true,
      tags: ["Plana", "Socket", "16A"],
      specs: [
        { label: "Poles", value: "2P+E" },
        { label: "Current Rating", value: "16A" },
        { label: "Finish", value: "Satin White" },
        { label: "IP Rating", value: "IP20" },
      ],
    }),
    product({
      id: "vimar-plana-socket-usb",
      sku: "VMR-PL-USBC",
      name: "Plana USB-C Charging Socket",
      description: "Fast-charge USB-C outlet integrated into the Plana design line.",
      price: 34.0,
      featured: true,
      tags: ["Plana", "USB-C", "Charging"],
    }),
  ],
});

const vimarPlanaSwitches = category("plana-switches", "Switches", {
  products: [
    product({
      id: "vimar-plana-switch-1way",
      sku: "VMR-PL-SW1",
      name: "Plana 1-Way Switch",
      description: "Single-pole switch with soft-touch rocker, Plana collection.",
      price: 14.2,
      tags: ["Plana", "Switch"],
    }),
    product({
      id: "vimar-plana-switch-dimmer",
      sku: "VMR-PL-DIM",
      name: "Plana Rotary Dimmer",
      description: "Smooth rotary dimmer for incandescent and LED-compatible loads.",
      price: 42.75,
      tags: ["Plana", "Dimmer", "Lighting"],
    }),
  ],
});

const vimarPlana = category("plana", "Plana Series", {
  children: [vimarPlanaSockets, vimarPlanaSwitches],
});

const vimarEikonFrames = category("eikon-frames", "Frames", {
  products: [
    product({
      id: "vimar-eikon-frame-3m",
      sku: "VMR-EK-FR3",
      name: "Eikon 3-Module Frame",
      description: "Anthracite metal frame for 3-module Eikon Evo devices.",
      price: 22.0,
      tags: ["Eikon", "Frame"],
    }),
  ],
});

const vimarEikonSockets = category("eikon-sockets", "Sockets", {
  products: [
    product({
      id: "vimar-eikon-schuko",
      sku: "VMR-EK-SCHUKO",
      name: "Eikon Schuko Socket",
      description: "German-standard Schuko socket in the Eikon Evo collection.",
      price: 21.3,
      featured: true,
      tags: ["Eikon", "Schuko", "Socket"],
    }),
  ],
});

const vimarEikon = category("eikon", "Eikon Evo Series", {
  children: [vimarEikonFrames, vimarEikonSockets],
});

const vimarSmartHome = category("smart-home", "Smart Home", {
  children: [
    category("smart-home-view", "View Wireless", {
      products: [
        product({
          id: "vimar-view-thermostat",
          sku: "VMR-VW-THERM",
          name: "View Wireless Thermostat",
          description: "Touch thermostat with color display and Bluetooth setup.",
          price: 129.0,
          featured: true,
          tags: ["Smart Home", "Thermostat", "Wireless"],
          specs: [
            { label: "Connectivity", value: "Bluetooth / RF" },
            { label: "Display", value: "2.4in Color TFT" },
            { label: "Power", value: "Battery (2x AAA)" },
            { label: "Warranty", value: "2 Years" },
          ],
        }),
      ],
    }),
    category("smart-home-byme", "By-me Plus", {
      products: [
        product({
          id: "vimar-byme-gateway",
          sku: "VMR-BYME-GW",
          name: "By-me Plus KNX Gateway",
          description: "Central gateway for By-me Plus home automation ecosystem.",
          price: 310.0,
          tags: ["Smart Home", "KNX", "Gateway"],
        }),
      ],
    }),
  ],
});

// ---------------------------------------------------------------------------
// ABB
// ---------------------------------------------------------------------------

const abbBuschJaegerSockets = category("bj-sockets", "Sockets", {
  image: "/images/abb/switch-ranges/future-linear.jpg",
  products: [
    product({
      id: "abb-bj-socket-schuko",
      sku: "ABB-BJ-SCH01",
      name: "Busch-Jaeger Schuko Socket",
      description: "Robust Schuko socket from the Busch-Jaeger future linear range.",
      price: 19.9,
      featured: true,
      image: "/images/abb/switch-ranges/future-linear.jpg",
      tags: ["Busch-Jaeger", "Socket", "Schuko"],
    }),
  ],
});

const abbBuschJaegerSwitches = category("bj-switches", "Switches", {
  image: "/images/abb/switch-ranges/axcent.jpg",
  products: [
    product({
      id: "abb-bj-switch-rocker",
      sku: "ABB-BJ-SW02",
      name: "Busch-Jaeger Rocker Switch",
      description: "Two-way rocker switch with anti-fingerprint coated surface.",
      price: 16.4,
      image: "/images/abb/switch-ranges/axcent.jpg",
      tags: ["Busch-Jaeger", "Switch"],
    }),
  ],
});

const abbSwitchRanges = category("bj-switch-ranges", "Switch Ranges", {
  image: "/images/abb/switch-ranges/impressivo.jpg",
  products: [
    product({
      id: "abb-range-future-linear",
      sku: "ABB-RNG-FUTLIN",
      name: "future linear",
      description: "Minimalist flush design line with a slender flat frame, a Busch-Jaeger signature range.",
      price: 24.9,
      featured: true,
      image: "/images/abb/switch-ranges/future-linear.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Minimalist"],
    }),
    product({
      id: "abb-range-axcent",
      sku: "ABB-RNG-AXCENT",
      name: "axcent",
      description: "Bold, sculpted switch range with a distinctive angled profile.",
      price: 27.5,
      image: "/images/abb/switch-ranges/axcent.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Design"],
    }),
    product({
      id: "abb-range-impressivo",
      sku: "ABB-RNG-IMPRESSIVO",
      name: "impressivo",
      description: "Premium glass-front switch range for a refined, high-end interior finish.",
      price: 45.0,
      featured: true,
      image: "/images/abb/switch-ranges/impressivo.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Glass"],
    }),
    product({
      id: "abb-range-ivie",
      sku: "ABB-RNG-IVIE",
      name: "ivie",
      description: "Warm, rounded switch range designed for a soft, contemporary look.",
      price: 22.3,
      image: "/images/abb/switch-ranges/ivie.jpg",
      tags: ["Switch Range", "Busch-Jaeger"],
    }),
    product({
      id: "abb-range-millenium",
      sku: "ABB-RNG-MILLENIUM",
      name: "millenium",
      description: "Classic square-edged switch range, a long-standing Busch-Jaeger bestseller.",
      price: 18.9,
      image: "/images/abb/switch-ranges/millenium.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Classic"],
    }),
    product({
      id: "abb-range-pure-stainless",
      sku: "ABB-RNG-PURESTL",
      name: "pure stainless steel",
      description: "Brushed stainless steel switch range for an industrial, tactile finish.",
      price: 38.6,
      image: "/images/abb/switch-ranges/pure-stainless.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Stainless Steel"],
    }),
    product({
      id: "abb-range-sky-niessen",
      sku: "ABB-RNG-SKYNIE",
      name: "Sky Niessen",
      description: "Slim-profile Niessen range combining Spanish design with ABB engineering.",
      price: 26.1,
      image: "/images/abb/switch-ranges/sky-niessen.jpg",
      tags: ["Switch Range", "Niessen"],
    }),
    product({
      id: "abb-range-solo",
      sku: "ABB-RNG-SOLO",
      name: "solo",
      description: "Compact, understated switch range built for everyday reliability.",
      price: 15.4,
      image: "/images/abb/switch-ranges/solo.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Compact"],
    }),
    product({
      id: "abb-range-swing-l",
      sku: "ABB-RNG-SWINGL",
      name: "swing L",
      description: "Curved large-format rocker range for a soft architectural statement.",
      price: 29.8,
      image: "/images/abb/switch-ranges/swing-l.jpg",
      tags: ["Switch Range", "Busch-Jaeger"],
    }),
    product({
      id: "abb-range-zenit",
      sku: "ABB-RNG-ZENIT",
      name: "Zenit",
      description: "VDE-standard Niessen range with a clean, versatile frame system.",
      price: 20.7,
      image: "/images/abb/switch-ranges/zenit-vde.jpg",
      tags: ["Switch Range", "Niessen", "VDE"],
    }),
    product({
      id: "abb-range-arco-blanco",
      sku: "ABB-RNG-ARCOBLANCO",
      name: "Arco Blanco",
      description: "Rounded white-finish range from the Niessen Arco collection.",
      price: 17.2,
      image: "/images/abb/switch-ranges/arco-blanco.jpg",
      tags: ["Switch Range", "Niessen", "White"],
    }),
    product({
      id: "abb-range-busch-art",
      sku: "ABB-RNG-BUSCHART",
      name: "Busch-art linear",
      description: "Design-driven linear range aimed at architects and high-end residential projects.",
      price: 52.3,
      image: "/images/abb/switch-ranges/busch-art-linear.jpg",
      tags: ["Switch Range", "Busch-Jaeger", "Premium"],
    }),
    product({
      id: "abb-range-status-vino",
      sku: "ABB-RNG-STATUSVINO",
      name: "Status Vino",
      description: "Rich wine-toned finish from the Status range for a distinctive accent.",
      price: 23.4,
      image: "/images/abb/switch-ranges/status-vino.jpg",
      tags: ["Switch Range", "Niessen"],
    }),
    product({
      id: "abb-range-framia",
      sku: "ABB-RNG-FRAMIA",
      name: "Framia",
      description: "Modular frame system that adapts across multiple Busch-Jaeger switch ranges.",
      price: 12.8,
      image: "/images/abb/switch-ranges/framia.png",
      tags: ["Switch Range", "Frame System"],
    }),
  ],
});

const abbBuschJaeger = category("busch-jaeger", "Busch-Jaeger Series", {
  image: "/images/abb/switch-ranges/impressivo.jpg",
  children: [abbBuschJaegerSockets, abbBuschJaegerSwitches, abbSwitchRanges],
});

const abbCircuitBreakersMcb = category("mcb", "Miniature Circuit Breakers", {
  image: "/images/abb/din-rail/mcb.png",
  products: [
    product({
      id: "abb-mcb-s200-c16",
      sku: "ABB-S200-C16",
      name: "System pro M compact S200 C16",
      description: "Single-pole miniature circuit breaker, C-curve, 16A, 6kA.",
      price: 12.6,
      featured: true,
      image: "/images/abb/din-rail/mcb.png",
      tags: ["Circuit Breaker", "MCB", "16A"],
      specs: [
        { label: "Poles", value: "1P" },
        { label: "Curve", value: "C" },
        { label: "Rated Current", value: "16A" },
        { label: "Breaking Capacity", value: "6kA" },
      ],
    }),
    product({
      id: "abb-mcb-s200-c32",
      sku: "ABB-S200-C32",
      name: "System pro M compact S200 C32",
      description: "Single-pole miniature circuit breaker, C-curve, 32A, 6kA.",
      price: 14.1,
      image: "/images/abb/din-rail/s301c.png",
      tags: ["Circuit Breaker", "MCB", "32A"],
    }),
    product({
      id: "abb-s750",
      sku: "ABB-S750",
      name: "System pro M compact S750",
      description: "Selective main circuit breaker for upstream protection of MCB installations.",
      price: 89.0,
      image: "/images/abb/din-rail/s750.png",
      tags: ["Circuit Breaker", "Selective", "Main"],
    }),
    product({
      id: "abb-s800",
      sku: "ABB-S800",
      name: "System pro E compact S800",
      description: "High breaking capacity molded-case style DIN-rail circuit breaker.",
      price: 132.0,
      featured: true,
      image: "/images/abb/din-rail/s800.png",
      tags: ["Circuit Breaker", "High Capacity"],
    }),
  ],
});

const abbCircuitBreakersRcd = category("rcd", "Residual Current Devices", {
  image: "/images/abb/din-rail/eovr.png",
  products: [
    product({
      id: "abb-rcd-f200-40a",
      sku: "ABB-F200-40A",
      name: "System pro M compact F200 RCD 40A",
      description: "4-pole residual current device, 30mA sensitivity, type A.",
      price: 58.0,
      tags: ["RCD", "Protection", "40A"],
    }),
    product({
      id: "abb-ds-arc",
      sku: "ABB-DS-ARC",
      name: "ds-arc Arc Fault Detection Device",
      description: "AFDD combining arc-fault, overcurrent, and residual current protection in one module.",
      price: 76.5,
      featured: true,
      image: "/images/abb/din-rail/ds-arc.png",
      tags: ["AFDD", "Arc Fault", "Protection"],
    }),
    product({
      id: "abb-eovr",
      sku: "ABB-EOVR",
      name: "eOVR Surge Protection Device",
      description: "Type 2 surge protection device safeguarding sensitive downstream electronics.",
      price: 64.0,
      image: "/images/abb/din-rail/eovr.png",
      tags: ["Surge Protection", "SPD"],
    }),
  ],
});

const abbDinRailSystems = category("din-rail-systems", "DIN-Rail Systems", {
  image: "/images/abb/din-rail/proline.png",
  products: [
    product({
      id: "abb-proline",
      sku: "ABB-PROLINE",
      name: "ProLine Modular Enclosure System",
      description: "Modular DIN-rail enclosure system for compact residential installations.",
      price: 145.0,
      image: "/images/abb/din-rail/proline.png",
      tags: ["Enclosure", "DIN-Rail", "Modular"],
    }),
    product({
      id: "abb-flexline",
      sku: "ABB-FLEXLINE",
      name: "FlexLine Distribution System",
      description: "Flexible combination board system for commercial distribution boards.",
      price: 210.0,
      image: "/images/abb/din-rail/flexline.png",
      tags: ["Enclosure", "DIN-Rail", "Distribution"],
    }),
    product({
      id: "abb-smissline-tp",
      sku: "ABB-SMISSLINE-TP",
      name: "SMISSLINE TP Modular System",
      description: "Touch-proof, tool-free modular switchgear system for fast installation.",
      price: 168.0,
      image: "/images/abb/din-rail/smissline-tp.jpg",
      tags: ["Modular System", "Touch-Proof"],
    }),
    product({
      id: "abb-fuses",
      sku: "ABB-FUSES",
      name: "Fuses & Protection Devices Set",
      description: "Assortment of DIN-rail fuse holders and supplementary protection devices.",
      price: 33.0,
      image: "/images/abb/din-rail/fuses.png",
      tags: ["Fuses", "Protection"],
    }),
    product({
      id: "abb-din-accessories",
      sku: "ABB-DIN-ACC",
      name: "DIN-Rail Accessories Kit",
      description: "Terminal blocks, end caps, and mounting accessories for DIN-rail assemblies.",
      price: 19.5,
      image: "/images/abb/din-rail/accessories.png",
      tags: ["Accessories", "DIN-Rail"],
    }),
  ],
});

const abbCircuitProtection = category("circuit-protection", "Circuit Protection", {
  image: "/images/abb/din-rail/mcb.png",
  children: [abbCircuitBreakersMcb, abbCircuitBreakersRcd, abbDinRailSystems],
});

const abbAutomation = category("automation", "Building Automation", {
  children: [
    category("automation-freehome", "free@home", {
      products: [
        product({
          id: "abb-freehome-hub",
          sku: "ABB-FAH-HUB",
          name: "free@home System Access Point",
          description: "Central hub connecting free@home smart devices to the app.",
          price: 245.0,
          featured: true,
          tags: ["Automation", "free@home", "Hub"],
        }),
      ],
    }),
    category("automation-knx", "KNX", {
      products: [
        product({
          id: "abb-knx-actuator",
          sku: "ABB-KNX-ACT8",
          name: "KNX Switch Actuator 8-Fold",
          description: "8-channel KNX switching actuator for DIN rail mounting.",
          price: 189.5,
          tags: ["Automation", "KNX", "Actuator"],
        }),
      ],
    }),
  ],
});

const abbEnclosures = category("enclosures", "Enclosures & Distribution Boards", {
  image: "/images/abb/enclosures/main-distribution-board.jpg",
  products: [
    product({
      id: "abb-main-distribution-board",
      sku: "ABB-MDB-01",
      name: "Main Distribution Board",
      description: "Floor-standing main distribution board for primary building power distribution.",
      price: 890.0,
      featured: true,
      image: "/images/abb/enclosures/main-distribution-board.jpg",
      tags: ["Enclosure", "Distribution Board", "Main"],
      specs: [
        { label: "Mounting", value: "Floor-Standing" },
        { label: "Protection", value: "IP54" },
        { label: "Material", value: "Sheet Steel" },
        { label: "Warranty", value: "2 Years" },
      ],
    }),
    product({
      id: "abb-sub-distribution-board",
      sku: "ABB-SDB-01",
      name: "Sub Distribution Board",
      description: "Wall-mounted sub distribution board for floor-level circuit distribution.",
      price: 420.0,
      featured: true,
      image: "/images/abb/enclosures/sub-distribution-board.jpg",
      tags: ["Enclosure", "Distribution Board", "Sub"],
    }),
    product({
      id: "abb-sen-plus",
      sku: "ABB-SENPLUS",
      name: "SEN Plus Enclosure",
      description: "Compact surface-mounted enclosure for residential and light commercial use.",
      price: 165.0,
      image: "/images/abb/enclosures/sen-plus.png",
      tags: ["Enclosure", "Compact", "Residential"],
    }),
    product({
      id: "abb-lighting-panel",
      sku: "ABB-LPANEL",
      name: "Lighting Distribution Panel",
      description: "Dedicated lighting circuit distribution panel with hinged front access.",
      price: 310.0,
      image: "/images/abb/enclosures/lighting-panel.jpg",
      tags: ["Enclosure", "Lighting", "Panel"],
    }),
  ],
});

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export const brands: Brand[] = [
  {
    id: "vimar",
    name: "Vimar",
    logoText: "VIMAR",
    tagline: "Italian Design Electrical Solutions",
    accentColor: "#c9a227",
    categories: [vimarPlana, vimarEikon, vimarSmartHome],
  },
  {
    id: "abb",
    name: "ABB",
    logoText: "ABB",
    tagline: "Engineering the Future",
    accentColor: "#ff0000",
    categories: [abbBuschJaeger, abbCircuitProtection, abbAutomation, abbEnclosures],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCategoryByPath(categories: Category[], path: string[]): Category | null {
  let level = categories;
  let found: Category | null = null;

  for (const id of path) {
    found = level.find((c) => c.id === id) ?? null;
    if (!found) return null;
    level = found.children;
  }

  return found;
}

export function getAllProducts(brand: Brand): Product[] {
  const products: Product[] = [];

  const walk = (categories: Category[]) => {
    for (const cat of categories) {
      products.push(...cat.products);
      if (cat.children.length) walk(cat.children);
    }
  };

  walk(brand.categories);
  return products;
}
