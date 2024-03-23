import axios from 'axios';

const APIKEY = process.env.NEXT_PUBLIC_IMBB_API_KEY;
const endPoints = {
  load: `https://api.imgbb.com/1/upload?&key=${APIKEY}`,
};
export async function saveImgToCloud(data) {
  const formData = new FormData();
  formData.append('image', data);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(endPoints.load, formData, config);
  return response.data.data.url;
}
