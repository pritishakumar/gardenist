const { BadRequestError } = require('../expressError');
/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: the list of columns you want to update
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */
function sqlForPartialUpdate(table, items, searchKey, keyArray, returnVal) {
  let idx = 1;
  let columns = [];

  // filter out keys that are not allowed
  for (let key in items) {
    if (!keyArray.includes(key)) {
      throw new BadRequestError(`${key} field is not permitted for update`, 401)
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx++;
  }

  // build query
  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols} WHERE ${searchKey.key}=$${idx} RETURNING ${returnVal}`;

  let values = Object.values(items);
  values.push(searchKey.value);

  return {query, values};
}


module.exports = sqlForPartialUpdate;
