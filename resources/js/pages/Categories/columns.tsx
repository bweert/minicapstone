import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type Category = {
    id: number;
    categorie_name: string;
    created_at?: string;
};

interface ColumnsProps {
    onEdit: (category: Category) => void;
}

export const getColumns = (onEdit: (category: Category) => void): ColumnDef<Category>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                #{row.original.id}
            </span>
        ),
    },
    {
        accessorKey: "categorie_name",
        header: "Category Name",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                {row.original.categorie_name}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original;
            const [alertOpen, setAlertOpen] = useState(false);
            const [isDeleting, setIsDeleting] = useState(false);

            const handleConfirmDelete = () => {
                setIsDeleting(true);
                router.delete(`/categories/${category.id}`, {
                    onSuccess: () => {
                        toast.success("Category deleted successfully!");
                        setAlertOpen(false);
                        setIsDeleting(false);
                    },
                    onError: () => {
                        toast.error("Failed to delete category");
                        setIsDeleting(false);
                    },
                });
            };

            return (
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-8 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <AlertDialogTrigger asChild>
                                    <button className="flex w-full cursor-pointer items-center px-2 py-1.5 text-red-600 text-sm outline-none">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </button>
                                </AlertDialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{category.categorie_name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex gap-2 justify-end">
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];