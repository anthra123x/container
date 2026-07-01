import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

interface BrandDef { name: string; slug: string }
interface CategoryDef { name: string; slug: string; description: string; sortOrder: number }
interface ProductDef {
  name: string; slug: string; description: string; shortDescription: string;
  categorySlug: string; brandSlug: string;
  price: number; comparePrice: number | null;
  stock: number; isFeatured: boolean;
}

const brands: BrandDef[] = [
  { name: "Lenovo", slug: "lenovo" },
  { name: "Sony", slug: "sony" },
  { name: "Samsung", slug: "samsung" },
  { name: "Apple", slug: "apple" },
  { name: "LG", slug: "lg" },
  { name: "Harman Kardon", slug: "harman-kardon" },
  { name: "JBL", slug: "jbl" },
  { name: "Logitech", slug: "logitech" },
  { name: "Kingston", slug: "kingston" },
  { name: "HP", slug: "hp" },
];

const categories: CategoryDef[] = [
  { name: "Laptops", slug: "laptops", description: "Laptops y notebooks de las mejores marcas", sortOrder: 1 },
  { name: "Audio", slug: "audio", description: "Audífonos, parlantes y equipos de sonido", sortOrder: 2 },
  { name: "Accesorios", slug: "accesorios", description: "Cables, cargadores, teclados y más", sortOrder: 3 },
  { name: "Monitores", slug: "monitores", description: "Monitores y pantallas", sortOrder: 4 },
  { name: "Almacenamiento", slug: "almacenamiento", description: "Discos duros, SSD y memorias USB", sortOrder: 5 },
  { name: "Periféricos", slug: "perifericos", description: "Teclados, mouse y accesorios de computador", sortOrder: 6 },
];

const products: ProductDef[] = [
  // Laptops
  { name: "Lenovo ThinkPad X1 Carbon Gen 12", slug: "thinkpad-x1-carbon",
    description: "La laptop empresarial más ligera y potente. Procesador Intel Core Ultra 7, 16GB RAM, 512GB SSD, pantalla 14\" 2.8K OLED.",
    shortDescription: "Ultrabook empresarial con Intel Core Ultra 7",
    categorySlug: "laptops", brandSlug: "lenovo",
    price: 5499000, comparePrice: 6499000, stock: 15, isFeatured: true },
  { name: 'Apple MacBook Air M3 15"', slug: "macbook-air-m3",
    description: 'MacBook Air con chip M3, 16GB RAM unificada, 256GB SSD, pantalla Liquid Retina 15.3", batería hasta 18 horas.',
    shortDescription: "Potencia y portabilidad con chip M3",
    categorySlug: "laptops", brandSlug: "apple",
    price: 7999000, comparePrice: 8999000, stock: 8, isFeatured: true },
  { name: "Samsung Galaxy Book 4 Pro", slug: "galaxy-book-4-pro",
    description: "Laptop premium con Intel Core Ultra 7, 16GB RAM, 512GB SSD, pantalla AMOLED 16\" 3K, peso 1.56kg.",
    shortDescription: "Ultrabook con pantalla AMOLED 3K",
    categorySlug: "laptops", brandSlug: "samsung",
    price: 6299000, comparePrice: null, stock: 10, isFeatured: true },
  { name: "HP Spectre x360 16", slug: "hp-spectre-x360",
    description: "Convertible 2-en-1 con Intel Core Ultra 7, 16GB RAM, 1TB SSD, pantalla táctil OLED 16\" 4K, lápiz incluido.",
    shortDescription: "Convertible premium con pantalla OLED 4K",
    categorySlug: "laptops", brandSlug: "hp",
    price: 7299000, comparePrice: 8299000, stock: 5, isFeatured: false },
  { name: "Lenovo ThinkPad T14s Gen 5", slug: "thinkpad-t14s-gen5",
    description: "Laptop empresarial con AMD Ryzen 7 PRO, 32GB RAM, 512GB SSD, pantalla 14\" WUXGA, certificación MIL-STD-810H.",
    shortDescription: "Laptop empresarial AMD Ryzen 7 PRO",
    categorySlug: "laptops", brandSlug: "lenovo",
    price: 5899000, comparePrice: null, stock: 12, isFeatured: false },
  { name: 'Apple MacBook Pro 14" M3 Pro', slug: "macbook-pro-m3",
    description: 'MacBook Pro con chip M3 Pro (11 núcleos CPU, 14 GPU), 18GB RAM unificada, 512GB SSD, pantalla Liquid Retina XDR 14.2".',
    shortDescription: "Rendimiento profesional con chip M3 Pro",
    categorySlug: "laptops", brandSlug: "apple",
    price: 12499000, comparePrice: 13999000, stock: 6, isFeatured: true },
  { name: "LG Gram 16", slug: "lg-gram-16",
    description: "Ultrabook ultraligero de solo 1.19kg con Intel Core Ultra 7, 16GB RAM, 512GB SSD, pantalla 16\" WQXGA, batería 80Wh.",
    shortDescription: "El ultrabook más ligero del mercado",
    categorySlug: "laptops", brandSlug: "lg",
    price: 6799000, comparePrice: null, stock: 7, isFeatured: false },

  // Audio
  { name: "Sony WH-1000XM5", slug: "wh-1000xm5",
    description: "Audífonos inalámbricos con cancelación de ruido líder en la industria. 30 horas de batería, carga rápida USB-C, códec LDAC.",
    shortDescription: "Cancelación de ruido premium",
    categorySlug: "audio", brandSlug: "sony",
    price: 1299000, comparePrice: 1599000, stock: 25, isFeatured: true },
  { name: "Apple AirPods Pro 2", slug: "airpods-pro-2",
    description: "Audífonos inalámbricos con chip H2, cancelación de ruido activa 2x más efectiva, audio adaptativo, USB-C.",
    shortDescription: "La mejor experiencia de audio Apple",
    categorySlug: "audio", brandSlug: "apple",
    price: 1099000, comparePrice: 1299000, stock: 30, isFeatured: true },
  { name: "Samsung Galaxy Buds 3 Pro", slug: "galaxy-buds-3-pro",
    description: "Audífonos in-ear con inteligencia Galaxy AI, cancelación de ruido adaptativa, sonido 360°, resistencia IP57.",
    shortDescription: "Audio inteligente con Galaxy AI",
    categorySlug: "audio", brandSlug: "samsung",
    price: 899000, comparePrice: 1099000, stock: 20, isFeatured: false },
  { name: "Sony SRS-XB100", slug: "sony-srs-xb100",
    description: "Parlante Bluetooth portátil con sonido potente y graves profundos. Resistente al agua IP67, 16 horas de batería.",
    shortDescription: "Parlante Bluetooth portátil resistente",
    categorySlug: "audio", brandSlug: "sony",
    price: 249000, comparePrice: 299000, stock: 40, isFeatured: false },
  { name: "JBL Charge 5", slug: "jbl-charge-5",
    description: "Parlante Bluetooth portátil con sonido envolvente, graves potentes, resistencia IP67, 20 horas de batería y carga USB.",
    shortDescription: "Sonido potente con 20h de batería",
    categorySlug: "audio", brandSlug: "jbl",
    price: 549000, comparePrice: 649000, stock: 35, isFeatured: true },
  { name: "Harman Kardon Onyx Studio 8", slug: "harman-onyx-studio-8",
    description: "Parlante Bluetooth premium con sonido envolvente 360°, diseño elegante, 8 horas de batería, micrófono incorporado.",
    shortDescription: "Parlante Bluetooth premium 360°",
    categorySlug: "audio", brandSlug: "harman-kardon",
    price: 849000, comparePrice: 999000, stock: 15, isFeatured: false },

  // Accesorios
  { name: "Apple MagSafe Charger", slug: "apple-magsafe-charger",
    description: "Cargador inalámbrico magnético Apple MagSafe de 15W para iPhone. Carga rápida y segura con alineación perfecta.",
    shortDescription: "Carga inalámbrica magnética 15W",
    categorySlug: "accesorios", brandSlug: "apple",
    price: 249000, comparePrice: 299000, stock: 50, isFeatured: false },
  { name: "Samsung 45W Super Fast Charger", slug: "samsung-45w-charger",
    description: "Cargador USB-C Samsung 45W con tecnología Super Fast Charging 2.0. Compatible con Galaxy S24, Note, y más.",
    shortDescription: "Carga súper rápida 45W USB-C",
    categorySlug: "accesorios", brandSlug: "samsung",
    price: 149000, comparePrice: 179000, stock: 60, isFeatured: false },
  { name: "Logitech MX Keys S", slug: "logitech-mx-keys-s",
    description: "Teclado inalámbrico premium con retroiluminación inteligente, teclas perfectas, conexión multi-dispositivo hasta 3 equipos.",
    shortDescription: "Teclado inalámbrico premium retroiluminado",
    categorySlug: "accesorios", brandSlug: "logitech",
    price: 449000, comparePrice: 529000, stock: 20, isFeatured: true },
  { name: "Cable USB-C a USB-C 2m", slug: "cable-usbc-2m",
    description: "Cable USB-C a USB-C de 2 metros con carga rápida de 100W Power Delivery y transferencia de datos USB 3.2 Gen 2.",
    shortDescription: "Cable USB-C 100W PD 2 metros",
    categorySlug: "accesorios", brandSlug: "sony",
    price: 59000, comparePrice: null, stock: 100, isFeatured: false },
  { name: "Hub USB-C 7 en 1", slug: "hub-usbc-7en1",
    description: "Hub multipuerto USB-C con HDMI 4K, 3x USB-A 3.0, lector SD/microSD, USB-C PD 100W. Compatible universal.",
    shortDescription: "Hub multipuerto con HDMI 4K",
    categorySlug: "accesorios", brandSlug: "kingston",
    price: 189000, comparePrice: 229000, stock: 30, isFeatured: false },

  // Monitores
  { name: 'Samsung Odyssey G7 32"', slug: "samsung-odyssey-g7",
    description: 'Monitor curvo 32" 4K UHD, 144Hz, 1ms, FreeSync Premium Pro, HDR600. Ideal para gaming y productividad.',
    shortDescription: "Monitor curvo 4K 144Hz para gaming",
    categorySlug: "monitores", brandSlug: "samsung",
    price: 3299000, comparePrice: 3999000, stock: 10, isFeatured: true },
  { name: 'LG UltraGear 27" 240Hz', slug: "lg-ultragear-27",
    description: 'Monitor gaming 27" QHD, 240Hz, 1ms, Nano IPS, G-Sync Compatible, HDR10. El monitor definitivo para competitivo.',
    shortDescription: "Monitor gaming 240Hz Nano IPS",
    categorySlug: "monitores", brandSlug: "lg",
    price: 2499000, comparePrice: 2999000, stock: 12, isFeatured: true },
  { name: 'Samsung Smart Monitor M8 32"', slug: "samsung-smart-m8",
    description: 'Monitor inteligente 32" 4K UHD con Smart TV integrado, USB-C 65W, cámara magnética, WiFi. Sin PC necesario.',
    shortDescription: "Monitor inteligente 4K con Smart TV",
    categorySlug: "monitores", brandSlug: "samsung",
    price: 2799000, comparePrice: null, stock: 8, isFeatured: false },
  { name: "LG 27\" 4K IPS USB-C", slug: "lg-27-4k-ips-usbc",
    description: "Monitor 27\" 4K UHD IPS con USB-C 90W PD, ajuste de altura, altavoces integrados, HDR10. Ideal para productividad.",
    shortDescription: "Monitor 4K IPS con USB-C 90W",
    categorySlug: "monitores", brandSlug: "lg",
    price: 1999000, comparePrice: 2299000, stock: 15, isFeatured: false },

  // Almacenamiento
  { name: "Kingston KC3000 1TB", slug: "kingston-kc3000-1tb",
    description: "SSD NVMe PCIe 4.0 de 1TB con velocidades de lectura 7000MB/s y escritura 7000MB/s. Ideal para gaming y estaciones de trabajo.",
    shortDescription: "SSD NVMe PCIe 4.0 de alto rendimiento",
    categorySlug: "almacenamiento", brandSlug: "kingston",
    price: 449000, comparePrice: 549000, stock: 25, isFeatured: true },
  { name: "Samsung T7 Shield 1TB", slug: "samsung-t7-shield",
    description: "Disco SSD externo portátil de 1TB USB 3.2, resistente al agua IP65 y caídas de 3m. Velocidad de lectura 1050MB/s.",
    shortDescription: "SSD externo portátil resistente 1TB",
    categorySlug: "almacenamiento", brandSlug: "samsung",
    price: 549000, comparePrice: 649000, stock: 18, isFeatured: false },
  { name: "Kingston DataTraveler 128GB", slug: "kingston-usb-128gb",
    description: "Memoria USB 3.2 de 128GB con velocidades de lectura 200MB/s. Diseño compacto con ojo para llavero.",
    shortDescription: "USB 3.2 de alta velocidad 128GB",
    categorySlug: "almacenamiento", brandSlug: "kingston",
    price: 69000, comparePrice: 89000, stock: 80, isFeatured: false },
  { name: "Samsung 990 Pro 2TB", slug: "samsung-990-pro-2tb",
    description: "SSD NVMe PCIe 4.0 de 2TB con velocidades de lectura 7450MB/s y escritura 6900MB/s. La cúspide del rendimiento.",
    shortDescription: "SSD NVMe flagship 2TB 7450MB/s",
    categorySlug: "almacenamiento", brandSlug: "samsung",
    price: 849000, comparePrice: 999000, stock: 10, isFeatured: true },

  // Periféricos
  { name: "Logitech MX Master 3S", slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico premium con sensor 8000 DPI, scroll electromagnético, botones programables, carga USB-C, 70 días de batería.",
    shortDescription: "Mouse inalámbrico premium ergonómico",
    categorySlug: "perifericos", brandSlug: "logitech",
    price: 399000, comparePrice: 479000, stock: 22, isFeatured: true },
  { name: "Logitech G Pro X Superlight", slug: "logitech-gpro-superlight",
    description: "Mouse inalámbrico gaming ultraligero de 63g con sensor HERO 25K, 5 botones programables, 70h de batería.",
    shortDescription: "Mouse gaming ultraligero Wireless",
    categorySlug: "perifericos", brandSlug: "logitech",
    price: 549000, comparePrice: 649000, stock: 15, isFeatured: true },
  { name: "Webcam Logitech C920 Pro", slug: "logitech-c920-pro",
    description: "Cámara web Full HD 1080p con micrófono estéreo integrado, corrección automática de luz, campo de visión 78°.",
    shortDescription: "Webcam Full HD con micrófono estéreo",
    categorySlug: "perifericos", brandSlug: "logitech",
    price: 249000, comparePrice: 299000, stock: 28, isFeatured: false },
  { name: "Apple Magic Keyboard Touch ID", slug: "apple-magic-keyboard",
    description: "Teclado inalámbrico Apple con Touch ID y teclado numérico, conexión Bluetooth, batería recargable USB-C.",
    shortDescription: "Teclado Apple con Touch ID",
    categorySlug: "perifericos", brandSlug: "apple",
    price: 699000, comparePrice: null, stock: 10, isFeatured: false },
  { name: "Samsung Galaxy Watch FE", slug: "samsung-galaxy-watch-fe",
    description: "Smartwatch Galaxy Watch FE con monitoreo de salud completo, GPS, pantalla Super AMOLED, resistencia IP68.",
    shortDescription: "Smartwatch con monitoreo de salud",
    categorySlug: "perifericos", brandSlug: "samsung",
    price: 799000, comparePrice: 999000, stock: 18, isFeatured: true },
];

const productImages: Record<string, { url: string; alt: string }> = {
  "thinkpad-x1-carbon": { url: "https://picsum.photos/seed/thinkpad/800/800", alt: "Lenovo ThinkPad X1 Carbon" },
  "macbook-air-m3": { url: "https://picsum.photos/seed/macbook/800/800", alt: "MacBook Air M3" },
  "galaxy-book-4-pro": { url: "https://picsum.photos/seed/galaxybook/800/800", alt: "Samsung Galaxy Book 4 Pro" },
  "hp-spectre-x360": { url: "https://picsum.photos/seed/hpspectre/800/800", alt: "HP Spectre x360" },
  "thinkpad-t14s-gen5": { url: "https://picsum.photos/seed/thinkpadt14/800/800", alt: "Lenovo ThinkPad T14s Gen 5" },
  "macbook-pro-m3": { url: "https://picsum.photos/seed/macbookpro/800/800", alt: "MacBook Pro M3 Pro" },
  "lg-gram-16": { url: "https://picsum.photos/seed/lggram/800/800", alt: "LG Gram 16" },
  "wh-1000xm5": { url: "https://picsum.photos/seed/sonywh/800/800", alt: "Sony WH-1000XM5" },
  "airpods-pro-2": { url: "https://picsum.photos/seed/airpods/800/800", alt: "Apple AirPods Pro 2" },
  "galaxy-buds-3-pro": { url: "https://picsum.photos/seed/galaxybuds/800/800", alt: "Samsung Galaxy Buds 3 Pro" },
  "sony-srs-xb100": { url: "https://picsum.photos/seed/sonyxb/800/800", alt: "Sony SRS-XB100" },
  "jbl-charge-5": { url: "https://picsum.photos/seed/jblcharge/800/800", alt: "JBL Charge 5" },
  "harman-onyx-studio-8": { url: "https://picsum.photos/seed/harmanon/800/800", alt: "Harman Kardon Onyx Studio 8" },
  "apple-magsafe-charger": { url: "https://picsum.photos/seed/magsafe/800/800", alt: "Apple MagSafe Charger" },
  "samsung-45w-charger": { url: "https://picsum.photos/seed/45wcharger/800/800", alt: "Samsung 45W Charger" },
  "logitech-mx-keys-s": { url: "https://picsum.photos/seed/mxkeys/800/800", alt: "Logitech MX Keys S" },
  "cable-usbc-2m": { url: "https://picsum.photos/seed/usbcable/800/800", alt: "Cable USB-C 2m" },
  "hub-usbc-7en1": { url: "https://picsum.photos/seed/usbhub/800/800", alt: "Hub USB-C 7 en 1" },
  "samsung-odyssey-g7": { url: "https://picsum.photos/seed/odyssey/800/800", alt: "Samsung Odyssey G7" },
  "lg-ultragear-27": { url: "https://picsum.photos/seed/ultragear/800/800", alt: "LG UltraGear 27" },
  "samsung-smart-m8": { url: "https://picsum.photos/seed/smartm8/800/800", alt: "Samsung Smart Monitor M8" },
  "lg-27-4k-ips-usbc": { url: "https://picsum.photos/seed/lg4k/800/800", alt: "LG 27 4K IPS USB-C" },
  "kingston-kc3000-1tb": { url: "https://picsum.photos/seed/kc3000/800/800", alt: "Kingston KC3000 1TB" },
  "samsung-t7-shield": { url: "https://picsum.photos/seed/t7shield/800/800", alt: "Samsung T7 Shield 1TB" },
  "kingston-usb-128gb": { url: "https://picsum.photos/seed/datatraveler/800/800", alt: "Kingston DataTraveler 128GB" },
  "samsung-990-pro-2tb": { url: "https://picsum.photos/seed/990pro/800/800", alt: "Samsung 990 Pro 2TB" },
  "logitech-mx-master-3s": { url: "https://picsum.photos/seed/mxmaster/800/800", alt: "Logitech MX Master 3S" },
  "logitech-gpro-superlight": { url: "https://picsum.photos/seed/gpro/800/800", alt: "Logitech G Pro X Superlight" },
  "logitech-c920-pro": { url: "https://picsum.photos/seed/c920/800/800", alt: "Logitech C920 Pro" },
  "apple-magic-keyboard": { url: "https://picsum.photos/seed/magickey/800/800", alt: "Apple Magic Keyboard" },
  "samsung-galaxy-watch-fe": { url: "https://picsum.photos/seed/galaxywatch/800/800", alt: "Samsung Galaxy Watch FE" },
};

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: "container" },
    update: {},
    create: { name: "Container", slug: "container", isActive: true },
  });

  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@container.com" },
    update: {},
    create: {
      storeId: store.id, name: "Admin", email: "admin@container.com",
      passwordHash, role: "SUPER_ADMIN", isActive: true,
    },
  });

  await prisma.storeConfiguration.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      storeName: "Container",
      storeDescription: "Tu tienda de tecnología de confianza",
    },
  });

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat },
    });
    categoryMap[cat.slug] = record.id;
  }

  const brandMap: Record<string, string> = {};
  for (const brand of brands) {
    const record = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { ...brand, isActive: true },
    });
    brandMap[brand.slug] = record.id;
  }

  let productCount = 0;
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { storeId_slug: { storeId: store.id, slug: p.slug } },
      update: {
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isActive: true,
      },
      create: {
        storeId: store.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        categoryId: categoryMap[p.categorySlug],
        brandId: brandMap[p.brandSlug],
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isActive: true,
      },
    });
    productCount++;

    const img = productImages[p.slug];
    if (img) {
      const existing = await prisma.productImage.findFirst({ where: { productId: product.id } });
      if (!existing) {
        await prisma.productImage.create({
          data: { productId: product.id, url: img.url, alt: img.alt, isPrimary: true, sortOrder: 0 },
        });
      }
    }
  }

  console.log("Seed completed successfully");
  console.log(`  Store: ${store.name} (${store.id})`);
  console.log(`  Admin: admin@container.com / admin123`);
  console.log(`  Categories: ${categories.length} creadas`);
  console.log(`  Brands: ${brands.length} creadas`);
  console.log(`  Products: ${productCount} creados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
