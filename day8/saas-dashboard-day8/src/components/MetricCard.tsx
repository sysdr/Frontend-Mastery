// src/components/MetricCard.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMetricStatus } from '../api/metrics';

interface Metric {
  id: string;
  name: string;
  value: string;
  status: 'active' | 'inactive';
}

interface MetricCardProps {
  metric: Metric;
}

function MetricCard({ metric }: MetricCardProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateMetricStatus,
    onMutate: async (newStatusData) => {
      console.log(`[UI] Optimistically updating metric ${newStatusData.id} status to ${newStatusData.status}...`);
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['metrics', newStatusData.id] });
      await queryClient.cancelQueries({ queryKey: ['metrics'] }); // Also cancel the list query

      // 2. Snapshot the previous value
      const previousMetric = queryClient.getQueryData<Metric>(['metrics', newStatusData.id]);
      const previousAllMetrics = queryClient.getQueryData<Metric[]>(['metrics']);

      // 3. Optimistically update the individual metric cache
      queryClient.setQueryData<Metric>(['metrics', newStatusData.id], (old) => {
        if (!old) return previousMetric; // Fallback if data somehow missing
        return { ...old, status: newStatusData.status };
      });

      // 4. Optimistically update the all metrics list cache
      queryClient.setQueryData<Metric[]>(['metrics'], (old) => {
        if (!old) return previousAllMetrics;
        return old.map(m => m.id === newStatusData.id ? { ...m, status: newStatusData.status } : m);
      });

      // 5. Return a context object with the snapshotted value
      return { previousMetric, previousAllMetrics };
    },
    onError: (err, newStatusData, context) => {
      console.error(`[UI] Failed to update metric ${newStatusData.id}. Reverting UI. Error: ${err.message}`);
      // If the mutation fails, use the context to roll back
      if (context?.previousMetric) {
        queryClient.setQueryData<Metric>(['metrics', newStatusData.id], context.previousMetric);
      }
      if (context?.previousAllMetrics) {
        queryClient.setQueryData<Metric[]>(['metrics'], context.previousAllMetrics);
      }
      // In a real app, you'd show a toast notification here
    },
    onSettled: (_data, _error, variables) => {
      console.log(`[UI] Mutation for metric ${variables.id} settled.`);
      // Invalidate and refetch after error or success to ensure server state is reflected
      queryClient.invalidateQueries({ queryKey: ['metrics', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] }); // Invalidate all metrics if this affects a list
    },
  });

  const handleToggleStatus = () => {
    const newStatus = metric.status === 'active' ? 'inactive' : 'active';
    mutation.mutate({ id: metric.id, status: newStatus });
  };

  return (
    <div className={`metric-card status-${metric.status}`}>
      <h3>{metric.name}</h3>
      <p>Value: {metric.value}</p>
      <p>Status: <span className="status-text">{metric.status.toUpperCase()}</span></p>
      <button onClick={handleToggleStatus} disabled={mutation.isPending}>
        {mutation.isPending ? 'Updating...' : `Toggle to ${metric.status === 'active' ? 'INACTIVE' : 'ACTIVE'}`}
      </button>
      {mutation.isError && <p className="error-message">Error: {mutation.error?.message || 'Failed to update.'}</p>}
    </div>
  );
}

export default MetricCard;
