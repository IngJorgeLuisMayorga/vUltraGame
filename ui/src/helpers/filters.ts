const filters = {
  price(input: number) {
    if (isNaN(input)) {
      return "-";
    }
    return "$" + input.toFixed(2);
  },
};
export default filters;
