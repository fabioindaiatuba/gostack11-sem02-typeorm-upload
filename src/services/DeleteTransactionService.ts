import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('Invalid id format');
    }
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
