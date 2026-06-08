import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { validateRegister } from "@/features/auth/validation";
import type { RegisterPayload } from "@/types/auth";

export async function POST(request: Request) {
  let payload: RegisterPayload;

  try {
    payload = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const validation = validateRegister(payload);

  if (!validation.isValid) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors: validation.fieldErrors },
      { status: 422 }
    );
  }

  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: getAuthErrorMessage(error) },
        { status: error.message.toLowerCase().includes("already") ? 409 : 400 }
      );
    }

    if (!data.user?.id || !data.user.email) {
      return NextResponse.json(
        { error: "Unable to create Supabase user." },
        { status: 502 }
      );
    }

    try {
      const profile = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email.toLowerCase(),
          name,
          role: "user",
        },
      });

      return NextResponse.json(
        {
          message: "Account created successfully. You can now sign in.",
          profile: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
          },
        },
        { status: 201 }
      );
    } catch (profileError) {
      await supabase.auth.admin.deleteUser(data.user.id);

      if (
        profileError instanceof Prisma.PrismaClientKnownRequestError &&
        profileError.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(profileError) },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
