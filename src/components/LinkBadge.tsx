import { LINK_TYPE_LABELS } from "@/lib/categories";
import { DriveIcon, VideoIcon, ExternalLinkIcon } from "./Icons";

const STYLES: Record<string, string> = {
  DRIVE: "bg-blue-50 text-blue-700",
  YOUTUBE: "bg-red-50 text-red-700",
  WEBSITE: "bg-gray-100 text-gray-700",
  LAINNYA: "bg-gray-100 text-gray-700",
};

export default function LinkBadge({ linkType }: { linkType: string }) {
  const Icon = linkType === "DRIVE" ? DriveIcon : linkType === "YOUTUBE" ? VideoIcon : ExternalLinkIcon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        STYLES[linkType] || STYLES.LAINNYA
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {LINK_TYPE_LABELS[linkType] || linkType}
    </span>
  );
}
