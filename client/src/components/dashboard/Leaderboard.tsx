import { useLeaderboard } from "@/hooks/use-readings";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) return <div className="h-64 bg-secondary/30 rounded-2xl animate-pulse" />;

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5 rtl">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="w-6 h-6 text-primary animate-pulse" />
        <h2 className="text-2xl font-heading font-bold text-foreground">المتصدرون</h2>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8 min-h-[160px]">
        {topThree[1] && <PodiumUser user={topThree[1]} rank={2} delay={0.2} />}
        {topThree[0] && <PodiumUser user={topThree[0]} rank={1} delay={0} />}
        {topThree[2] && <PodiumUser user={topThree[2]} rank={3} delay={0.4} />}
      </div>

      {/* List View */}
      <div className="space-y-3">
        {rest.map((user, index) => (
          <motion.div
            key={user.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 flex items-center justify-center font-bold text-muted-foreground bg-secondary rounded-lg">
                {index + 4}
              </span>
              <div>
                <p className="font-bold text-foreground">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">أجزاء</p>
                <p className="font-bold text-primary">{user.completedParts}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">ختمات</p>
                <p className="font-bold text-accent-foreground">{user.khatmahs}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PodiumUser({ user, rank, delay }: { user: any, rank: number, delay: number }) {
  const height = rank === 1 ? 'h-40' : rank === 2 ? 'h-32' : 'h-24';
  const color = rank === 1 ? 'bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 border-yellow-400/30' : 
                rank === 2 ? 'bg-gradient-to-b from-gray-300/20 to-gray-300/5 border-gray-300/30' : 
                             'bg-gradient-to-b from-amber-700/20 to-amber-700/5 border-amber-700/30';
  
  const iconColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : 'text-amber-700';

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2 w-1/3 max-w-[120px]"
    >
      <div className="text-center">
        <p className="font-bold text-sm truncate w-full px-1">{user.displayName}</p>
        <p className="text-xs text-muted-foreground">{user.khatmahs} ختمة</p>
      </div>
      
      <div className={cn("w-full rounded-t-xl border-t border-x relative flex items-end justify-center pb-4", height, color)}>
        <Medal className={cn("w-8 h-8 mb-2", iconColor)} />
        <div className="absolute -top-3 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold">
          {rank}
        </div>
      </div>
    </motion.div>
  );
}
