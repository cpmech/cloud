// formatLongNumber formats number 1000000 to 1,234,567
export const formatLongNumber = (n: string, comma = ',') => {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, comma);
};

// formatValue appends prefix to value and fixes decimal side
// ref: https://codepen.io/559wade/pen/LRzEjj
export const formatNumber = (
  inputVal: string,
  swapDotByComma = false,
  numDigits = 2,
  prefix: string = '',
) => {
  // don't validate empty input
  if (!inputVal) {
    return '';
  }

  // constants
  const point = swapDotByComma ? ',' : '.';
  const comma = swapDotByComma ? '.' : ',';

  // check for decimal
  if (inputVal.indexOf(point) >= 0) {
    // get position of last decimal. this prevents multiple decimals from being entered
    const decimalPos = inputVal.indexOf(point);

    // split number by decimal point
    let leftSide = inputVal.substring(0, decimalPos).replace(/\D/g, '');
    let rightSide = inputVal.substring(decimalPos).replace(/\D/g, '');

    // handle left = 0
    if (leftSide.length === 0) {
      leftSide += '0';
    } else {
      if (Number(leftSide) === 0) {
        leftSide = '0';
      }
    }

    // add commas to left side of number
    leftSide = formatLongNumber(leftSide, comma);

    // Limit decimal to only numDigits digits
    rightSide = rightSide.substring(0, numDigits);

    // join number by "point"
    inputVal = prefix + leftSide + point + rightSide;
  } else {
    // no decimal entered./ add commas to number and remove all non-digits
    inputVal = formatLongNumber(inputVal, comma);
    inputVal = prefix + inputVal;
  }

  // results
  return inputVal;
};

export const cleanNumber = (
  formattedValue: string,
  swapDotByCommaInTheInput: boolean = false, // the output is always dot
  prefix: string = '',
) => {
  // get inputVal
  let inputVal = formattedValue.replace(prefix, '').trim();

  // skip empty input
  if (!inputVal) {
    return '';
  }

  // constants
  const point = swapDotByCommaInTheInput ? ',' : '.';

  // check for decimal
  if (inputVal.indexOf(point) >= 0) {
    // get position of last decimal
    const decimalPos = inputVal.indexOf(point);

    // split number by decimal point
    const leftSide = inputVal.substring(0, decimalPos).replace(/\D/g, '');
    const rightSide = inputVal.substring(decimalPos).replace(/\D/g, '');

    // join number by "."
    inputVal = leftSide + '.' + rightSide;
  } else {
    inputVal = inputVal.replace(/\D/g, '');
  }

  // results
  return inputVal;
};
