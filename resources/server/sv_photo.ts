import events from '../utils/events';
import { getSource } from './server';
import { pool } from './db';
import { useIdentifier } from './functions';
import { IPhoto } from '../../phone/src/common/typings/photo';
import { mainLogger } from './sv_logger';

const photoLogger = mainLogger.child({ module: 'photo' });

async function uploadPhoto(identifier: string, image: string) {
  const query =
    'INSERT INTO npwd_phone_gallery (identifier, image) VALUES (?, ?)';
  await pool.query(query, [identifier, image]);
}

async function getPhotosByIdentifier(identifier: string): Promise<IPhoto[]> {
  const query =
    'SELECT id, image FROM npwd_phone_gallery WHERE identifier = ? ORDER BY id DESC';
  const [results] = await pool.query(query, [identifier]);
  const photos = <IPhoto[]>results;
  return photos;
}

async function deletePhoto(photo: IPhoto, identifier: string) {
  const query =
    'DELETE FROM npwd_phone_gallery WHERE id = ? AND identifier = ?';
  await pool.query(query, [photo.id, identifier]);
}

onNet(events.CAMERA_UPLOAD_PHOTO, async (image: string) => {
  try {
    const pSource = (global as any).source;
    const identifier = await useIdentifier();
    await uploadPhoto(identifier, image);
    emitNet(events.CAMERA_UPLOAD_PHOTO_SUCCESS, pSource);
  } catch (e) {
    photoLogger.error(`Failed to upload photo, ${e.message}`);
  }
});

onNet(events.CAMERA_FETCH_PHOTOS, async () => {
  const identifier = await useIdentifier();
  const photos = await getPhotosByIdentifier(identifier);
  emitNet(events.CAMERA_SEND_PHOTOS, getSource(), photos);
});

onNet(events.CAMERA_DELETE_PHOTO, async (photo: IPhoto) => {
  try {
    const identifier = await useIdentifier();
    await deletePhoto(photo, identifier);
    emitNet(events.CAMERA_DELETE_PHOTO_SUCCESS, getSource());
  } catch (e) {
    photoLogger.error(`Failed to fetch photos, ${e.message}`);
  }
});
