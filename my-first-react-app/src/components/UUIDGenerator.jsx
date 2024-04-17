// generator for unique ids; used for key value and ids of new objects
export const generateUUID = () => {
  let uuid = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

  for (let i = 0; i < 25; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    }
    uuid += chars[randomNumber];
  }
  return uuid;
};
