export const forceFileDownload = async (fileName, attachmentUrl) => {
  const link = document.createElement('a');
  link.href = attachmentUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
