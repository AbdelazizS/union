import { Head, Link, router } from '@inertiajs/react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Shield, Users2, BarChart3, LayoutGrid, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Checkbox } from "@/Components/ui/checkbox";

// Form validation schema
const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
    remember: z.boolean().default(false),
});

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form with Zod validation
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = (values) => {
        setIsSubmitting(true);
        router.post(route('login'), values, {
            onSuccess: () => {
                toast.success("Login successful!");
                form.reset();
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error("Login failed. Please check your credentials.");
                Object.keys(errors).forEach(key => {
                    form.setError(key, { message: errors[key] });
                });
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Admin Login" />

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
                        <p className="text-xl mb-8 opacity-90">Access your administrative dashboard to manage all aspects of the platform</p>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Administrative Access</CardTitle>
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
                                Welcome Back
                            </h2>
                            <p className="text-muted-foreground">
                                Sign in to your administrative account
                            </p>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter your email" 
                        type="email"
                                                            {...field} 
                                                        />
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
                                                                placeholder="Enter your password"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </button>
                </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="remember"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                            Remember me
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center justify-between">
                    <Link
                        href={route('register')}
                        className="text-sm text-primary hover:text-primary/90"
                    >
                        Don't have an account? Register
                    </Link>
                                            <Button type="submit" disabled={isSubmitting}>
                                                Sign In
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
