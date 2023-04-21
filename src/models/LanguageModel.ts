import { AppDataSource } from '../dataSource';
import { Languages } from '../entities/Language';
import { User } from '../entities/User';

const languageRepository = AppDataSource.getRepository(Languages);

async function addLanguage(language: string, byUser: User): Promise<Languages> {
  // Create the new Review object
  let newLanguage = new Languages();
  newLanguage.language = language;
  newLanguage.user = byUser;
  newLanguage = await languageRepository.save(newLanguage);
  return newLanguage;
}

async function getLanguageById(bookId: string): Promise<Languages | null> {
  return languageRepository
    .createQueryBuilder('languages')
    .leftJoinAndSelect('languages.user', 'user')
    .where('languageId = :languageId', { bookId })
    .getOne();
}

async function getLanguages(): Promise<Languages[]> {
  return languageRepository.find();
}

async function userHasLanguageForBook(userId: string, language: string): Promise<boolean> {
  const languageExists = await languageRepository
    .createQueryBuilder('languages')
    .leftJoinAndSelect('languages.user', 'user')
    .where('user.userId = :userId', { userId })
    .andWhere('languages.language = :language', { language })
    .getExists();

  return languageExists;
}

async function getLanguagesByUserId(userId: string): Promise<Languages[]> {
  const languages = await languageRepository
    .createQueryBuilder('languages')
    .leftJoinAndSelect('languages.user', 'user')
    .where('user.userId = :userId', { userId })
    .select(['languages', 'user.userId'])
    .getMany();
  return languages;
}

export { addLanguage, getLanguageById, getLanguages, getLanguagesByUserId, userHasLanguageForBook };
