import { AppDataSource } from '../dataSource';
import { Libraries } from '../entities/Libraries';

const libraryRepository = AppDataSource.getRepository(Libraries);

async function getLibraryById(libraryId: string): Promise<Libraries | null> {
  const library = await libraryRepository
    .createQueryBuilder('library')
    .leftJoinAndSelect('library.user', 'user')
    .leftJoinAndSelect('library.languages', 'languages')
    .where('library.libraryId = :libraryId', { libraryId })
    .getOne();

  return library;
}

async function updateLibrary(library: Libraries): Promise<Libraries> {
  const updatedLibrary = library;
  updatedLibrary.wordCount += 1;
  await libraryRepository
    .createQueryBuilder()
    .update(Libraries)
    .set({ wordCount: updatedLibrary.wordCount })
    .where({ libraryId: updatedLibrary.libraryId });
  return updatedLibrary;
}

async function libraryBelongsToUser(libraryId: string, userId: string): Promise<boolean> {
  const libraryExists = await libraryRepository
    .createQueryBuilder('library')
    .leftJoinAndSelect('library.user', 'user')
    .where({ library: { libraryId } })
    .andWhere({ user: { userId } })
    .getExists();

  return libraryExists;
}

export { getLibraryById, updateLibrary, libraryBelongsToUser };
