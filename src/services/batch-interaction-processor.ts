export class BatchInteractionProcessor {
  private static BATCH_INTERVAL = 1000 * 60 * 60; // 1 hour

  static async processPendingInteractions() {
    const interactionService = new InteractionService();
    const contractService = new PostContractService(
      walletClient,
      process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS!
    );

    // Get pending interactions
    const pendingInteractions = await interactionService.getPendingInteractions();
    
    if (pendingInteractions.length > 0) {
      // Submit batch to blockchain
      await contractService.batchSubmitInteractions(pendingInteractions);
      
      // Mark as processed
      await interactionService.markInteractionsAsProcessed(pendingInteractions);
    }
  }
}

// Start the batch processor
setInterval(
  BatchInteractionProcessor.processPendingInteractions,
  BatchInteractionProcessor.BATCH_INTERVAL
);