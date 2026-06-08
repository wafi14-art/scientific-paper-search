import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getAuthErrorMessage } from "@/features/auth/errors";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthenticated." },
        { status: 401 }
      );
    }

    const email = user.email?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Authenticated user does not have an email address." },
        { status: 400 }
      );
    }

    const profile = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        email,
        name:
          typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : undefined,
      },
      create: {
        id: user.id,
        email,
        name:
          typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : null,
        role: "user",
      },
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
