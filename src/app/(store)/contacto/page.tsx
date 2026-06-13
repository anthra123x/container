export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Contacto</h1>
      <p className="mt-4 text-muted-foreground">
        Estamos para ayudarte. Escríbenos por WhatsApp o visítanos.
      </p>
      <div className="mt-8 space-y-4">
        <a
          href="https://wa.me/573000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
