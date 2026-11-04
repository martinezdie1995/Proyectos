"use server";

import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function submitInquiry(_previousState, formData) {
  const honeypot = formData.get("website");

  if (typeof honeypot !== "string" || honeypot.trim() !== "") {
    return { error: "No pudimos enviar la consulta. Revisá los datos." };
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string"
  ) {
    return { error: "Completá los campos del formulario." };
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();
  const normalizedMessage = message.trim();

  if (
    normalizedName.length < 2 ||
    normalizedName.length > 120 ||
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedPhone.length > 40 ||
    normalizedMessage.length < 10 ||
    normalizedMessage.length > 5000
  ) {
    return {
      error:
        "Revisá tu nombre, email y mensaje. El mensaje debe tener entre 10 y 5000 caracteres.",
    };
  }

  if (!getSupabaseConfig()) {
    return {
      error:
        "El formulario no está disponible todavía. Intentá nuevamente más tarde.",
    };
  }

  const supabase = createPublicSupabaseClient();
  const { error } = await supabase.from("inquiries").insert({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone || null,
    message: normalizedMessage,
  });

  if (error) {
    return {
      error:
        "No se pudo enviar la consulta. Intentá nuevamente en unos minutos.",
    };
  }

  return {
    error: "",
    success: "Recibimos tu consulta. Nos pondremos en contacto  a la brevedad.",
  };
}
