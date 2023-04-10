import _camelCase from 'lodash/camelCase';

function pascalCase(value: string) {
  let result = _camelCase(value);
  result = result[0].toUpperCase() + result.substring(1);
  return result;
}

export default pascalCase;
