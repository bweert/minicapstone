import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Category } from '@/types/pos';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Categories', href: '/categories' },
        { title: category.categorie_name, href: `/categories/${category.id}/edit` },
        { title: 'Edit', href: `/categories/${category.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        categorie_name: category.categorie_name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.categorie_name}`} />

            <div className="p-6 max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/categories">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
                        <p className="text-muted-foreground">Update category details</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                        <CardDescription>Modify the category details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="categorie_name">Category Name</Label>
                                <Input
                                    id="categorie_name"
                                    value={data.categorie_name}
                                    onChange={(e) => setData('categorie_name', e.target.value)}
                                    placeholder="Enter category name"
                                    className={errors.categorie_name ? 'border-red-500' : ''}
                                />
                                {errors.categorie_name && (
                                    <p className="text-sm text-red-500">{errors.categorie_name}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/categories">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Category
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
