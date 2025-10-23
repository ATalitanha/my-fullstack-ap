"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-transparent text-gray-800 dark:text-gray-100"
    >
      <option value="en">English</option>
      <option value="fa">فارسی</option>
    </select>
  );
}
