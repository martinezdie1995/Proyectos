"use server";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin-session";

export async function updateInquiryStatus(formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    throw new Error("Iniciá sesión con una cuenta administradora.");
  }

  const id = formData.get("inquiry_id");
  const status = formData.get("status");

  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    ) ||
    !["pending", "responded"].includes(status)
  ) {
    throw new Error("La consulta o el estado seleccionado no son válidos.");
  }

  const { error } = await adminSession.supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error("No se pudo actualizar el estado de la consulta.");
  }

  redirect(`/admin/consultas?actualizada=${id}`);
}

export async function deleteInquiry(formData) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    throw new Error("Iniciá sesión con una cuenta administradora.");
  }

  const id = formData.get("inquiry_id");

  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    throw new Error("La consulta seleccionada no es válida.");
  }

  const { error } = await adminSession.supabase
    .from("inquiries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("No se pudo eliminar la consulta.");
  }

  redirect("/admin/consultas?eliminada=1");
}
