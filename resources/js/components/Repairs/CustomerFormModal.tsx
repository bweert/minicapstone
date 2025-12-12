import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customerId: number) => void;
  csrf_token: string;
}

export function CustomerFormModal({ open, onOpenChange, onSuccess, csrf_token }: CustomerModalProps) {
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
          'X-CSRF-Token': csrf_token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          toast.error(data.message || 'Failed to create customer');
        }
        setIsLoading(false);
        return;
      }

      toast.success('Customer created successfully');
      setFormData({
        name: '',
        address: '',
        brand: '',
        unit: '',
        problem: '',
      });
      onOpenChange(false);
      onSuccess(data.data.id);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Repair - Customer Info</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Customer Name *</label>
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
            <label className="block text-sm font-semibold mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter customer address"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Device Brand */}
          <div>
            <label className="block text-sm font-semibold mb-1">Device Brand *</label>
            <Input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., iPhone, Samsung"
              required
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>

          {/* Device Model/Unit */}
          <div>
            <label className="block text-sm font-semibold mb-1">Device Model/Unit *</label>
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
            <label className="block text-sm font-semibold mb-1">Problem Description *</label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="Describe the issue"
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            {errors.problem && <p className="text-red-500 text-sm mt-1">{errors.problem}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Creating...' : 'Next - Services'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
