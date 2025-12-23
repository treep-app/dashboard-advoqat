"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Scale, Briefcase, FileText, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard/overview");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding/Illustration */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 48%) 50%, hsl(221, 83%, 43%) 100%)'
      }}>
        {/* Pattern Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Legal-themed decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Scales of Justice - Large decorative element */}
          <div className="absolute top-20 right-20" style={{ opacity: 0.2 }}>
            <Scale className="h-64 w-64" style={{ color: 'white', strokeWidth: 2 }} />
          </div>
          {/* Briefcase */}
          <div className="absolute bottom-32 left-16" style={{ opacity: 0.2 }}>
            <Briefcase className="h-48 w-48" style={{ color: 'white', strokeWidth: 2 }} />
          </div>
          {/* Document */}
          <div className="absolute top-1/2 left-1/4" style={{ opacity: 0.2 }}>
            <FileText className="h-40 w-40" style={{ color: 'white', strokeWidth: 2 }} />
          </div>
          {/* Shield */}
          <div className="absolute bottom-20 right-1/3" style={{ opacity: 0.2 }}>
            <Shield className="h-36 w-36" style={{ color: 'white', strokeWidth: 2 }} />
          </div>
        </div>

        {/* Central Legal Illustration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" style={{ opacity: 0.25 }}>
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'white' }}
          >
            {/* Scales of Justice */}
            <g stroke="currentColor" strokeWidth="3" fill="none">
              {/* Base */}
              <rect x="150" y="320" width="100" height="20" rx="4" />
              {/* Pillar */}
              <rect x="195" y="100" width="10" height="220" />
              {/* Crossbar */}
              <rect x="100" y="100" width="200" height="8" />
              {/* Left Scale */}
              <ellipse cx="120" cy="130" rx="30" ry="8" />
              <path d="M 90 130 L 90 150 L 150 150 L 150 130" />
              {/* Right Scale */}
              <ellipse cx="280" cy="130" rx="30" ry="8" />
              <path d="M 250 130 L 250 150 L 310 150 L 310 130" />
            </g>
            {/* Legal Document */}
            <g stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9">
              <rect x="50" y="200" width="80" height="100" rx="4" />
              <line x1="60" y1="220" x2="120" y2="220" />
              <line x1="60" y1="240" x2="120" y2="240" />
              <line x1="60" y1="260" x2="100" y2="260" />
            </g>
            {/* Briefcase */}
            <g stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9">
              <rect x="270" y="220" width="100" height="70" rx="4" />
              <rect x="275" y="225" width="90" height="60" rx="2" />
              <line x1="320" y1="220" x2="320" y2="290" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12" style={{ color: 'white' }}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
                <Scale className="h-7 w-7" style={{ color: 'white' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'white' }}>Advoqat</h1>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Admin Dashboard</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'white' }}>
              Welcome to <br />
              Advoqat Admin
            </h2>
            <p className="text-lg max-w-md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Manage your legal tech platform with powerful admin tools and comprehensive analytics.
            </p>
          </div>
          
          {/* Legal-themed feature highlights */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
                <Scale className="h-4 w-4" style={{ color: 'white' }} />
              </div>
              <span className="text-sm">Manage barristers & freelancers</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
                <Briefcase className="h-4 w-4" style={{ color: 'white' }} />
              </div>
              <span className="text-sm">Track all legal cases</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
                <FileText className="h-4 w-4" style={{ color: 'white' }} />
              </div>
              <span className="text-sm">Monitor AI-generated documents</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
                <Shield className="h-4 w-4" style={{ color: 'white' }} />
              </div>
              <span className="text-sm">Secure role-based access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-8 lg:px-12 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
                <Scale className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Advoqat</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome back
                </h2>
                <p className="text-muted-foreground">
                  Please sign in to your admin account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@advoqat.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t">
                <p className="text-center text-xs text-muted-foreground">
                  Secure admin access • Protected by encryption
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 Advoqat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
