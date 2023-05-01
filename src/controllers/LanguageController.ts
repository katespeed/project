import { Request, Response } from 'express';
import {
  addLanguage,
  // addLanguage,
  getLanguageById,
  getLanguages,
  getLanguagesByUserId,
  userHasLanguageForBook,
} from '../models/LanguageModel';
import { getUserById } from '../models/UserModel';

async function createLanguage(req: Request, res: Response): Promise<void> {
  // const { bookId } = req.params as { bookId: string };
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { language } = req.body as { language: string };
  const user = await getUserById(authenticatedUser.userId);

  if (!language || !user) {
    res.sendStatus(404);
    return;
  }

  const languageExists = await userHasLanguageForBook(authenticatedUser.userId, language);
  if (languageExists) {
    res.sendStatus(409); // 409 Conflict
    return;
  }

  const languages = await addLanguage(language, user);
  languages.user = undefined;

  //   res.status(201).json(languages);
  res.render('languagesPage', { languages });
}

async function getLanguage(req: Request, res: Response): Promise<void> {
  const { languageId } = req.params as { languageId: string };

  const language = await getLanguageById(languageId);

  if (!language) {
    res.sendStatus(404);
    return;
  }
  res.status(201).json(language);
}

async function getAllLanguages(req: Request, res: Response): Promise<void> {
  const languages = await getLanguages();
  // res.status(201).json(languages);
  res.render('languagesPage', { languages });
}

async function getUserLanguages(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  const languages = await getLanguagesByUserId(userId);

  // res.status(201).json(languages);
  res.render('languagesPage', { languages });
}

export { createLanguage, getLanguage, getAllLanguages, getUserLanguages };
