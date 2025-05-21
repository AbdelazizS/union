import { MoreHorizontal } from "lucide-react";
import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DataTableRowActions({ row, actions }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => {
          if (action.separator) {
            return <DropdownMenuSeparator key={index} />;
          }

          return (
            <DropdownMenuItem
              key={action.label}
              onClick={() => {
                if (action.href) {
                  router.visit(action.href);
                } else if (action.onClick) {
                  action.onClick();
                }
              }}
              disabled={action.disabled}
              className={action.variant === "destructive" ? "text-red-600" : ""}
            >
              {action.icon && (
                <action.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              )}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 