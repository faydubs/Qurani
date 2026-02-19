import { useUser, useLogout } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Moon, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 rtl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <Moon className="w-8 h-8 text-primary fill-primary/20 transition-transform group-hover:rotate-12 duration-500" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]" />
            </div>
            <span className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors">
              الرفيق القرآني
            </span>
          </div>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-foreground">{user.displayName}</span>
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => logout()}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
