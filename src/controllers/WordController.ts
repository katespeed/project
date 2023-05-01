import { Request, Response } from 'express';
import {
  getWordsByLanguageID,
  languageHasWord,
  addWordToLibrary,
  libraryHasWord,
  getWordByWordID,
} from '../models/WordModel';
import { getLibraryById } from '../models/LibrariesModel';

async function makeSentence(req: Request, res: Response): Promise<void> {
  const { libraryId, languageId } = req.params as { libraryId: string; languageId: string };
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { word, worId } = req.body as { word: string; worId: string };

  const library = await getLibraryById(libraryId);

  if (!library) {
    res.sendStatus(404);
    return;
  }

  const wordExistsInLibrary = await libraryHasWord(word, libraryId);

  if (wordExistsInLibrary) {
    res.sendStatus(409);
    return;
  }

  const sentence = await addWordToLibrary(worId, languageId, word, library);
  sentence.library = undefined;

  res.redirect(`/library/${library.libraryId}`);
}

async function getAllWords(req: Request, res: Response): Promise<void> {
  const { languageId } = req.params as { languageId: string };

  const word = await getWordsByLanguageID(languageId);

  if (!word) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(word);
}

async function getWord(req: Request, res: Response): Promise<void> {
  const { worId } = req.params as { worId: string };

  const word = await getWordByWordID(worId);

  if (!word) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(word);
}

async function wordExists(req: Request, res: Response): Promise<void> {
  const { languageId, word } = req.params as { languageId: string; word: string };

  const existOrNot = await languageHasWord(languageId, word);
  if (!existOrNot) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200).json(existOrNot);
}

export { getAllWords, wordExists, makeSentence, getWord };
