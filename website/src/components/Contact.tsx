import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [pages, setPages] = useState<Array<{ id: string; name: string }>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // construct mailto URL to open user's email client
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );
    const mailto = `mailto:andreasthuis.dev@gmail.com?subject=${subject}&body=${body}`;

    // open mail client
    window.location.href = mailto;

    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/data/pages.json");
        const data = await res.json();
        if (mounted)
          setPages(
            data.filter((p: any) => p.id !== "home" && p.id !== "contact"),
          );
      } catch (e) {
        console.error("could not fetch pages", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname === `/${id}`) return;
    window.history.pushState({}, "", `/${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="contact" className="contact">
      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {pages.length > 0 && (
          <motion.div className="extra-section" variants={itemVariants}>
            <h2>Extra:</h2>
            <div className="extra-links">
              {pages.map((p) => (
                <a
                  key={p.id}
                  href={`/${p.id}`}
                  onClick={(e) => handleNav(e, p.id)}
                  className="extra-btn"
                >
                  {p.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
        <motion.h2 variants={itemVariants}>Get In Touch</motion.h2>
        <motion.p className="contact-subtitle" variants={itemVariants}>
          Have a project in mind? Let's create something amazing together.
        </motion.p>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell me about your project..."
              rows={6}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
        </motion.form>

        <motion.div className="contact-links" variants={itemVariants}>
          <a href="mailto:andreasthuis.dev@gmail.com">Email</a>
          <a
            href="https://github.com/andreasthuis"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.roblox.com/users/2669600234/profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roblox
          </a>
          <a
            href="https://discord.com/users/1074022478474641498"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
