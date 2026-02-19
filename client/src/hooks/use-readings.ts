import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Reading, type LeaderboardEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useReadings() {
  return useQuery({
    queryKey: ["/api/readings"],
    queryFn: async () => {
      const res = await fetch("/api/readings");
      if (!res.ok) throw new Error("Failed to fetch readings");
      return (await res.json()) as Reading[];
    },
  });
}

export function useUpdateReading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ juzNumber, isCompleted }: { juzNumber: number; isCompleted: boolean }) => {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ juzNumber, isCompleted }),
      });

      if (!res.ok) throw new Error("Failed to update reading");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/readings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // User stats might update
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      
      if (variables.isCompleted) {
        toast({
          title: "أحسنت!",
          description: `تم إكمال الجزء ${variables.juzNumber} بنجاح`,
          className: "bg-primary text-primary-foreground border-none",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث حالة القراءة",
      });
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return (await res.json()) as LeaderboardEntry[];
    },
  });
}
