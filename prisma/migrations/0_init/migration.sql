-- CreateTable
CREATE TABLE "Users" (
    "id" BIGINT NOT NULL,
    "name" CHAR[],
    "email" CHAR[],
    "password" CHAR[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id","email")
);

