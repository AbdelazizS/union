<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServicePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view services');
    }

    public function view(User $user, Service $service): bool
    {
        return $user->hasPermissionTo('view services');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create services');
    }

    public function update(User $user, Service $service): bool
    {
        return $user->hasPermissionTo('edit services');
    }

    public function delete(User $user, Service $service): bool
    {
        if ($service->bookings()->exists()) {
            return false;
        }
        
        return $user->hasPermissionTo('delete services');
    }

    public function restore(User $user, Service $service): bool
    {
        return $user->hasPermissionTo('edit services');
    }

    public function forceDelete(User $user, Service $service): bool
    {
        return $user->hasPermissionTo('delete services');
    }

    public function toggleStatus(User $user, Service $service): bool
    {
        return $user->hasPermissionTo('edit services');
    }
} 