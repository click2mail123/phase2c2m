import xmlParser from 'xml-js'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const convertXmltoJson = (xml, options) => {
  if (!options) {
    options = { compact: true, textKey: "text", ignoreDeclaration: true };
  }
  let result = xmlParser.xml2json(xml, options);
  let json = JSON.parse(result);
  return json;
}

export const formatDate = (format = "MM-DD-YYYY", date) => {
  const dateobj = new Date(date);

  let month = dateobj.getUTCMonth() + 1;
  if (month < 10)
    month = `0${month}`;

  let day = dateobj.getUTCDate();
  if (day < 10)
    day = `0${day}`;

  let year = dateobj.getUTCFullYear();

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    default:
      return ``;
  }
}
export const validateCreditCardNumber = (cardNumber) => {
  cardNumber = cardNumber.toString().trim().replace('-', '');
  let regX = /^[0-9- ]{13,19}$/;
  if (!(regX.test(cardNumber))) {
    return false;
  } else {
    return true;
  }
}

export const setCookies = (name, value) => {
  cookies.set(name, value);
};

export const getCookies = (name) => {
  return cookies.get(name);
};

export const removeCookies = (name) => {
  cookies.remove(name);
};