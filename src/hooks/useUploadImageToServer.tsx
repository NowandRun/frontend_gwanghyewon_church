import axios from 'axios';

export const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('http://localhost:4000/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.url;
};
