-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "videoRoomId" TEXT,
ADD COLUMN     "videoRoomToken" TEXT;

-- AlterTable
ALTER TABLE "DeveloperProfile" ADD COLUMN     "walletAddress" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "network" TEXT,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "currency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletAddress" TEXT;
