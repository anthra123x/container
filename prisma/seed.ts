import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: "container" },
    update: {},
    create: {
      name: "Container",
      slug: "container",
      isActive: true,
    },
  });

  const adminEmail = "admin@container.com";
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      storeId: store.id,
      name: "Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
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

  const laptopCategory = await prisma.category.upsert({
    where: { slug: "laptops" },
    update: {},
    create: {
      name: "Laptops",
      slug: "laptops",
      description: "Laptops y notebooks de las mejores marcas",
      sortOrder: 1,
      isActive: true,
    },
  });

  const audioCategory = await prisma.category.upsert({
    where: { slug: "audio" },
    update: {},
    create: {
      name: "Audio",
      slug: "audio",
      description: "Audífonos, parlantes y equipos de sonido",
      sortOrder: 2,
      isActive: true,
    },
  });

  const accCategory = await prisma.category.upsert({
    where: { slug: "accesorios" },
    update: {},
    create: {
      name: "Accesorios",
      slug: "accesorios",
      description: "Cables, cargadores y más",
      sortOrder: 3,
      isActive: true,
    },
  });

  const monitorsCategory = await prisma.category.upsert({
    where: { slug: "monitores" },
    update: {},
    create: {
      name: "Monitores",
      slug: "monitores",
      description: "Monitores y pantallas",
      sortOrder: 4,
      isActive: true,
    },
  });

  const brandLenovo = await prisma.brand.upsert({
    where: { slug: "lenovo" },
    update: {},
    create: { name: "Lenovo", slug: "lenovo", isActive: true },
  });

  const brandSony = await prisma.brand.upsert({
    where: { slug: "sony" },
    update: {},
    create: { name: "Sony", slug: "sony", isActive: true },
  });

  const brandSamsung = await prisma.brand.upsert({
    where: { slug: "samsung" },
    update: {},
    create: { name: "Samsung", slug: "samsung", isActive: true },
  });

  const brandApple = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: { name: "Apple", slug: "apple", isActive: true },
  });

  const product1 = await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "thinkpad-x1-carbon" } },
    update: {},
    create: {
      storeId: store.id,
      name: "Lenovo ThinkPad X1 Carbon Gen 12",
      slug: "thinkpad-x1-carbon",
      description: "La laptop empresarial más ligera y potente. Procesador Intel Core Ultra 7, 16GB RAM, 512GB SSD, pantalla 14\" 2.8K OLED.",
      shortDescription: "Ultrabook empresarial con Intel Core Ultra 7",
      categoryId: laptopCategory.id,
      brandId: brandLenovo.id,
      price: 5499,
      comparePrice: 6499,
      stock: 15,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: "pi-thinkpad-1" },
    update: {},
    create: {
      id: "pi-thinkpad-1",
      productId: product1.id,
      url: "https://picsum.photos/seed/thinkpad/800/800",
      alt: "Lenovo ThinkPad X1 Carbon",
      isPrimary: true,
      sortOrder: 0,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "macbook-air-m3" } },
    update: {},
    create: {
      storeId: store.id,
      name: 'Apple MacBook Air M3 15"',
      slug: "macbook-air-m3",
      description: 'MacBook Air con chip M3, 16GB RAM unificada, 256GB SSD, pantalla Liquid Retina 15.3", batería hasta 18 horas.',
      shortDescription: "Potencia y portabilidad con chip M3",
      categoryId: laptopCategory.id,
      brandId: brandApple.id,
      price: 7999,
      comparePrice: 8999,
      stock: 8,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: "pi-macbook-1" },
    update: {},
    create: {
      id: "pi-macbook-1",
      productId: product2.id,
      url: "https://picsum.photos/seed/macbook/800/800",
      alt: "MacBook Air M3",
      isPrimary: true,
      sortOrder: 0,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "wh-1000xm5" } },
    update: {},
    create: {
      storeId: store.id,
      name: "Sony WH-1000XM5",
      slug: "wh-1000xm5",
      description: "Audífonos inalámbricos con cancelación de ruido líder en la industria. 30 horas de batería, carga rápida USB-C, códec LDAC.",
      shortDescription: "Cancelación de ruido premium",
      categoryId: audioCategory.id,
      brandId: brandSony.id,
      price: 1299,
      comparePrice: 1599,
      stock: 25,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: "pi-sony-1" },
    update: {},
    create: {
      id: "pi-sony-1",
      productId: product3.id,
      url: "https://picsum.photos/seed/sony/800/800",
      alt: "Sony WH-1000XM5",
      isPrimary: true,
      sortOrder: 0,
    },
  });

  const product4 = await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "samsung-odyssey-g7" } },
    update: {},
    create: {
      storeId: store.id,
      name: 'Samsung Odyssey G7 32"',
      slug: "samsung-odyssey-g7",
      description: 'Monitor curvo 32" 4K UHD, 144Hz, 1ms, FreeSync Premium Pro, HDR600. Ideal para gaming y productividad.',
      shortDescription: "Monitor curvo 4K 144Hz para gaming",
      categoryId: monitorsCategory.id,
      brandId: brandSamsung.id,
      price: 3299,
      comparePrice: 3999,
      stock: 10,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.productImage.upsert({
    where: { id: "pi-odyssey-1" },
    update: {},
    create: {
      id: "pi-odyssey-1",
      productId: product4.id,
      url: "https://picsum.photos/seed/monitor/800/800",
      alt: "Samsung Odyssey G7",
      isPrimary: true,
      sortOrder: 0,
    },
  });

  console.log("Seed completed successfully");
  console.log(`  Store: ${store.name} (${store.id})`);
  console.log(`  Admin: ${admin.email} / admin123`);
  console.log(`  Categories: 4 creadas`);
  console.log(`  Brands: 4 creadas`);
  console.log(`  Products: 4 creados (destacados)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
