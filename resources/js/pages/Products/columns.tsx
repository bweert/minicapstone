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
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {row.original.name}
            </span>
        ),
    },
    {
        accessorKey: "SKU",
        header: "SKU",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                {row.original.SKU}
            </span>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                ₱{parseFloat(row.original.price.toString()).toFixed(2)}
            </span>
        ),
    },
    {
        accessorKey: "cost",
        header: "Cost",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                ₱{parseFloat(row.original.cost.toString()).toFixed(2)}
            </span>
        ),
    },
    {
        accessorKey: "stock_quantity",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.original.stock_quantity;
            const isLow = stock <= 10;
            
            return (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {stock}
                </span>
            );
        },
    },
    {
        accessorKey: "category.categorie_name",
        header: "Category",
        cell: ({ row }) => (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-cyan-100 text-cyan-700">
                {row.original.category?.categorie_name || "—"}
            </span>
        ),
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
                        toast.success("Product deleted successfully");
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
                            <Button className="h-8 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
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