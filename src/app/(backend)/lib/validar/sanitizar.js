// lib/validators.js
import { NextResponse } from "next/server";

// Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userRegex = /^[A-Za-z0-9._-]+$/;
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/u;
const numberRegex = /^\d+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// Caracteres peligrosos
const caracteresPeligrosos = /[\$\{\}\[\]]/g;

// --- helpers ---
export function encriptaCaracteresRaros(text) {
  if (typeof text !== "string") return text;
  const normalized = text.normalize("NFC");

  return normalized.replace(caracteresPeligrosos, (char) => {
    const code = char.codePointAt(0);
    const hex = code.toString(16);
    return `ENC[0x${hex}]`;
  });
}

export function desencriptaCaracteresRaros(text) {
  if (typeof text !== "string") return text;
  return text.replace(/ENC\[0x([0-9a-fA-F]+)\]/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

// --- Validaciones con NextResponse ---
export function validateEmail(email) {
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, error: "Formato de email no válido" },
      { status: 400 }
    );
  }
  return email;
}

export function validateContra(password) {
  if (!password || !passwordRegex.test(password)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
      },
      { status: 400 }
    );
  }
  return password;
}

export function validateUser(user) {
  if (!user || !userRegex.test(user)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Usuario inválido: solo letras, números, '.', '-', '_' y sin espacios.",
      },
      { status: 400 }
    );
  }
  return user;
}

export function validateName(name) {
  if (!name || !nameRegex.test(name)) {
    return NextResponse.json(
      { success: false, error: "Nombre inválido: no puede contener números ni símbolos." },
      { status: 400 }
    );
  }
  return name;
}

export function validateNumber(num) {
  if (!num || !numberRegex.test(num)) {
    return NextResponse.json(
      { success: false, error: "Este campo solo acepta números." },
      { status: 400 }
    );
  }
  return num;
}

export function validateText(text) {
  if (!text) {
    return NextResponse.json(
      { success: false, error: "El texto no puede estar vacío" },
      { status: 400 }
    );
  }
  return encriptaCaracteresRaros(text);
}
