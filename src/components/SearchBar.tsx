import { SearchIcon } from "./Icons";

export default function SearchBar({
  action = "/",
  defaultValue = "",
  placeholder = "Cari panduan, SOP, peraturan, format laporan, media...",
}: {
  action?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <form action={action} className="relative w-full">
      <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-1.5 rounded-full"
      >
        Cari
      </button>
    </form>
  );
}
