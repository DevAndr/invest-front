import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <Link href={'/companies'} className='bg-white p-2 text-black cursor-pointer rounded-md hover:bg-gray-100'>Начать анализ</Link>
      </main>
    </div>
  );
}
