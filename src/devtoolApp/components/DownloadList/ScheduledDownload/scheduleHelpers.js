// Helpers para programación y simulación de descargas

export function calculateScheduleTimeHelper(scheduleType, delayMinutes, scheduleTime, recurringInterval) {
  const now = new Date();
  switch (scheduleType) {
    case 'immediate':
      return now;
    case 'delay':
      return new Date(now.getTime() + delayMinutes * 60000);
    case 'time': {
      const [hours, minutes] = scheduleTime.split(':');
      const scheduled = new Date();
      scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      return scheduled;
    }
    case 'recurring':
      switch (recurringInterval) {
        case 'hourly':
          return new Date(now.getTime() + 60 * 60000);
        case 'daily':
          return new Date(now.getTime() + 24 * 60 * 60000);
        case 'weekly':
          return new Date(now.getTime() + 7 * 24 * 60 * 60000);
        case 'monthly':
          return new Date(now.getTime() + 30 * 24 * 60 * 60000);
        default:
          return now;
      }
    default:
      return now;
  }
}

export async function processQueueHelper(downloadQueue, batchSize, setDownloadQueue, setProcessingStats, setIsProcessing) {
  if (!downloadQueue.length) return;
  setIsProcessing(true);
  const batch = downloadQueue.slice(0, batchSize);
  for (const item of batch) {
    try {
      setDownloadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDownloadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'completed', completedAt: new Date() } : q));
      setProcessingStats(prev => ({ ...prev, completed: prev.completed + 1, remaining: prev.remaining - 1 }));
    } catch (error) {
      setDownloadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: error.message } : q));
      setProcessingStats(prev => ({ ...prev, failed: prev.failed + 1, remaining: prev.remaining - 1 }));
    }
  }
  setTimeout(() => {
    setDownloadQueue(prev => prev.filter(item => !['completed', 'error'].includes(item.status) || Date.now() - item.completedAt?.getTime() < 5000));
  }, 5000);
  setIsProcessing(false);
}
