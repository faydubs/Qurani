import { Link } from "wouter";
import { Moon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground rtl">
      <Moon className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
      <h1 className="text-4xl font-bold font-heading text-primary mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">الصفحة غير موجودة</p>
      
      <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
        العودة للرئيسية
      </Link>
    </div>
  );
}
