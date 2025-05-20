import { Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Settings,
    LogOut,
    User,
    Bell,
    Sun,
    Moon,
    Laptop,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';

export default function AdminNavbar({ breadcrumbs = [] }) {
    const { auth, notifications } = usePage().props;
    const [theme, setTheme] = useState('system');
    const [unreadNotifications, setUnreadNotifications] = useState(notifications?.unread || 0);

    // Theme handling
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
    }, []);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        // Add your theme switching logic here
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm">
                    <Link
                        href={route('admin.dashboard')}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <Link
                                href={item.href}
                                className={index === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Right side items */}
                <div className="ml-auto flex items-center space-x-4">
                  

             

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback>{auth.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')}>
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-red-600">
                                <Link href={route('logout')} method="post" as="button" className="w-full">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
} 