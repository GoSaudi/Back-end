export default (code) => {
  const successRegex = /^(000\.000\.|000\.100\.1|000\.[36]|000\.400\.[1][12]0)/;
  const successWManualRegex = /^(000.400.0[^3]|000.400.100)/;

  const pendingRegex = /^(000\.200)/;
  const pendingSeveralDaysRegex = /^(800\.400\.5|100\.400\.500)/;
  // return regex.test(input);

  if (successRegex.test(code) || successWManualRegex.test(code)) {
    return "success";
  } else if (pendingRegex.test(code) || pendingSeveralDaysRegex.test(code)) {
    return "pending";
  } else if (code) {
    return "rejected";
  } else {
    return null;
  }
};
