import { Request, Response } from 'express';
import { getLibraryById, updateLibrary, libraryBelongsToUser } from '../models/LibrariesModel';
import { parseDatabaseError } from '../utils/db-utils';

async function libraryUpdate(req: Request, res: Response): Promise<void> {
  const { libraryId } = req.body as UpdateLibraryRequest;

  const { isLoggedIn, authenticatedUser } = req.session;

  const belongs = libraryBelongsToUser(libraryId, authenticatedUser.userId);

  if (!isLoggedIn || !belongs) {
    res.sendStatus(403);
    return;
  }

  const library = await getLibraryById(libraryId);

  if (!library) {
    res.sendStatus(404);
    return;
  }

  try {
    await updateLibrary(library);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function getLibrary(req: Request, res: Response): Promise<void> {
  const { libraryId } = req.params as { libraryId: string };

  const library = await getLibraryById(libraryId);

  const { isLoggedIn, authenticatedUser } = req.session;

  const belongs = libraryBelongsToUser(libraryId, authenticatedUser.userId);

  if (!isLoggedIn || !belongs) {
    res.sendStatus(403);
    return;
  }

  if (!library) {
    res.sendStatus(401);
    return;
  }

  res.sendStatus(200).json(library);
}

export { libraryUpdate, getLibrary };
