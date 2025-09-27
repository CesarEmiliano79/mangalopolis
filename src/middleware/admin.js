import { NextResponse } from "next/server";

export default function adminMiddleware(req) {
  const rol = req.headers.get("x-user-role");

  if (rol !== "admin") {
    return NextResponse.json({ mensaje: "No autorizado" }, { status: 403 });
  }

  return null; // todo ok
}
