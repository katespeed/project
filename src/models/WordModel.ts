import { AppDataSource } from '../dataSource';
import { Word } from '../entities/Word';

const wordRepository = AppDataSource.getRepository(Word);

async function getWordsByLanguageID(languageID: string): Promise<Word[] | null> {
  const words = await wordRepository
    .createQueryBuilder('words')
    .leftJoinAndSelect('words.languages', 'languages')
    .where('languages.languageID = :languageID', { languageID })
    .select(['words', 'languages.languageID'])
    .getMany();
  return words;
}

async function languageHasWord(word: string, languageID: string): Promise<boolean> {
  const reviewExists = await wordRepository
    .createQueryBuilder('words')
    .leftJoinAndSelect('words.languages', 'languages')
    .where('words.word = :word', { word })
    .andWhere('languages.languageID = :languageID', { languageID })
    .getExists();

  return reviewExists;
}

export { getWordsByLanguageID, languageHasWord };
