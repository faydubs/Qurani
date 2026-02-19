import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useUser() {
  return useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "مرحباً بك",
        description: `أهلاً بك مجدداً يا ${user.displayName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message,
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "تم إنشاء الحساب",
        description: "أهلاً بك في الرفيق القرآني",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: error.message,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear();
      toast({
        description: "تم تسجيل الخروج بنجاح",
      });
    },
  });
}
