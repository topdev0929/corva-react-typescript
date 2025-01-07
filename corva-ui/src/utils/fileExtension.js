import fileExtension from 'file-extension';
import imageExtensions from 'image-extensions';
import videoExtensions from 'video-extensions';

export const getFileExtension = fileName => fileExtension((fileName || '').split('?')[0]);

export const getIsVideo = fileName => videoExtensions.includes(getFileExtension(fileName));

export const getIsImage = fileName => imageExtensions.includes(getFileExtension(fileName));

const OFFICE_FILE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const getWebViewType = fileName =>
  OFFICE_FILE_EXTENSIONS.includes(getFileExtension(fileName)) ? 'office' : 'google';
