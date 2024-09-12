const generateOTP = () => {
  // const length = 6;
  // let otp = '';

  // for (let i = 0; i < length; i++) {
  //   otp += Math.floor(Math.random() * 10);
  // }

  const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  return otp.toString();
};

export default generateOTP;
