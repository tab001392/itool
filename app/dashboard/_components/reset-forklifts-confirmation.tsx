"use client";

import { useTransition } from "react";
import { ListRestart } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resetForklifts } from "@/actions/forklift";

export const ResetForkliftsConfirmation = () => {
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center space-x-1 py-1 px-2 rounded-md border">
        <ListRestart className="w-7 h-7 mr-1" />
        <h1>Reset Forklifts</h1>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to reset the Forklifts stats?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium">
            This will set all the forklifts to absent so a new session can be
            started
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await resetForklifts().then(() => {
                  window.location.reload();
                });
              })
            }
          >
            {isPending ? "Reseting..." : "Reset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
