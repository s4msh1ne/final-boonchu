import type { Metadata } from "next";
import { Figtree, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  title: {
    default: "สุพรรณแจ้งได้ | Suphan Alert",
    template: "%s | สุพรรณแจ้งได้",
  },
  description: "แพลตฟอร์มแจ้งและติดตามปัญหาในเขตเมืองสุพรรณบุรี ช่วยให้ประชาชนและหน่วยงานในพื้นที่ประสานงานและแก้ไขปัญหาได้อย่างมีประสิทธิภาพ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={cn("h-full antialiased", figtree.variable, ibmPlexSansThai.variable)}>
      <body className="flex min-h-full flex-col"><Toaster>{children}</Toaster></body>
    </html>
  );
}
