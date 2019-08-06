import _ from 'underscore';

export const getTableVariableName = (parserOutput) => {
  if (!parserOutput.text) {
    return '';
  }
  return _.first(parserOutput.text.split('\n')).split('=')[0];
};