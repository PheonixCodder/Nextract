"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }

  const existingCredential = await prisma.credential.findUnique({
  where: {
    name_userId: {
      name: data.name,
      userId: userId,
    },
  },
});


  if (existingCredential) {
    throw new Error(
      "A credential with this name already exists for your account"
    );
  }

  const encryptedValue = await symmetricEncrypt(data.value);
  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }

  revalidatePath("/credentials");
}
