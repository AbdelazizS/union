import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Trash2 } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout>
            <Head title="Profile Settings" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set your preferences.
                    </p>
                </div>
                
                <Separator />

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Profile Information</CardTitle>
                            </div>
                            <CardDescription>
                                Update your account's profile information and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Update Password</CardTitle>
                            </div>
                            <CardDescription>
                                Ensure your account is using a secure password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdatePasswordForm />
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <CardTitle className="text-destructive">Delete Account</CardTitle>
                            </div>
                            <CardDescription>
                                Permanently delete your account and all associated data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeleteUserForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
