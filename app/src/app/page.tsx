import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-stone-50">
      <main className="w-full max-w-5xl px-6 py-20">
        <div className="space-y-8">
          <p className="text-sm font-medium text-stone-500 uppercase tracking-widest">
            Registro Academico
          </p>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-800">
              Control de Asistencia
            </h1>
            <p className="mt-3 max-w-md text-lg text-stone-500">
              Registro de asistencia para eventos y simposios academicos.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
          >
            Ir al Dashboard
          </Link>
        </div>
        <footer className="mt-20 text-sm text-stone-400">
          Universidad · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
