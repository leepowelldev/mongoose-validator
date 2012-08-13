/*
 * Validators for Mongoose.js utilising node-validate
 */
 
var nodeValidator = require('validator'),
	util		  = require('util'),
	defaultError  = nodeValidator.defaultError,
	check 		  = nodeValidator.check;
	verbose		  = false,
	callback	  = function(e){};
	
	
var validator = {
	isEmail: function(msg){
		msg = msg || defaultError['isEmail'];

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
		msg = msg || defaultError['isUrl'];

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
		msg = msg || defaultError['isIP'];

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
		msg = msg || defaultError['isAlpha'];

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
		msg = msg || defaultError['isAlphanumeric'];

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
		msg = msg || defaultError['isNumeric'];

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
		msg = msg || defaultError['isInt'];

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
		msg = msg || defaultError['isLowercase'];

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
		msg = msg || defaultError['isUppercase'];

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
		msg = msg || defaultError['isDecimal'];

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
		msg = msg || defaultError['notNull'];

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
		msg = msg || defaultError['isNull'];

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
		msg = msg || defaultError['notEmpty'];

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
		msg = msg || defaultError['equals'];

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
		msg = msg || defaultError['contains'];

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
		msg = msg || defaultError['notContains'];

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
		msg = msg || defaultError['regex'];
		
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
		msg = msg || defaultError['notRegex'];

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
		msg = (typeof max === 'string') ? max : (msg || defaultError['len']);

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
		msg = msg || defaultError['isUUID'];

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
		msg = msg || defaultError['isDate'];

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
		msg = msg || defaultError['isAfter'];

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
		msg = msg || defaultError['isBefore'];

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
		msg = msg || defaultError['isIn'];

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
		msg = msg || defaultError['notIn'];

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
		msg = msg || defaultError['max'];

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
		msg = msg || defaultError['min'];

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
		msg = msg || defaultError['isArray'];

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
		msg = msg || defaultError['isCreditCard'];

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


// e is the error thrown by node-validator, NOT mongoose,
// if you want to check the mongoose errors you'll need
// to refer to the error returned from the mongoose 'save' method 
function r(e){
	if(verbose) console.log(util.inspect(e, true, null));
	callback(e);
	return false;
}


function setDefaultError(o, h){
	if(typeof o === 'object'){
		// shallow copy o into defaultError
		for(var key in o){ defaultError[key] = o[key]; }
	}
	else if(typeof o === 'string' && typeof h === 'string'){
		defaultError[o] = h;
	}
}


function setVerbose(v){
	verbose = (typeof v === 'boolean') ? v : verbose;
}


function setCallback(cb){
	callback = (typeof cb === 'function') ? cb : callback;
}


module.exports = {
	validator: validator,
	setDefaultError: setDefaultError,
	setVerbose: setVerbose,
	setCallback: setCallback
}