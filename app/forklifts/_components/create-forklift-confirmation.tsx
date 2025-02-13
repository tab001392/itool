"use client";

import { useTransition } from "react";

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
import { Plus } from "lucide-react";
import { addForklift } from "@/actions/forklift";

export const CreateForkliftConfirmation = () => {
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center space-x-1 py-1 px-2 rounded-md border bg-green-500">
        <Plus className="w-7 h-7 mr-1" />
        <h1>Add Forklift</h1>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to add a new Forklift?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium">
            This will create a new Forklift and auto generate the QRCode with
            unique SKU
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await addForklift().then(() => {
                  window.location.reload();
                });
              })
            }
          >
            {isPending ? "Adding..." : "Add"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
