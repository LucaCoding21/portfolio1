"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isHovered, setIsHovered] = useState(false);

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
      className="py-28 pb-20 px-6 md:px-10 border-t border-black/[0.06]"
    >
      <div className="max-w-xl mx-auto">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[clamp(2rem,5vw,3rem)] uppercase tracking-tight text-center mb-4">
          Get In Touch
        </h2>
        <p className="text-center text-black/50 mb-12">
          Have a project in mind? We'd love to hear from you.
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="mt-4 py-4 px-8 text-sm uppercase tracking-widest disabled:opacity-50"
            style={{
              background: isHovered && status !== "sending" ? "black" : "transparent",
              color: isHovered && status !== "sending" ? "white" : "black",
              border: "2px solid black",
              transform: isHovered && status !== "sending" ? "scale(1.05)" : "scale(1)",
              boxShadow: isHovered && status !== "sending" ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : "none",
              transition: "all 0.3s ease-out",
            }}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
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
