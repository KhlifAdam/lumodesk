-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "last_message_at" TIMESTAMP(3),
    "last_message_preview" TEXT,
    "last_sender_id" TEXT,
    "photographer_unread" INTEGER NOT NULL DEFAULT 0,
    "client_unread" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversations_photographer_id_last_message_at_idx" ON "conversations"("photographer_id", "last_message_at");

-- CreateIndex
CREATE INDEX "conversations_client_id_last_message_at_idx" ON "conversations"("client_id", "last_message_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_photographer_id_client_id_key" ON "conversations"("photographer_id", "client_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_id_idx" ON "messages"("conversation_id", "created_at", "id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
