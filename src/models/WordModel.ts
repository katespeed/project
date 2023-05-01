import { AppDataSource } from '../dataSource';
import { Word } from '../entities/Word';
import { Libraries } from '../entities/Libraries';

const wordRepository = AppDataSource.getRepository(Word);

async function addWordToLibrary(
  wordId: string,
  languageId: string,
  word: string,
  forLibrary: Libraries
): Promise<Word> {
  let newWord = new Word();
  newWord.worId = wordId;
  newWord.languageId = languageId;
  newWord.word = word;
  newWord.library = forLibrary;

  newWord = await wordRepository.save(newWord);

  return newWord;
}

async function getWordByWordID(wordId: string): Promise<Word | null> {
  const word = await wordRepository
    .createQueryBuilder('words')
    .where({ where: { wordId } })
    .leftJoin('words.library', 'library')
    .select([
      'words.worId',
      'words.word',
      'words.languageId',
      'library.libraryId',
      'library.languageId',
    ])
    .getOne();
  return word;
}

async function getWordsByLanguageID(languageId: string): Promise<Word[] | null> {
  const words = await wordRepository
    .createQueryBuilder('words')
    .leftJoinAndSelect('words.languages', 'languages')
    .where('languages.languageId = :languageId', { languageId })
    .select(['words', 'languages.languageId'])
    .getMany();
  return words;
}

async function languageHasWord(word: string, languageId: string): Promise<boolean> {
  const wordExists = await wordRepository
    .createQueryBuilder('words')
    .leftJoinAndSelect('words.languages', 'languages')
    .where('words.word = :word', { word })
    .andWhere('languages.languageId = :languageId', { languageId })
    .getExists();

  return wordExists;
}

async function libraryHasWord(word: string, libraryId: string): Promise<boolean> {
  const wordExists = await wordRepository
    .createQueryBuilder('words')
    .leftJoinAndSelect('words.library', 'library')
    .where('words.word = :word', { word })
    .andWhere('library.libraryId = :libraryId', { libraryId })
    .getExists();

  return wordExists;
}

export { getWordsByLanguageID, getWordByWordID, languageHasWord, addWordToLibrary, libraryHasWord };
