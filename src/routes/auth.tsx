import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type AppRole } from "@/lib/roles";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { role?: AppRole } => {
    const raw = typeof search["role"] === "string" ? (search["role"] as string).toLowerCase() : "";
    const map: Record<string, AppRole> = {
      student: "student",
      teacher: "teacher",
      admin: "admin",
      administrator: "admin",
    };
    return map[raw] ? { role: map[raw] } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign In | Sermo Play" },
      {
        name: "description",
        content:
          "Sign in as student, teacher or administrator to download regional-language classroom games, build quizzes and sync offline records.",
      },
      { property: "og:title", content: "Sign In | Sermo Play" },
      {
        property: "og:description",
        content: "Sign in as student, teacher or administrator to access the Sermo Play workspace.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { role: roleParam } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>(roleParam ?? "student");
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState("Class 1");
  const [school, setSchool] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (roleParam) setRole(roleParam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [roleParam]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const metadata: Record<string, string> = { name, role };
    if (role === "student") {
      metadata['grade_level'] = grade;
      metadata['school'] = school;
    } else if (role === "teacher") {
      metadata['subject_specialty'] = specialty;
      metadata['employee_id'] = employeeId;
      metadata['school'] = school;
    } else {
      metadata['admin_code'] = adminCode;
      metadata['mobile'] = mobile;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. Check your email to confirm, then sign in.");
  }

  async function forgotPassword() {
    const target = window.prompt("Enter your account email to receive a reset link", email);
    if (!target) return;
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset link sent — check your inbox.");
  }

  return (
    <div className="surface-paper flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
          <ThemeToggle />
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex justify-center">
              <BrandLogo />
            </div>
            <CardTitle className="text-2xl">Sermo Play access</CardTitle>
            <CardDescription>Students, teachers and administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 pb-2">
              <Label htmlFor="role-global">Select Your Profile Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger id="role-global">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">🎒 Student</SelectItem>
                  <SelectItem value="teacher">🧑‍🏫 Teacher</SelectItem>
                  <SelectItem value="admin">🛡️ Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form className="space-y-4 pt-4" onSubmit={signIn}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    Sign in
                  </Button>
                  <button
                    type="button"
                    onClick={forgotPassword}
                    className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    🔒 Forgot Password?
                  </button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form className="space-y-4 pt-4" onSubmit={signUp}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} required onChange={(e) => setName(e.target.value)} />
                  </div>
                  {role === "student" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade level</Label>
                        <Select value={grade} onValueChange={setGrade}>
                          <SelectTrigger id="grade">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => `Class ${i + 1}`).map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school">School name</Label>
                        <Input id="school" value={school} required onChange={(e) => setSchool(e.target.value)} />
                      </div>
                    </>
                  )}
                  {role === "teacher" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Assigned subject specialty</Label>
                        <Input
                          id="specialty"
                          value={specialty}
                          required
                          placeholder="e.g. Mathematics"
                          onChange={(e) => setSpecialty(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empid">Employee ID</Label>
                        <Input id="empid" value={employeeId} required onChange={(e) => setEmployeeId(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school-t">School name</Label>
                        <Input id="school-t" value={school} required onChange={(e) => setSchool(e.target.value)} />
                      </div>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="admincode">Institutional admin code</Label>
                        <Input
                          id="admincode"
                          value={adminCode}
                          required
                          onChange={(e) => setAdminCode(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile number</Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={mobile}
                          required
                          pattern="[0-9+ ]{8,15}"
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email2">Email</Label>
                    <Input id="email2" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2">Password</Label>
                    <Input
                      id="password2"
                      type="password"
                      minLength={6}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              An account is required to open the workspace — sign in or register above.
            </p>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}
