"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // TODO: Replace with your form handling logic (e.g., API route, Formspree, etc.)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="relative z-10 py-20 md:py-28 pb-20 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <div className="max-w-xl mx-auto">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(1.8rem,5vw,3rem)] uppercase tracking-tight text-center mb-3 md:mb-4">
          Get In Touch
        </h2>
        <p className="text-center text-black/50 text-sm md:text-base mb-8 md:mb-12">
          Have a project in mind? We&apos;d love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs uppercase tracking-widest text-black/50 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 bg-transparent border-b border-black/20 focus:border-black outline-none transition-colors text-black placeholder:text-black/30"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-widest text-black/50 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 bg-transparent border-b border-black/20 focus:border-black outline-none transition-colors text-black placeholder:text-black/30"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-widest text-black/50 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-0 py-3 bg-transparent border-b border-black/20 focus:border-black outline-none transition-colors text-black placeholder:text-black/30 resize-none"
              placeholder="Tell us about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative mt-4 w-full md:w-auto py-4 px-8 text-sm uppercase tracking-widest disabled:opacity-50 bg-transparent text-black border-2 border-black overflow-hidden transition-colors duration-500 ease-out hover:text-white disabled:hover:text-black active:scale-[0.98] transition-transform"
          >
            <span className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-disabled:!-translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              {status === "sending" ? (
                "Sending..."
              ) : (
                <>
                  Send Message
                  <svg
                    className="w-4 h-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </span>
          </button>

          {status === "sent" && (
            <p className="text-center text-green-600 text-sm">
              Thank you! We'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-red-600 text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
