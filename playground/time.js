const moment = require('moment');

// January 1st 1970 00:00:00 am

var date = moment();

var locale = moment();
locale.locale('pl');
console.log(locale.format('Do MMMM MMMM, h:m'));
//date.add(1, 'years').subtract(9, 'months');
//console.log(date.format('MMMM Do, YYYY'));
console.log(date.format('h:mm a'));