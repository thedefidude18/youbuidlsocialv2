export function formatAmount(amount: number, currency: string): string {
  if (currency === "USD") {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  if (currency === "POINTS") {
    return `${amount.toLocaleString()} points`;
  }
  
  // For crypto currencies
  return `${amount} ${currency}`;
}

export function getNotificationIcon(type: string) {
  switch (type) {
    case "donation":
      return "gift"; // Use your icon system
    case "points":
      return "star"; // Use your icon system
    case "withdrawal":
      return "wallet"; // Use your icon system
    default:
      return null;
  }
}

export function getNotificationColor(type: string, status?: string) {
  switch (type) {
    case "donation":
      return "text-green-600 dark:text-green-400";
    case "points":
      return "text-purple-600 dark:text-purple-400";
    case "withdrawal":
      if (status === "completed") return "text-green-600 dark:text-green-400";
      if (status === "pending") return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    default:
      return "text-primary";
  }
}