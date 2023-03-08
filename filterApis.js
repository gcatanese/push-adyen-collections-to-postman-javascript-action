import * as path from "path";

/**
 * This is a pretty specific function.
 * Given a list of filenames in a ./a/folder/filename-v23 format that may contain many filenames with different versions,
 * it will return a list of filenames with only the highest version of each filename.
 * For example, given
 *
 * ["../adyen-postman/postman/BinLookupService-v39.json",
 * "../adyen-postman/postman/BinLookupService-v40.json",
 * "../adyen-postman/postman/BinLookupService-v42.json",
 * ["../adyen-postman/postman/CheckoutService-v70.json"]
 *
 * , the function will return
 *
 * ["../adyen-postman/postman/BinLookupService-v42.json",
 * ["../adyen-postman/postman/CheckoutService-v70.json"]
 *
 * @constructor
 * @param {Array.<string>} filenames a list of filenames, including path and extension
 * @param {Array.<string>} filenames with only the highest version of each filename
 */
export function filenamesToSet(filenames){

    const clearerApis = filenames.map((filename) => {
        return {
            "path" :filename,
            "name" : path.parse(filename).name,
            "root" : path.parse(filename).name.split("-")[0],
            "version" : path.parse(filename).name.split("-v")[1],
        }
    });

    const groupsOfApis = _groupBy(clearerApis, "root");
    const highestVersions = Object.values(groupsOfApis).map((value) => {
        return value.reduce(
            (prev, current) => {
                return prev.version > current.version ? prev : current
            });
    });

    return highestVersions.map((value) => { return value.path});;
}


/**
 * Group an array of objects using the given key
 * @param {Array} xs an array of objects
 * @param {String} key the key to group by
 * @returns {Object} an object with each key being the value of the given key used to group by, and the value being an array of objects with that key
 * @private
 *
 *  @example
 *  // returns {"3": ["one", "two"], "5": ["three"]}
 *  groupBy(['one', 'two', 'three'], 'length')
 *
 *  Thank you https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects!
 */
function _groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}