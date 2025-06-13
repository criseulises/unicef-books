import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6">
        HOLA bienvenido al pollito pito
      </h1>
      <Link href="/books/el-pollito-pito/reading">
        <button className="px-6 py-3 bg-primary-600 text-white rounded hover:bg-primary-700 transition">
          ver libro
        </button>
      </Link>
    </main>
  )
}