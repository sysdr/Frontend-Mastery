export const generateMockData = (count = 1000) => {
  const data = [];
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Karen", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tina"];
  const statuses = ["Active", "Inactive", "Pending", "Suspended", "Trial"];
  const domains = ["example.com", "test.org", "demo.net", "corp.io", "tech.co"];

  for (let i = 1; i <= count; i++) {
    const nameIndex = Math.floor(Math.random() * names.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const domainIndex = Math.floor(Math.random() * domains.length);
    const randomDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5);

    data.push({
      id: i,
      name: `${names[nameIndex]} User ${i}`,
      email: `user${i}@${domains[domainIndex]}`,
      status: statuses[statusIndex],
      createdAt: randomDate.toISOString().split('T')[0],
      value: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
      category: `Category ${Math.floor(Math.random() * 5) + 1}`
    });
  }
  return data;
};
