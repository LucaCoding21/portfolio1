const SOCIALS = [
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-28 pb-20 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <h2 className="section-heading text-center">Get In Touch</h2>
      <p className="text-center text-black/50 mt-4 text-lg">
        <a
          href="mailto:hello@studio.com"
          className="text-black/80 hover:text-black transition-colors"
        >
          hello@studio.com
        </a>
      </p>
      <div className="flex justify-center gap-8 mt-8">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="text-black/40 hover:text-black/80 transition-colors text-sm uppercase tracking-widest"
          >
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
