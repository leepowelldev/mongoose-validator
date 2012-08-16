/*
 * Validators for Mongoose.js utilising node-validate
 */
 
var nodeValidator = require('validator'),
	util		  = require('util'),
	defaultError  = nodeValidator.defaultError,
	check 		  = nodeValidator.check;
	
	
var validator = {
	isEmail: function(msg){
		msg = msg || defaultError['isEmail'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isEmail();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isUrl: function(msg){
		msg = msg || defaultError['isUrl'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isUrl();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isIP: function(msg){
		msg = msg || defaultError['isIP'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isIP();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isAlpha: function(msg){
		msg = msg || defaultError['isAlpha'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isAlpha();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isAlphanumeric: function(msg){
		msg = msg || defaultError['isAlphanumeric'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isAlphanumeric();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isNumeric: function(msg){
		msg = msg || defaultError['isNumeric'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isNumeric();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isInt: function(msg){
		msg = msg || defaultError['isInt'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isInt();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isLowercase: function(msg){
		msg = msg || defaultError['isLowercase'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isLowercase();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isUppercase: function(msg){
		msg = msg || defaultError['isUppercase'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isUppercase();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isDecimal: function(msg){
		msg = msg || defaultError['isDecimal'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isDecimal();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	notNull: function(msg){
		msg = msg || defaultError['notNull'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).notNull();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isNull: function(msg){
		msg = msg || defaultError['isNull'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isNull();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	notEmpty: function(msg){
		msg = msg || defaultError['notEmpty'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).notEmpty();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	equals: function(opt, msg){
		msg = msg || defaultError['equals'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).equals(opt);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	contains: function(str, msg){
		msg = msg || defaultError['contains'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).contains(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	notContains: function(str, msg){
		msg = msg || defaultError['notContains'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).notContains(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	// regex(pattern[, modifiers or null, msg]) 
	regex: function(pattern, modifiers, msg){
		msg = msg || defaultError['regex'];
		
		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).regex(pattern, modifiers);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	// notRegex(pattern[, modifiers or null, msg]) 
	notRegex: function(pattern, modifiers, msg){
		msg = msg || defaultError['notRegex'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).notRegex(pattern, modifiers);
				} catch(err) {
					return false;
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
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).len(min, max);
				} catch(err) {
					return false;
				}
			},
			msg: msg
		}	
	},
	
	isUUID: function(str, msg){
		msg = msg || defaultError['isUUID'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isUUID(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isDate: function(msg){
		msg = msg || defaultError['isDate'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isDate();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isAfter: function(str, msg){
		msg = msg || defaultError['isAfter'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isAfter(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isBefore: function(str, msg){
		msg = msg || defaultError['isBefore'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isBefore(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isIn: function(str, msg){
		msg = msg || defaultError['isIn'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isIn(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	notIn: function(str, msg){
		msg = msg || defaultError['notIn'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).notIn(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	max: function(str, msg){
		msg = msg || defaultError['max'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).max(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	min: function(str, msg){
		msg = msg || defaultError['min'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).min(str);
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isArray: function(msg){
		msg = msg || defaultError['isArray'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isArray();
				} catch(err) {
					return false;
				}
 			},
			msg: msg
		}	
	},
	
	isCreditCard: function(msg){
		msg = msg || defaultError['isCreditCard'];

		return {
			validator: function(val){
				if(isEmpty(val)) return true;
				
				try {
					check(val).isCreditCard();
				} catch(err) {
					return false;
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


function setDefaultErrorMessage(obj, msg){
	if(typeof obj === 'object'){
		// shallow copy o into defaultError
		for(var key in obj){ defaultError[key] = obj[key]; }
	}
	else if(typeof obj === 'string' && typeof msg === 'string'){
		defaultError[obj] = msg;
	}
}


function isEmpty(val){
	return (val === '' || val === null || (typeof obj === 'object' && Object.keys(obj).length === 0));
}


module.exports = {
	validator: validator,
	setDefaultErrorMessage: setDefaultErrorMessage
}