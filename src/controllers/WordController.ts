import { Request, Response } from 'express';
import { getWordsByLanguageID, languageHasWord } from '../models/WordModel';

async function getWords(req: Request, res: Response): Promise<void> {
  const { languageID } = req.params as { languageID: string };

  const word = await getWordsByLanguageID(languageID);

  if (!word) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(word);
}

async function wordExists(req: Request, res: Response): Promise<void> {
  const { languageID, word } = req.params as { languageID: string; word: string };

  const existOrNot = await languageHasWord(languageID, word);
  if (!existOrNot) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200).json(existOrNot);
}

export { getWords, wordExists };
