import { Head, Link, router } from '@inertiajs/react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Shield, Users2, BarChart3, LayoutGrid, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Form validation schema
const formSchema = z.object({
    name: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function Register() {
    // React Hook Form with Zod validation
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to check password strength
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: 'bg-muted' };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const strength = {
            0: { label: '', color: 'bg-muted' },
            1: { label: 'Very Weak', color: 'bg-destructive' },
            2: { label: 'Weak', color: 'bg-orange-500' },
            3: { label: 'Medium', color: 'bg-yellow-500' },
            4: { label: 'Strong', color: 'bg-emerald-500' },
            5: { label: 'Very Strong', color: 'bg-green-500' },
            6: { label: 'Excellent', color: 'bg-green-600' }
        };

        return {
            score: (score / 6) * 100,
            ...strength[score]
        };
    };

    const onSubmit = (values) => {
        setIsSubmitting(true);
        router.post(route('register'), values, {
            onSuccess: () => {
                toast.success("Registration successful!");
                form.reset();
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error("Registration failed. Please check your input.");
                Object.keys(errors).forEach(key => {
                    form.setError(key, { message: errors[key] });
                });
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Admin Registration" />

            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left Column - Admin Brand Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/50 to-primary/70 flex-col justify-between px-12 text-primary-foreground relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    {/* Top Logo */}
                    <div className="w-full pt-8 max-w-60">
                        <img
                            src="/images/logo.png"
                            alt="Company Logo"
                            className="w-full h-full"
                        />
                    </div>

                    {/* Center Content */}
                    <div className="max-w-md relative z-10">
                        <h1 className="text-4xl font-bold mb-6 text-primary-foreground">Admin Portal</h1>
                        <p className="text-xl mb-8 opacity-90">Access the administrative dashboard to manage all aspects of the platform</p>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Administrative Privileges</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <LayoutGrid className="h-5 w-5 opacity-80" />
                                        <span>Services & Categories Management</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Users2 className="h-5 w-5 opacity-80" />
                                        <span>Booking & Partner Control</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 opacity-80" />
                                        <span>Content Management</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <BarChart3 className="h-5 w-5 opacity-80" />
                                        <span>Reports & Analytics</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                </div>

                    {/* Copyright Notice */}
                    <div className="w-full pb-8 text-center text-sm opacity-80">
                        © {new Date().getFullYear()} Aziz designs. All rights reserved.
                    </div>
                </div>

                {/* Right Column - Form Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-background">
                    <div className="w-full max-w-lg space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                Admin Registration
                            </h2>
                            <p className="text-muted-foreground">
                                Create your administrative account to access the platform
                            </p>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Admin Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Enter your email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Create a password"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                                <span className="sr-only">
                                                                    {showPassword ? "Hide password" : "Show password"}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {form.watch("password") && (
                                            <div className="mt-2 space-y-2">
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ease-out ${getPasswordStrength(form.watch("password")).color}`}
                                                        style={{
                                                            width: `${getPasswordStrength(form.watch("password")).score}%`
                                                        }}
                    />
                </div>
                                                <p className="text-xs text-muted-foreground flex items-center justify-between">
                                                    <span>Password Strength:</span>
                                                    <span className="font-medium">{getPasswordStrength(form.watch("password")).label}</span>
                                                </p>
                                            </div>
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="password_confirmation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm your password"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                                <span className="sr-only">
                                                                    {showConfirmPassword ? "Hide password" : "Show password"}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route('login')}
                                                className="text-sm text-primary hover:text-primary/90 font-medium transition"
                    >
                                                Return to Login
                    </Link>

                                            <Button type="submit" disabled={isSubmitting}>
                                                Create Admin Account
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        <div className="text-center text-sm text-muted-foreground">
                            <p>By registering, you agree to our security policies and terms of service</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
