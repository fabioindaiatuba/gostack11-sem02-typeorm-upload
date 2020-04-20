import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type. (income | outcome)');
    }
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('Outcomes greater than incomes');
    }
    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
