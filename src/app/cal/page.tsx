import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import Link from "next/link";

export default function Cal() {
  return (
    <>
      <Header />
      <div
        className={`flex lg:flex-row flex-col h-screen w-screen px-14 justify-center items-stretch md:items-center ${theme}`}
      >
        <Link
          href="/cal/calc"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          ماشین حساب ساده
        </Link>
        <Link
          href="/cal/units"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="units"
        >
          تبدیل واحد
        </Link>
        <Link
          href="/cal/advanc-cal"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="units"
        >
          ماشین حساب پیشرفته
        </Link>
      </div>
    </>
  )
}