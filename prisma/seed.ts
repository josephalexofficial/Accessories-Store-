import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCT_SEED } from "./product-seed-data";

const prisma = new PrismaClient();

async function seedAdmin() {
  const adminEmail = "whimseytech@gmail.com";
  const hashedPassword = await bcrypt.hash("Whimsey@123", 12);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log("✅ Admin account seeded.");
  } else {
    console.log("ℹ️ Admin account already exists.");
  }
}

async function seedProducts() {
  let created = 0;
  let updated = 0;

  for (const product of PRODUCT_SEED) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        title: product.title,
        brand: product.brand,
        slug: product.slug,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice ?? null,
        isSale: product.isSale ?? false,
        stockStatus: product.stockStatus ?? "IN_STOCK",
        imageUrl: product.imageUrl,
        specType: product.specType ?? "KEY_VALUE",
        specifications: product.specifications,
        popularity: product.popularity ?? 0,
      },
      update: {
        title: product.title,
        brand: product.brand,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice ?? null,
        isSale: product.isSale ?? false,
        stockStatus: product.stockStatus ?? "IN_STOCK",
        imageUrl: product.imageUrl,
        specType: product.specType ?? "KEY_VALUE",
        specifications: product.specifications,
        popularity: product.popularity ?? 0,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(
    `✅ Products seeded: ${PRODUCT_SEED.length} total (${created} new, ${updated} updated).`
  );
}

async function main() {
  await seedAdmin();
  await seedProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
