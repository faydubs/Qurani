import { useState } from "react";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/ui/shiny-button";
import { motion, AnimatePresence } from "framer-motion";
import { Moon } from "lucide-react";

// Schema for login form (subset of user schema)
const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", displayName: "" },
  });

  const onLoginSubmit = (data: any) => login(data);
  const onRegisterSubmit = (data: InsertUser) => register(data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden stars-bg rtl">
      {/* Decorative Moon Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Moon className="w-16 h-16 text-primary fill-primary/20" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" 
            />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground text-center mb-2">
            الرفيق القرآني
          </h1>
          <p className="text-muted-foreground text-center">
            {isLogin ? "سجّل دخولك لمتابعة وردك اليومي" : "أنشئ حساباً جديداً وابدأ رحلتك"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input placeholder="username" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ShinyButton type="submit" disabled={isLoginPending} className="w-full mt-6">
                    {isLoginPending ? "جاري الدخول..." : "دخول"}
                  </ShinyButton>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الظاهر</FormLabel>
                        <FormControl>
                          <Input placeholder="أحمد محمد" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input placeholder="ahmed123" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ShinyButton type="submit" disabled={isRegisterPending} className="w-full mt-6">
                    {isRegisterPending ? "جاري الإنشاء..." : "إنشاء حساب"}
                  </ShinyButton>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:text-primary/80 hover:underline transition-all"
          >
            {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب بالفعل؟ سجل الدخول"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
