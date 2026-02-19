import { useReadings, useUpdateReading } from "@/hooks/use-readings";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReadingGrid() {
  const { data: readings, isLoading } = useReadings();
  const { mutate: updateReading, isPending } = useUpdateReading();

  // Create array of 30 Juz
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  const getReadingStatus = (juzNum: number) => {
    return readings?.find(r => r.juzNumber === juzNum)?.isCompleted ?? false;
  };

  const handleToggle = (juzNum: number) => {
    if (isPending) return;
    const currentStatus = getReadingStatus(juzNum);
    updateReading({ juzNumber: juzNum, isCompleted: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4 rtl">
        {juzList.map((j) => (
          <div key={j} className="h-24 rounded-xl bg-secondary/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4 rtl">
      {juzList.map((juz) => {
        const isCompleted = getReadingStatus(juz);

        return (
          <motion.button
            key={juz}
            onClick={() => handleToggle(juz)}
            disabled={isPending}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative h-24 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all duration-300",
              isCompleted 
                ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]" 
                : "bg-secondary/50 border-white/5 text-muted-foreground hover:bg-secondary hover:border-white/10"
            )}
          >
            <span className={cn("font-heading text-xl font-bold", isCompleted && "text-glow")}>
              الجزء {juz}
            </span>
            
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
              isCompleted ? "bg-primary text-background" : "bg-black/20"
            )}>
              {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-[10px] opacity-50">{juz}</span>}
            </div>

            {isCompleted && (
              <motion.div
                layoutId="glow"
                className="absolute inset-0 rounded-xl bg-primary/10 blur-xl -z-10"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
