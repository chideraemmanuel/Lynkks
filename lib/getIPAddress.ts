import axios from 'axios';

const getIPAddress = async () => {
  const response = await axios.get<{ ip: string }>(
    'https://api.ipify.org/?format=json'
  );

  return response.data.ip;
};

export default getIPAddress;
