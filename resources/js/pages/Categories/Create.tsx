import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/categories' },
    { title: 'Create', href: '/categories/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        categorie_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            <div className="p-6 max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/categories">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Category</h1>
                        <p className="text-muted-foreground">Add a new category to organize your products</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                        <CardDescription>Enter the details for the new category</CardDescription>
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
                                    Create Category
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
