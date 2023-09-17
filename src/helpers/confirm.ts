import {keypress} from './keypress';

export const confirm = async(s?: string) => {
  const char = await keypress(s);
  console.log(char);

  if (char === 'Y' || char === 'y') {
    return true;
  }
  return false;
};
