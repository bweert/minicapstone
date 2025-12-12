import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';

export default function CreateCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    brand: '',
    unit: '',
    problem: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        return;
      }

      // Redirect to services selection page with customer ID
      router.get(`/services?customer_id=${data.data.id}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="New Repair - Customer Info">
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">New Repair</h1>
            <p className="text-gray-600">Enter customer and device information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Customer Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter customer address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Device Brand */}
            <div>
              <label className="block text-sm font-semibold mb-2">Device Brand *</label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., iPhone, Samsung, Huawei"
                required
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            {/* Device Model/Unit */}
            <div>
              <label className="block text-sm font-semibold mb-2">Device Model/Unit *</label>
              <Input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., iPhone 13, Galaxy A52"
                required
              />
              {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
            </div>

            {/* Problem */}
            <div>
              <label className="block text-sm font-semibold mb-2">Problem Description *</label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Describe the issue with the device"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.problem && <p className="text-red-500 text-sm mt-1">{errors.problem}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Processing...' : 'Next - Select Services'}
              </Button>
              <Link href="/pos">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
