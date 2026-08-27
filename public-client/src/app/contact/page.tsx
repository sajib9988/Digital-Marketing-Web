import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-20 sm:px-6">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Let's talk
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Tell us about your project and we'll get back to you within one
          business day.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
