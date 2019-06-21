class Utils {
  static oneLineString(string) {
    return string.replace(/\n/g, ' ');
  }

  static constructQuery(filter = {}) {
    const searchParams = [];
    let search = '';
    let count = 0;
    Object.entries(filter).forEach(([key, value]) => {
      if (!value) {
        return;
      }

      if (count === 0) {
        search += 'WHERE ';
      }

      if (count > 0) {
        search += ' AND ';
      }

      search += `${key} = $${(count += 1)}`;
      searchParams.push(value);
    });

    return {
      noOfParams: count,
      search,
      searchParams,
    };
  }
}
export default Utils;
