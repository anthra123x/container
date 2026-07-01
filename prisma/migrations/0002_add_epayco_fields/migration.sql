-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "epaycoRef" TEXT,
ADD COLUMN "paymentMethod" TEXT;

-- CreateIndex
CREATE INDEX "Order_epaycoRef_idx" ON "Order"("epaycoRef");
