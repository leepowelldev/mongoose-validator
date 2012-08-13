/*
 * Validators for Mongoose.js utilising node-validate
 */
 
var nodeValidator = require('validator'),
	defaultErrors = nodeValidator.defaultError,
	check 		  = nodeValidator.check;
	
	
var validator = {
	isEmail: function(msg){
		msg = msg || defaultErrors['isEmail'];

		return {
			validator: function(v){
				try {
					check(v).isEmail();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isUrl: function(msg){
		msg = msg || defaultErrors['isUrl'];

		return {
			validator: function(v){
				try {
					check(v).isUrl();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isIP: function(msg){
		msg = msg || defaultErrors['isIP'];

		return {
			validator: function(v){
				try {
					check(v).isIP();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isAlpha: function(msg){
		msg = msg || defaultErrors['isAlpha'];

		return {
			validator: function(v){
				try {
					console.log(typeof v);
					check(v).isAlpha();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isAlphanumeric: function(msg){
		msg = msg || defaultErrors['isAlphanumeric'];

		return {
			validator: function(v){
				try {
					check(v).isAlphanumeric();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isNumeric: function(msg){
		msg = msg || defaultErrors['isNumeric'];

		return {
			validator: function(v){
				try {
					check(v).isNumeric();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isInt: function(msg){
		msg = msg || defaultErrors['isInt'];

		return {
			validator: function(v){
				try {
					check(v).isInt();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isLowercase: function(msg){
		msg = msg || defaultErrors['isLowercase'];

		return {
			validator: function(v){
				try {
					check(v).isLowercase();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isUppercase: function(msg){
		msg = msg || defaultErrors['isUppercase'];

		return {
			validator: function(v){
				try {
					check(v).isUppercase();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isDecimal: function(msg){
		msg = msg || defaultErrors['isDecimal'];

		return {
			validator: function(v){
				try {
					check(v).isDecimal();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	notNull: function(msg){
		msg = msg || defaultErrors['notNull'];

		return {
			validator: function(v){
				try {
					check(v).notNull();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isNull: function(msg){
		msg = msg || defaultErrors['isNull'];

		return {
			validator: function(v){
				try {
					check(v).isNull();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	notEmpty: function(msg){
		msg = msg || defaultErrors['notEmpty'];

		return {
			validator: function(v){
				try {
					check(v).notEmpty();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	equals: function(equals, msg){
		msg = msg || defaultErrors['equals'];

		return {
			validator: function(v){
				try {
					check(v).equals(equals);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	contains: function(str, msg){
		msg = msg || defaultErrors['contains'];

		return {
			validator: function(v){
				try {
					check(v).contains(str);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	notContains: function(str, msg){
		msg = msg || defaultErrors['notContains'];

		return {
			validator: function(v){
				try {
					check(v).notContains(str);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	// regex(pattern[, modifiers or null, msg]) 
	regex: function(pattern, modifiers, msg){
		msg = msg || defaultErrors['regex'];
		
		return {
			validator: function(v){
				try {
					check(v).regex(pattern, modifiers);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	// notRegex(pattern[, modifiers or null, msg]) 
	notRegex: function(pattern, modifiers, msg){
		msg = msg || defaultErrors['notRegex'];

		return {
			validator: function(v){
				try {
					check(v).notRegex(pattern, modifiers);
				} catch(e) { 
					return r(e); 
				}
 			},
			msg: msg
		}	
	},
	
	// len(min[, max, msg])
	len: function(min, max, msg){
		min = min || 0;	
		msg = (typeof max === 'string') ? max : (msg || defaultErrors['len']);

		return {
			validator: function(v){
				try {
					check(v).len(min, max);
				} catch(e) { 
					return r(e); 
				}
			},
			msg: msg
		}	
	},
	
	isUUID: function(ver, msg){
		msg = msg || defaultErrors['isUUID'];

		return {
			validator: function(v){
				try {
					check(v).isUUID(ver);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isDate: function(msg){
		msg = msg || defaultErrors['isDate'];

		return {
			validator: function(v){
				try {
					check(v).isDate();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isAfter: function(date, msg){
		msg = msg || defaultErrors['isAfter'];

		return {
			validator: function(v){
				try {
					check(v).isAfter(date);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isBefore: function(date, msg){
		msg = msg || defaultErrors['isBefore'];

		return {
			validator: function(v){
				try {
					check(v).isBefore(date);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isIn: function(opt, msg){
		msg = msg || defaultErrors['isIn'];

		return {
			validator: function(v){
				try {
					check(v).isIn(opt);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	notIn: function(opt, msg){
		msg = msg || defaultErrors['notIn'];

		return {
			validator: function(v){
				try {
					check(v).notIn(opt);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	max: function(val, msg){
		msg = msg || defaultErrors['max'];

		return {
			validator: function(v){
				try {
					check(v).max(val);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	min: function(val, msg){
		msg = msg || defaultErrors['min'];

		return {
			validator: function(v){
				try {
					check(v).min(val);
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isArray: function(msg){
		msg = msg || defaultErrors['isArray'];

		return {
			validator: function(v){
				try {
					check(v).isArray();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
	
	isCreditCard: function(msg){
		msg = msg || defaultErrors['isCreditCard'];

		return {
			validator: function(v){
				try {
					check(v).isCreditCard();
				} catch(e) {
					return r(e);
				}
 			},
			msg: msg
		}	
	},
}


// Aliases
validator.is = validator.regex;
validator.not = validator.notRegex;
validator.isFloat = validator.isDecimal;


function r(e){
	console.log(e);
	return false;
}


module.exports = validator;