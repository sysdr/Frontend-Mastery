// src/api/metrics.ts
interface Metric {
  id: string;
  name: string;
  value: string;
  status: 'active' | 'inactive';
}

const METRICS_DATA: Metric[] = [
  { id: 'm1', name: 'CPU Usage', value: '75%', status: 'active' },
  { id: 'm2', name: 'Memory Usage', value: '80%', status: 'active' },
  { id: 'm3', name: 'Network Latency', value: '12ms', status: 'active' },
  { id: 'm4', name: 'Disk I/O', value: '50MB/s', status: 'inactive' },
];

export const fetchAllMetrics = async (): Promise<Metric[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[API] Fetched all metrics.");
      resolve(METRICS_DATA);
    }, 500); // Simulate network delay
  });
};

export const fetchMetricById = async (id: string): Promise<Metric | undefined> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const metric = METRICS_DATA.find(m => m.id === id);
      if (metric) {
        console.log(`[API] Fetched metric by ID: ${id}`);
        resolve(metric);
      } else {
        console.error(`[API] Metric not found for ID: ${id}`);
        reject(new Error('Metric not found'));
      }
    }, 300);
  });
};

export const updateMetricStatus = async ({ id, status }: { id: string; status: 'active' | 'inactive' }): Promise<Metric> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const metricIndex = METRICS_DATA.findIndex(m => m.id === id);
      if (metricIndex > -1) {
        METRICS_DATA[metricIndex].status = status;
        console.log(`[API] Successfully updated metric ${id} status to ${status}.`);
        resolve(METRICS_DATA[metricIndex]);
      } else {
        console.error(`[API] Metric not found for update ID: ${id}`);
        reject(new Error('Metric not found for update'));
      }
    }, 700); // Simulate API processing delay
  });
};
