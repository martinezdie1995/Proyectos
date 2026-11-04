import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { updateInquiryStatus } from "@/app/admin/(panel)/consultas/actions";
import DeleteInquiryButton from "@/components/delete-inquiry-button";
import { getAdminSession } from "@/lib/supabase/admin-session";

export const metadata = {
  title: "Consultas | Administración",
  robots: { index: false, follow: false },
};

export const instant = false;

const inquiryStatuses = new Set(["all", "pending", "responded"]);

function formatDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPropertyTitle(relation) {
  return Array.isArray(relation) ? relation[0]?.title : relation?.title;
}

function getPhoneHref(value) {
  const normalized = value.replace(/[^\d+]/g, "");
  return /^\+?\d{6,20}$/.test(normalized) ? `tel:${normalized}` : null;
}

export default async function AdminInquiriesPage({ searchParams }) {
  await connection();
  const query = await searchParams;
  const status = inquiryStatuses.has(query.estado) ? query.estado : "all";
  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login?error=unauthorized");
  }

  let request = adminSession.supabase
    .from("inquiries")
    .select(
      "id, name, email, phone, message, status, created_at, properties(title, slug)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    request = request.eq("status", status);
  }

  const { data: inquiries, error } = await request;

  if (error) {
    throw new Error("No se pudieron cargar las consultas.");
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-primary">
            Mensajes recibidos
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Consultas
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Consultas más recientes primero. Se muestran hasta 100 por filtro.
          </p>
        </div>
        <Link
          className="text-sm font-semibold text-brand-primary hover:underline"
          href="/admin"
        >
          Volver al resumen
        </Link>
      </section>

      <nav aria-label="Filtrar consultas" className="mt-8 flex flex-wrap gap-3">
        {[
          ["all", "Todas"],
          ["pending", "Pendientes"],
          ["responded", "Respondidas"],
        ].map(([value, label]) => (
          <Link
            aria-current={status === value ? "page" : undefined}
            className={`inline-flex min-h-10 items-center border px-4 text-sm font-semibold ${
              status === value
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-border bg-white text-foreground hover:border-brand-primary"
            }`}
            href={value === "all" ? "/admin/consultas" : `/admin/consultas?estado=${value}`}
            key={value}
          >
            {label}
          </Link>
        ))}
      </nav>

      {query.eliminada === "1" && (
        <p className="mt-5 text-sm text-brand-primary" role="status">
          La consulta se eliminó.
        </p>
      )}
      {query.actualizada && (
        <p className="mt-5 text-sm text-brand-primary" role="status">
          El estado de la consulta se actualizó.
        </p>
      )}

      {inquiries.length === 0 ? (
        <section
          className="mt-8 border border-border bg-white px-6 py-14 text-center"
          role="status"
        >
          <h2 className="text-xl font-semibold">No hay consultas en esta vista</h2>
          <p className="mt-3 text-sm text-muted">
            Cuando recibas mensajes, aparecerán acá.
          </p>
        </section>
      ) : (
        <section aria-label="Consultas recibidas" className="mt-8 grid gap-4">
          {inquiries.map((inquiry) => {
            const propertyTitle = getPropertyTitle(inquiry.properties);
            const phoneHref = inquiry.phone
              ? getPhoneHref(inquiry.phone)
              : null;

            return (
              <article
                className="border border-border bg-white p-5 sm:p-7"
                key={inquiry.id}
              >
                <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-brand-primary">
                      {inquiry.status === "pending"
                        ? "Pendiente de respuesta"
                        : "Respondida"}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      {inquiry.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Recibida el {formatDate(inquiry.created_at)}
                    </p>
                  </div>
                  {propertyTitle && (
                    <p className="max-w-sm text-sm leading-6 text-muted">
                      Consulta por:{" "}
                      <span className="font-semibold text-foreground">
                        {propertyTitle}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
                  <div>
                    <h3 className="text-xs font-semibold text-muted">
                      Datos de contacto
                    </h3>
                    <a
                      className="mt-2 block break-all text-sm font-medium text-brand-primary underline underline-offset-2"
                      href={`mailto:${inquiry.email}`}
                    >
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <p className="mt-2 text-sm">
                        {phoneHref ? (
                          <a
                            className="font-medium text-brand-primary underline underline-offset-2"
                            href={phoneHref}
                          >
                            {inquiry.phone}
                          </a>
                        ) : (
                          inquiry.phone
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-muted">
                      Mensaje
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {inquiry.message}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                  <form action={updateInquiryStatus}>
                    <input
                      name="inquiry_id"
                      type="hidden"
                      value={inquiry.id}
                    />
                    <input
                      name="status"
                      type="hidden"
                      value={
                        inquiry.status === "pending" ? "responded" : "pending"
                      }
                    />
                    <button
                      className="min-h-10 border border-brand-primary px-4 text-sm font-semibold text-brand-primary transition-colors hover:bg-background"
                      type="submit"
                    >
                      {inquiry.status === "pending"
                        ? "Marcar como respondida"
                        : "Marcar como pendiente"}
                    </button>
                  </form>
                  <DeleteInquiryButton inquiryId={inquiry.id} />
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
