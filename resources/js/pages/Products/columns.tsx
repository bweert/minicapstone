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

export type Product = {
    id: number;
    name: string;
    SKU: string;
    price: number;
    cost: number;
    stock_quantity: number;
    image?: string;
    category?: {
        id: number;
        categorie_name: string;
    };
};

export const getColumns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            row.original.image ? (
                <img
                    src={`/storage/${row.original.image}`}
                    alt={row.original.name}
                    className="h-10 w-10 object-cover rounded"
                />
            ) : (
                <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No image
                </div>
            )
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "SKU",
        header: "SKU",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `₱${parseFloat(row.original.price.toString()).toFixed(2)}`,
    },
    {
        accessorKey: "cost",
        header: "Cost",
        cell: ({ row }) => `₱${parseFloat(row.original.cost.toString()).toFixed(2)}`,
    },
    {
        accessorKey: "stock_quantity",
        header: "Stock",
    },
    {
        accessorKey: "category.categorie_name",
        header: "Category",
        cell: ({ row }) => row.original.category?.categorie_name || "—",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;
            const [alertOpen, setAlertOpen] = useState(false);
            const [isDeleting, setIsDeleting] = useState(false);
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const handleEdit = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Edit clicked for product:', product);
                setDropdownOpen(false);
                // Use setTimeout to ensure dropdown closes first
                setTimeout(() => {
                    onEdit(product);
                }, 100);
            };

            const handleConfirmDelete = () => {
                setIsDeleting(true);
                router.delete(`/products/${product.id}`, {
                    onSuccess: () => {
                        toast.success("Product deleted successfully!");
                        setAlertOpen(false);
                        setIsDeleting(false);
                        // Reload page to show updated data
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    },
                    onError: () => {
                        toast.error("Failed to delete product");
                        setIsDeleting(false);
                    },
                });
            };

            return (
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <div className="flex items-center text-yellow-500">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAlertOpen(true);
                                }}
                            >  <div className="flex items-center text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex gap-2 justify-end">
                            <AlertDialogCancel disabled={isDeleting}>
                                Cancel
                            </AlertDialogCancel>
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