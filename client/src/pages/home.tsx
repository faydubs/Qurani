import { Navbar } from "@/components/layout/Navbar";
import { ReadingGrid } from "@/components/dashboard/ReadingGrid";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { useUser } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";

export default function Home() {
  const { data: user } = useUser();

  if (!user) return null; // Should be handled by router protection, but safe fallback

  return (
    <div className="min-h-screen bg-background text-foreground stars-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Welcome Section */}
        <section className="text-center py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-glow">
              السلام عليكم، {user.displayName}
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            </p>
          </motion.div>
        </section>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 rtl">
          <StatsCard 
            title="الأجزاء المكتملة" 
            value={user.completedParts || 0} 
            total={30} 
            icon={<BookOpen className="w-6 h-6 text-primary" />}
            delay={0.1}
          />
          <StatsCard 
            title="عدد الختمات" 
            value={user.khatmahs || 0} 
            icon={<Star className="w-6 h-6 text-accent" />}
            delay={0.2}
          />
          <StatsCard 
            title="التقدم الحالي" 
            value={`${Math.round(((user.completedParts || 0) / 30) * 100)}%`} 
            icon={<div className="w-6 h-6 rounded-full border-2 border-green-500" />}
            delay={0.3}
          />
        </section>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rtl">
          {/* Reading Tracker - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                متابعة الختمة
              </h2>
            </div>
            <ReadingGrid />
          </div>

          {/* Leaderboard - Takes up 1/3 on large screens */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/50 mt-12">
        <p>الرفيق القرآني © {new Date().getFullYear()}</p>
        <p className="mt-2 text-xs opacity-50">تطبيق لمتابعة الختمات القرآنية في رمضان وما بعده</p>
      </footer>
    </div>
  );
}

function StatsCard({ title, value, total, icon, delay }: { title: string, value: string | number, total?: number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-secondary/30 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-colors"
    >
      <div>
        <p className="text-muted-foreground text-sm mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-heading">{value}</span>
          {total && <span className="text-sm text-muted-foreground">/ {total}</span>}
        </div>
      </div>
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-inner">
        {icon}
      </div>
    </motion.div>
  );
}
