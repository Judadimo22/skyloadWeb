import { Link } from "react-router";
import { LandingNavBar } from "../Components/Landing/LandingNavBar";
import { LandingFooter } from "../Components/Landing/LandingFooter";
import { FileText, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LAST_UPDATED = "May 26, 2026";
const EMAIL = "info@fleetpoint360.co";
const COMPANY = "Fleet Point 360";

const CONTENT = {
  en: {
    pageTitle:   "Terms and conditions",
    updated:     "Last updated:",
    breadcrumb:  "Terms and conditions",
    intro:       `This document sets out the terms under which ${COMPANY} provides its digital services. We recommend reading it carefully before using our platform.`,
    tocTitle:    "Table of contents",
    footerLink:  "View privacy policy",
    footerCta:   "Questions?",
    footerEmail: "Contact us",
    sections: [
      {
        id: "object",
        title: "1. Purpose and acceptance",
        content: `These Terms and Conditions govern access to and use of the digital platform operated by ${COMPANY} (hereinafter "Fleet Point 360"), which includes the fleet management system "Fleetpoint 360", available on our website and its subdomains.\n\nBy accessing, registering for or using our platform, the user declares that they have read, understood and fully accepted these Terms. If you do not agree with any provision, you must refrain from using the services.`,
      },
      {
        id: "accounts",
        title: "2. Registration and user accounts",
        content: `To access the advanced features of our platform, you must create an account. By doing so, you agree to:\n\n• Provide truthful, up-to-date and complete information.\n• Keep your login credentials confidential.\n• Notify Fleet Point 360 immediately of any unauthorized use of your account.\n• Not share your account with third parties or create multiple accounts to circumvent restrictions.\n\nFleet Point 360 reserves the right to suspend or delete accounts that violate these Terms, without prior notice and without liability.`,
      },
      {
        id: "service",
        title: "3. Fleet Point 360 service",
        content: `Fleet Point 360 is a B2B platform for companies and fleet managers. Its use implies:\n\n• The business client is responsible for registering only vehicles and drivers they are legally authorized to manage.\n• Geolocation data obtained through the platform belongs to the client and is processed in accordance with our Privacy Policy.\n• The service is provided under a SaaS model; Fleet Point 360 does not guarantee uninterrupted availability, but commits to a minimum monthly uptime of 99%, except in cases of force majeure.\n• It is prohibited to use the service for illegal surveillance, harassment or any activity contrary to applicable law.`,
      },
      {
        id: "prohibited",
        title: "4. Prohibited conduct",
        content: `The following are expressly prohibited:\n\n• Submitting false, misleading, defamatory, obscene or third-party rights-infringing content.\n• Attempting to gain unauthorized access to systems, databases or other users' accounts.\n• Using robots, scrapers or other automated means to extract data from the platform without written authorization.\n• Impersonating other individuals or entities.\n• Engaging in any activity that interferes with the normal functioning of the services.`,
      },
      {
        id: "ip",
        title: "5. Intellectual property",
        content: `All content, design, source code, logos, trademarks, texts and images belonging to the Fleet Point 360 platform are protected by applicable intellectual property laws.\n\nUsers receive a limited, non-exclusive, non-transferable and revocable licence to use the platform for legitimate personal or business purposes. You are not authorized to copy, modify, distribute, sell or create derivative works from any element of our platform without prior written authorization.`,
      },
      {
        id: "liability",
        title: "6. Limitation of liability",
        content: `Fleet Point 360 shall not be liable for:\n\n• Direct, indirect, incidental or consequential damages arising from the use of or inability to use the platform.\n• Inaccuracies in information provided by third parties (drivers, business clients).\n• Service interruptions caused by scheduled maintenance, third-party provider failures or force majeure events.\n\nIn no event shall Fleet Point 360's total liability to a user exceed the amount paid by that user in the last three (3) months of service.`,
      },
      {
        id: "modifications",
        title: "7. Modifications to the Terms",
        content: `Fleet Point 360 may modify these Terms at any time. Changes will be notified via a notice on the platform or by email with at least 15 days' notice. Continued use of the services after the effective date of the changes constitutes acceptance of the new Terms.`,
      },
      {
        id: "contact",
        title: "8. Contact",
        content: `For any queries relating to these Terms and Conditions, please contact us at:\n\n• Email: ${EMAIL}\n• Phone: +57 310 000 0000\n• Hours: Monday to Saturday, 8:00 a.m. – 6:00 p.m.`,
      },
    ],
  },

  es: {
    pageTitle:   "Términos y condiciones",
    updated:     "Última actualización:",
    breadcrumb:  "Términos y condiciones",
    intro:       `Este documento establece los términos bajo los cuales ${COMPANY} ofrece sus servicios digitales. Le recomendamos leerlo con atención antes de utilizar nuestra plataforma.`,
    tocTitle:    "Tabla de contenido",
    footerLink:  "Ver política de privacidad",
    footerCta:   "¿Tienes preguntas?",
    footerEmail: "Contáctanos",
    sections: [
      {
        id: "objeto",
        title: "1. Objeto y aceptación",
        content: `Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma digital operada por ${COMPANY} (en adelante "Fleet Point 360"), que incluye el sistema de gestión de flotas "Fleetpoint 360", disponible en el sitio web y sus subdominios.\n\nAl acceder, registrarse o utilizar nuestra plataforma, el usuario declara haber leído, entendido y aceptado íntegramente estos Términos. Si no está de acuerdo con alguna disposición, deberá abstenerse de utilizar los servicios.`,
      },
      {
        id: "usuarios",
        title: "2. Registro y cuentas de usuario",
        content: `Para acceder a las funcionalidades avanzadas de nuestra plataforma es necesario crear una cuenta. Al hacerlo, el usuario se compromete a:\n\n• Suministrar información veraz, actualizada y completa.\n• Mantener la confidencialidad de sus credenciales de acceso.\n• Notificar de forma inmediata a Fleet Point 360 ante cualquier uso no autorizado de su cuenta.\n• No compartir su cuenta con terceros ni crear cuentas múltiples para eludir restricciones.\n\nFleet Point 360 se reserva el derecho de suspender o eliminar cuentas que incumplan estos Términos, sin previo aviso y sin responsabilidad alguna.`,
      },
      {
        id: "servicio",
        title: "3. Servicio Fleet Point 360",
        content: `Fleet Point 360 es una plataforma B2B destinada a empresas y administradores de flotas. Su uso implica:\n\n• El cliente empresarial es responsable de registrar únicamente vehículos y conductores sobre los que tiene autorización legal.\n• Los datos de geolocalización obtenidos a través de la plataforma son propiedad del cliente y se tratan conforme a nuestra Política de Privacidad.\n• El servicio se presta bajo modalidad SaaS; Fleet Point 360 no garantiza disponibilidad ininterrumpida, pero se compromete a mantener una disponibilidad mínima del 99% mensual, salvo casos de fuerza mayor.\n• Queda prohibido usar el servicio para vigilancia ilegal, acoso o cualquier actividad contraria a la ley aplicable.`,
      },
      {
        id: "prohibiciones",
        title: "4. Conductas prohibidas",
        content: `Está expresamente prohibido:\n\n• Publicar contenido falso, engañoso, difamatorio, obsceno o que infrinja derechos de terceros.\n• Intentar acceder de forma no autorizada a sistemas, bases de datos o cuentas de otros usuarios.\n• Usar robots, scrapers u otros medios automatizados para extraer datos de la plataforma sin autorización escrita.\n• Suplantar la identidad de otras personas o entidades.\n• Realizar cualquier actividad que interfiera con el funcionamiento normal de los servicios.`,
      },
      {
        id: "propiedad",
        title: "5. Propiedad intelectual",
        content: `Todo el contenido, diseño, código fuente, logotipos, marcas, textos e imágenes propios de la plataforma Fleet Point 360 están protegidos por las leyes de propiedad intelectual aplicables.\n\nEl usuario obtiene una licencia limitada, no exclusiva, intransferible y revocable para usar la plataforma con fines personales o empresariales legítimos. No está autorizado a copiar, modificar, distribuir, vender o crear obras derivadas de ningún elemento de nuestra plataforma sin autorización escrita previa.`,
      },
      {
        id: "responsabilidad",
        title: "6. Limitación de responsabilidad",
        content: `Fleet Point 360 no será responsable por:\n\n• Daños directos, indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de la plataforma.\n• Imprecisiones en la información suministrada por terceros (conductores, empresas clientes).\n• Interrupciones del servicio causadas por mantenimiento programado, fallas de terceros proveedores o eventos de fuerza mayor.\n\nEn ningún caso la responsabilidad total de Fleet Point 360 frente a un usuario superará el monto pagado por éste en los últimos tres (3) meses de servicio.`,
      },
      {
        id: "modificaciones",
        title: "7. Modificaciones de los Términos",
        content: `Fleet Point 360 podrá modificar estos Términos en cualquier momento. Los cambios serán notificados mediante aviso en la plataforma o por correo electrónico con al menos 15 días de antelación. El uso continuado de los servicios después de la fecha de vigencia de los cambios constituirá aceptación de los mismos.`,
      },
      {
        id: "contacto",
        title: "8. Contacto",
        content: `Para cualquier consulta relacionada con estos Términos y Condiciones puede contactarnos en:\n\n• Correo electrónico: ${EMAIL}\n• Teléfono: +57 310 000 0000\n• Atención: lunes a sábado de 8:00 a.m. a 6:00 p.m.`,
      },
    ],
  },
};

/* ── Component ── */
export const TermsPage = () => {
  const { lang } = useLanguage();
  const c = CONTENT[lang] ?? CONTENT.es;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LandingNavBar />

      {/* Page header */}
      <section className="bg-linear-to-br from-slate-900 to-slate-800 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link to="/" className="hover:text-slate-200 transition">
              {lang === "en" ? "Home" : "Inicio"}
            </Link>
            <ChevronRight size={13} />
            <span className="text-slate-300">{c.breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h1 className="text-3xl font-extrabold">{c.pageTitle}</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {c.updated} <span className="text-slate-300 font-medium">{LAST_UPDATED}</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
            <p className="text-blue-800 text-sm leading-relaxed">{c.intro}</p>
          </div>

          {/* Table of contents */}
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              {c.tocTitle}
            </h2>
            <ol className="space-y-1.5">
              {c.sections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition group">
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 transition shrink-0" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div className="space-y-10">
            {c.sections.map(s => (
              <section key={s.id} id={s.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 scroll-mt-20">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  {s.title}
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center text-sm text-gray-400">
            {c.footerCta}{" "}
            <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline font-medium">
              {c.footerEmail}
            </a>
            {" · "}
            <Link to="/privacidad" className="text-blue-600 hover:underline font-medium">
              {c.footerLink}
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
