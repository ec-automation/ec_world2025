// dispatcher.js
import * as company from './handlers/company.js';

const dispatcher = {
  'create-company': company.create,
};

export default dispatcher;
