// const moment = require('moment');

// module.exports = {
//   oldPaginatedList(cache, cacheKey, propertyList, req, res) {
//     let data = cache.get(cacheKey);
//     let dataList = data[propertyList];
//     data.totalResults = dataList.length;
//     // Check if there is any query param to order, filter or paginate
//     if (Object.entries(req.query).length > 0) {
//       this.oldOrderBy(dataList, req);
//       dataList = this.olderfilter(dataList, req);

//       // Set total results, limit and offset
//       data.totalResults = dataList.length;
//       data.limit = Number(req.query.limit);
//       data.offset = Number(req.query.offset);

//       dataList = this.oldPaginate(dataList, req);
//     }

//     // Set result list into its place
//     data[propertyList] = dataList;
//     res.send(data);
//   },

//   sendSimpleJSON(cache, cacheKey, res) {
//     let data = cache.get(cacheKey);
//     res.send(data);
//   },

//   sendStatus(res, status) {
//     res.statusCode = status;
//     res.send();
//   },

//   // Order by
//   oldOrderBy(data, req) {
//     if (req.query.orderBy) {
//       const sort = req.query.orderBy;
//       const orderByDirection = req.query.orderByDirection;
//       JSON.stringify(data.sort(this.dynamicSort(sort, orderByDirection)));
//     }
//   },

//   oldPaginate(data, req) {
//     const limit = Number(req.query.limit) || 10;
//     const offset = Number(req.query.offset) || 0;

//     data = data.slice(offset, offset + limit);

//     return data;
//   },

//   olderfilter(data, req) {
//     let propertToFilter;
//     let propertToFilterValue;
//     let elementsMatching = [];
//     const isExactString = false;

//     // Extract keyname
//     Object.entries(req.query).forEach(([key, value]) => {
//       if (
//         key != 'offset' &&
//         key != 'limit' &&
//         key != 'orderBy' &&
//         key != 'orderByDirection' &&
//         key != 'customerCode' &&
//         key != 'customerGroupCode'
//       ) {
//         propertToFilter = key;
//         propertToFilterValue = value;
//         if (!propertToFilterValue) {
//           return false;
//         }
//         console.log(`Searching for ${propertToFilterValue} in property ${propertToFilter}`);
//         if (isIterable(data)) {
//           for (let element of data) {
//             let propertyValueInData = findPropertyValue(element, propertToFilter);
  
//             if (!propertyValueInData || propertyValueInData === null) {
//               data = elementsMatching;
//               elementsMatching = [];
//               return data;
//             }
            
//             // String or array of strings
//             if (propertToFilterValue.includes('*')) {
//               let valueSearch = propertToFilterValue.replace(new RegExp('\\*', 'g'), '');
  
//               if (!Array.isArray(propertyValueInData)) {
//                 propertyValueInData = [propertyValueInData];
//               }
           
//               propertyValueInData = propertyValueInData.map((element) => {
//                 if (element) {
//                   return element.toLowerCase();
//                 }
//               });
  
//               valueSearch = valueSearch.replace(/\*/g, '').toLowerCase(); // delete all *
  
//               if (!isExactString) {
//                 const match = propertyValueInData.find((element) => {
//                   if (element.includes(valueSearch)) {
//                     return true;
//                   }
//                 });
//                 // return match?.length > 0 ? true : false;
//                 if (match?.length) {
//                   elementsMatching.push(element);
//                 }
//               }
//               if (propertyValueInData?.length && propertyValueInData.includes(valueSearch)) {
//                 // elementsMatching.push(element);
//               }
  
//               // Date
//             } else if (propertToFilterValue.includes('/')) {
//               var dateString = propertyValueInData.includes('/')
//                 ? propertyValueInData
//                 : moment.unix(propertyValueInData / 1000).format('DD/MM/YYYY');
  
//               if (dateString == propertToFilterValue) {
//                 elementsMatching.push(element);
//               }
  
//               // list of values
//             } else if (propertToFilterValue.includes(',')) {
//               const arrayValues = propertToFilterValue.split(',');
//               if (arrayValues.indexOf(propertyValueInData) > -1) {
//                 elementsMatching.push(element);
//               }
  
//               // Boolean
//             } else if (propertToFilterValue === 'true' || propertToFilterValue === 'false') {
//               const propertToFilterValueBoolean = propertToFilterValue === 'true';
//               if (propertyValueInData === propertToFilterValueBoolean) {
//                 elementsMatching.push(element);
//               }
//             }
  
//             // Number
//             else if (propertToFilterValue == propertyValueInData) {
//               elementsMatching.push(element);
//             }
//           }
//         }

//         data = elementsMatching;
//         elementsMatching = [];
//       }
//     });

//     return data;
//   },

//   standardList(cache, key, req, res) {
//     let data = cache.get(key);
//     this.orderBy(data, req);
//     data = this.filter(data, req);
//     res.set('X-Total-Count', data.length);
//     data = this.paginate(data, req);
//     res.send(data);
//   },

//   paginate(data, req) {
//     const size = req.query.size || 10;
//     const page = req.query.page || 0;
//     data = data.slice(page * size, Number(page * size) + Number(size));

//     return data;
//   },

//   filter(data, req) {
//     let propertToFilter;
//     let propertToFilterValue;
//     let elementsMatching = [];

//     // Extract keyname
//     Object.entries(req.query).forEach(([key, value]) => {
//       if (key != 'page' && key != 'size' && key != 'sort' && !key.endsWith('.dir')) {
//         propertToFilter = key;
//         propertToFilterValue = value;

//         console.log(`Searching for ${propertToFilterValue} in property ${propertToFilter}`);

//         for (let element of data) {
//           const propertyValueInData = findPropertyValue(element, propertToFilter);

//           // String
//           if (propertToFilterValue.includes('*')) {
//             const valueSearch = propertToFilterValue.replace(new RegExp('\\*', 'g'), '');
//             if (propertyValueInData?.includes(valueSearch)) {
//               elementsMatching.push(element);
//             }

//             // Date
//           } else if (propertToFilterValue.includes('/')) {
//             var dateString = moment.unix(valueFound / 1000).format('DD/MM/YYYY');
//             if (dateString == propertToFilterValue) {
//               elementsMatching.push(element);
//             }

//             // list of values
//           } else if (propertToFilterValue.includes(',')) {
//             const arrayValues = propertToFilterValue.split(',');
//             if (arrayValues.indexOf(propertyValueInData) > -1) {
//               elementsMatching.push(element);
//             }

//             // Boolean
//           } else if (propertToFilterValue === 'true' || propertToFilterValue === 'false') {
//             const propertToFilterValueBoolean = propertToFilterValue === 'true';
//             if (propertyValueInData === propertToFilterValueBoolean) {
//               elementsMatching.push(element);
//             }
//           }

//           // Number
//           else if (propertToFilterValue == propertyValueInData) {
//             elementsMatching.push(element);
//           }
//         }

//         data = elementsMatching;
//         elementsMatching = [];
//       }
//     });

//     return data;
//   },

//   // Order by
//   orderBy(data, req) {
//     if (req.query.sort) {
//       const sort = req.query.sort;
//       const orderByDirection = req.query[`${sort}.dir`] || 'ASC';
//       JSON.stringify(data.sort(this.dynamicSort(sort, orderByDirection)));
//     }
//   },

//   /**
//    *  Sort properties of objects. If a property is compound, indicate it with a period. Example: 'createdBy.name'
//    * @param {string} property Example: simple: 'createdBy'.  complex: 'createdBy.name'
//    * @param {string} direction 'ASC' or 'DESC'
//    * @returns 
//    */
//   dynamicSort(property, direction) {
//     var sortOrder = 1;
//     if (direction === 'DESC') {
//       sortOrder = -1;
//       //property = property.substr(1);
//     }
//     return function (a, b) {
//       let result;
//       if(property.indexOf('.')>-1){
//         const ca =a[property.split('.')[0]][property.split('.')[1]];
//         const cb =b[property.split('.')[0]][property.split('.')[1]]; 
//         result =  ca < cb ? -1 : ca > cb ? 1 : 0;
//       }else {
//         result =  a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
//       }
     
//       return result * sortOrder;
//     };
//   },

//   /**
//    * check if date valueString (string or string[]) is between fromStr and toStr.
//    * Example:
//    * 
//    * 
//     if (req.query.creationDateFrom) {
//         data.missingHeaders = data.missingHeaders.filter((d) => {
//           return utils.filterDate(d.creationDate, req.query.creationDateFrom, req.query.creationDateTo);
//         });
//         delete req.query.creationDateFrom;
//         delete req.query.creationDateTo;
//      }
//    * @param {string|string[]} valueString
//    * @param {string} fromStr
//    * @param {string} toString
//    * @returns boolean
//    */
//   filterDate(valueString, fromStr, toStr) {
//     const fromDate = new Date(fromStr);
//     const toDate = new Date(toStr);
//     let valueDate = [];
//     if (Array.isArray(valueString)) {
//       valueString.forEach((d) => {
//         if (!(d instanceof Date)) {
//           return false;
//         }
//       });
//       valueDate = [...valueString];
//     } else {
//       valueDate = [valueString];
//     }
//     result = false;
//     valueDate.forEach((vDate) => {
//       vDate = new Date(vDate);
//       if (fromDate instanceof Date && (toDate instanceof Date || toDate === undefined)) {
//         const resultToDate = toStr === undefined || moment(toDate) >= moment(vDate) ? true : false;
//         const resultFromDate =
//           (toStr === undefined && moment(fromDate).isSame(moment(vDate), 'day')) ||
//           (toStr !== undefined && moment(fromDate) <= moment(vDate))
//             ? true
//             : false;
//         if (resultFromDate && resultToDate) {
//           result = true;
//         }
//       }
//     });
//     return result;
//   },
//   /**
//    * used in function uniq. Returns unique array of objects
//    * @param {array} arr 
//    * @param {property} key 
//    * @returns array
//    * 
//    * Example:
//      data.missingHeaders = data.missingHeaders.map((o) => {
//        o.missingInvoices = getUniqueListBy(o.missingInvoices, 'invoiceNumber');
//        return o;
//      });
//    */
//   getUniqueListBy(arr, key) {
//     return [...new Map(arr.map((item) => [item[key], item])).values()];
//   },

//   /**
//    * deletes all repeated objects in an array, searching by the property supplied.
//    *
//    * @param {object} obj object that contain the array
//    * @param {array} arr array to search
//    * @param {string} key Property of the object to be deleted
//    * @returns object
//    *
//    * Example:
//    *
//    * data.missingHeaders = uniq(data.missingHeaders,'missingInvoices','invoiceNumber');
//    *
//    */
//   uniq(obj, arr, key) {
//     return (obj = obj.map((o) => {
//       o[arr] = this.getUniqueListBy(o[arr], key);
//       return o;
//     }));
//   },
//   /**
//    * return boolean if string is in array.
//    * @param {array} array
//    * @param {string} string
//    * @param {boolean} isExactString  default is true. If only want contains: false
//    * @returns
//    */
//   isContainStringInArray(array, string, isExactString = true) {
//     if (!Array.isArray(array)) {
//       array = [array];
//     }
//     array = array.map((element) => {
//       return element.toLowerCase();
//     });
//     string = string.replace(/\*/g, '').toLowerCase(); // delete all *

//     if (!isExactString) {
//       const match = array.find((element) => {
//         if (element.includes(string)) {
//           return true;
//         }
//       });
//       return match?.length > 0 ? true : false;
//     }
//     if (array?.length) {
//       return array.includes(string);
//     }
//   }
// };

// // PRIVATE functions
// function findPropertyValue(object, name) {
//   if (name in object) return object[name];
//   for (key in object) {
//     if (typeof object[key] == 'object') {
//       var t = findPropertyValue(object[key], name);
//       if (t) return t;
//     }
//   }
//   return null;
// }

// /**
//  * Determine whether the given `input` is iterable.
//  *
//  * @returns {Boolean}
//  */
// function isIterable(input) {  
//   if (input === null || input === undefined) {
//     return false
//   }

//   return typeof input[Symbol.iterator] === 'function'
// }
