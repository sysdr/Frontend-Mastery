import React from 'react';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

interface Sale {
  id: number;
  product: string;
  amount: number;
  customer: string;
  time: string;
}

interface SalesReportProps {
  totalRevenue: number;
  onClose: () => void;
}

const SalesReport: React.FC<SalesReportProps> = ({ totalRevenue, onClose }) => {
  // Generate sample sales
  const sales: Sale[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    product: `Product ${String.fromCharCode(65 + (i % 5))}`,
    amount: Math.floor(Math.random() * 500) + 50,
    customer: `Customer ${i + 1}`,
    time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
  }));

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Text variant="heading2">Sales Report</Text>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
      <div className="mb-4">
        <Text variant="body" className="text-gray-600">
          Total Revenue Today: <span className="font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
        </Text>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(sale.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
