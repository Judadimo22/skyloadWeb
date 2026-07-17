import { Link } from "react-router";
import { LandingNavBar } from "../Components/Landing/LandingNavBar";
import { LandingFooter } from "../Components/Landing/LandingFooter";
import { ShieldCheck, ChevronRight, Lock, Eye, UserCheck, Bell, Trash2, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LAST_UPDATED = "May 26, 2026";
const EMAIL   = "info@fleetpoint360.com";
const COMPANY = "Fleet Point 360";

const ICONS = [Eye, UserCheck, Lock, ShieldCheck, UserCheck, Bell, Trash2, Mail];

const CONTENT = {
  en: {
    pageTitle:  "Privacy policy",
    updated:    "Last updated:",
    breadcrumb: "Privacy policy",
    intro: `At ${COMPANY} we take your privacy seriously. This policy explains clearly and simply what information we collect, how we use it and how we protect it. If you have any questions, feel free to write to us at `,
    footerCta:  "Questions about your privacy?",
    footerLink: "Write to us",
    termsLink:  "View terms and conditions",
    sections: [
      {
        id: "what-we-collect",
        title: "What information do we collect?",
        content: `When you use our platform, we may collect the following information:\n\n• Name and email address when you create your account.\n• Data on the vehicles and drivers you register in the system.\n• GPS location of active units on the platform.\n• Basic usage information (pages visited, session time) to improve the experience.\n\nWe do not collect information that is not necessary for the service to work correctly.`,
      },
      {
        id: "how-we-use",
        title: "What do we use your information for?",
        content: `The information we collect is used exclusively to:\n\n• Keep your account active and secure.\n• Display real-time tracking of your fleet.\n• Send you service-related notifications (alerts, important updates).\n• Improve the platform based on how it is used.\n\nWe never use your data for advertising purposes or sell it to third parties.`,
      },
      {
        id: "security",
        title: "How do we protect your information?",
        content: `The security of your data is our priority. To protect it:\n\n• All communications between your device and our platform are encrypted.\n• Access to data is restricted to authorized personnel only.\n• We use encrypted passwords and sessions with automatic expiration.\n• We conduct periodic security reviews to detect and fix vulnerabilities.\n\nYour data is not stored for longer than necessary.`,
      },
      {
        id: "third-parties",
        title: "Do we share your information?",
        content: `We do not sell or transfer your personal information to third parties.\n\nWe may only share data with technology service providers that help us operate the platform (such as cloud servers or email systems), which are contractually obligated to treat that information with the same level of confidentiality as we do.\n\nUnder no circumstances will your information be used by those third parties for their own purposes.`,
      },
      {
        id: "your-rights",
        title: "Your rights over your information",
        content: `You have control over your information at all times:\n\n• You can ask us to show you what data we hold about you.\n• You can request that we correct any inaccurate data.\n• You can ask us to delete your information when you no longer use the service.\n• You can withdraw your consent to data processing at any time.\n\nTo exercise any of these rights, simply write to us at ${EMAIL}.`,
      },
      {
        id: "notifications",
        title: "Notifications and communications",
        content: `We will send you emails only when necessary: account confirmation, system alerts or important service changes.\n\nWe will not send you advertising or unsolicited emails. If at any point you decide you no longer wish to receive communications, you can let us know and we will handle it promptly.`,
      },
      {
        id: "deletion",
        title: "Data deletion",
        content: `If you decide to stop using Fleet Point 360, you can request the complete deletion of your account and all associated information.\n\nOnce the request is confirmed, we delete your data within a maximum of 30 days. If any legal obligation requires us to retain certain information for longer, we will inform you clearly.`,
      },
      {
        id: "contact",
        title: "Questions? Contact us",
        content: `If you have any questions about how we handle your information or want to exercise any of your rights, we are here to help:\n\n• Email: ${EMAIL}\n• Phone: +57 310 000 0000\n• Hours: Monday to Saturday, 8:00 a.m. – 6:00 p.m.\n\nWe commit to responding within a maximum of 5 business days.`,
      },
    ],
  },

  es: {
    pageTitle:  "Política de privacidad",
    updated:    "Última actualización:",
    breadcrumb: "Política de privacidad",
    intro: `En ${COMPANY} nos tomamos muy en serio la privacidad de tus datos. Esta política explica de forma clara y sencilla qué información recopilamos, cómo la usamos y cómo la protegemos. Si tienes dudas, puedes escribirnos directamente a `,
    footerCta:  "¿Tienes preguntas sobre tu privacidad?",
    footerLink: "Escríbenos",
    termsLink:  "Ver términos y condiciones",
    sections: [
      {
        id: "que-recopilamos",
        title: "¿Qué información recopilamos?",
        content: `Cuando usas nuestra plataforma, podemos recopilar la siguiente información:\n\n• Nombre y correo electrónico al crear tu cuenta.\n• Datos de los vehículos y conductores que registres en el sistema.\n• Ubicación GPS de las unidades activas en la plataforma.\n• Información básica de uso (páginas visitadas, tiempo en sesión) para mejorar la experiencia.\n\nNo recopilamos información que no sea necesaria para que el servicio funcione correctamente.`,
      },
      {
        id: "como-usamos",
        title: "¿Para qué usamos tu información?",
        content: `La información que recopilamos se usa exclusivamente para:\n\n• Mantener tu cuenta activa y segura.\n• Mostrarte el seguimiento en tiempo real de tu flota.\n• Enviarte notificaciones relacionadas con el servicio (alertas, actualizaciones importantes).\n• Mejorar la plataforma con base en cómo se usa.\n\nNunca usamos tus datos para fines publicitarios ni los vendemos a terceros.`,
      },
      {
        id: "seguridad",
        title: "¿Cómo protegemos tu información?",
        content: `La seguridad de tus datos es nuestra prioridad. Para protegerlos:\n\n• Todas las comunicaciones entre tu dispositivo y nuestra plataforma viajan cifradas.\n• El acceso a los datos está restringido únicamente al personal autorizado.\n• Usamos contraseñas protegidas con cifrado y sesiones con tiempo de expiración automático.\n• Realizamos revisiones periódicas de seguridad para detectar y corregir vulnerabilidades.\n\nTus datos no se almacenan más tiempo del necesario.`,
      },
      {
        id: "terceros",
        title: "¿Compartimos tu información?",
        content: `No vendemos ni cedemos tu información personal a terceros.\n\nÚnicamente podemos compartir datos con proveedores de servicios tecnológicos que nos ayudan a operar la plataforma (como servidores en la nube o sistemas de envío de correo), los cuales están obligados contractualmente a tratar esa información con el mismo nivel de confidencialidad que nosotros.\n\nEn ningún caso tu información será usada por esos terceros para sus propios fines.`,
      },
      {
        id: "tus-derechos",
        title: "Tus derechos sobre tu información",
        content: `Tienes control sobre tu información en todo momento:\n\n• Puedes pedirnos que te mostremos qué datos tenemos sobre ti.\n• Puedes solicitar que corrijamos cualquier dato incorrecto.\n• Puedes pedirnos que eliminemos tu información cuando ya no uses el servicio.\n• Puedes revocar tu consentimiento para el uso de tus datos en cualquier momento.\n\nPara ejercer cualquiera de estos derechos, simplemente escríbenos a ${EMAIL}.`,
      },
      {
        id: "notificaciones",
        title: "Notificaciones y comunicaciones",
        content: `Te enviaremos correos electrónicos únicamente cuando sea necesario: confirmación de cuenta, alertas del sistema o cambios importantes en el servicio.\n\nNo te enviaremos publicidad ni correos no solicitados. Si en algún momento decides no recibir más comunicaciones, puedes pedírnoslo y lo gestionamos sin problema.`,
      },
      {
        id: "eliminacion",
        title: "Eliminación de datos",
        content: `Si decides dejar de usar Fleet Point 360, puedes solicitar la eliminación completa de tu cuenta y toda la información asociada.\n\nUna vez confirmada la solicitud, eliminamos tus datos en un plazo máximo de 30 días. Si existe alguna obligación que nos exija conservar cierta información por más tiempo, te lo informaremos claramente.`,
      },
      {
        id: "contacto",
        title: "¿Tienes dudas? Contáctanos",
        content: `Si tienes alguna pregunta sobre cómo manejamos tu información o quieres ejercer alguno de tus derechos, estamos aquí para ayudarte:\n\n• Correo: ${EMAIL}\n• Teléfono: +57 310 000 0000\n• Horario: lunes a sábado, 8:00 a.m. – 6:00 p.m.\n\nNos comprometemos a responderte en un plazo máximo de 5 días hábiles.`,
      },
    ],
  },
};

/* ── Component ── */
export const PrivacyPage = () => {
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
              <ShieldCheck size={20} />
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm leading-relaxed">
                {c.intro}
                <a href={`mailto:${EMAIL}`} className="underline font-medium">{EMAIL}</a>
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-5">
            {c.sections.map(({ id, title, content }, i) => {
              const Icon = ICONS[i] ?? ShieldCheck;
              return (
                <section key={id} id={id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-blue-600" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {content}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center text-sm text-gray-400">
            {c.footerCta}{" "}
            <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline font-medium">
              {c.footerLink}
            </a>
            {" · "}
            <Link to="/terminos" className="text-blue-600 hover:underline font-medium">
              {c.termsLink}
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
