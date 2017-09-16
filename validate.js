var Validate = {
	// Element Form
	element : null,

	// Options validate form
	options : null,

	// Array element error
	error : [],

	// Initialize options
	initOptions : function(){
		this.options = {
			doAjax : true,
			attribute : 'form-valid',
			submit : false,
			validError : function(){},
			handlingForm : function(){},
			beforeSend : function(){},
			ajaxSuccess : function(){},
			ajaxError : function(){}
		};
	},

	// Check is number
	isNum : function(value){
		if (undefined === value) return false;
		return /^\-?\d+(\.\d+)?$/g.test(value.toString());
	},

	// Check is integer
	isInt : function(value){
		if(!this.isNum(value)) return false;
		return /^\-?\d+$/g.test(value.toString());
	},

	// Bind options pass
	bindOptions : function(options){
		this.initOptions();
		if ('object' === $.type(options)){
			if ('function' === $.type(options.validError)) this.options.validError = options.validError;
			if ('boolean' === $.type(options.doAjax)) this.options.doAjax = options.doAjax;
			if ('function' === $.type(options.handlingForm)) this.options.handlingForm = options.handlingForm;
			if ('function' === $.type(options.beforeSend)) this.options.beforeSend = options.beforeSend;
			if ('function' === $.type(options.ajaxError)) this.options.ajaxError = options.ajaxError;
			if ('function' === $.type(options.ajaxSuccess)) this.options.ajaxSuccess = options.ajaxSuccess;
			if ('string' === $.type(options.attribute)) this.options.attribute = options.attribute;
			if ('function' === $.type(options.beforeValid)) this.options.beforeValid = options.beforeValid;
		}
	},

	// Get value of element validate
	getValue : function(element){
		let value = null;
		if ('INPUT' === element.nodeName){
			let type = $(element).attr('type');
			switch(type){
				case 'file':
					if (element.files.length) value = element.files;
					break;
				case 'checkbox':
				case 'radio':
					if ($(element).is(':checked')) value = $(element).val()
					break;
				default:
					value = $(element).val();
			}
		}else if ($(element).hasAttr('form-editor')){
			if ($(element).hasAttr('form-name')){
				let editor = $(element).attr('form-editor'),
					name = $(element).attr('form-name');
				switch(editor){
					case 'ckeditor':
						value = CKEDITOR.instances[name].getData();
						break;
					case 'tinymce':
						value = tinyMCE.get(name).getContent();
						break;
				}
			}
			
		}else if ($(element).hasAttr('form-div') && +$(element).attr('form-div') === 1) value = $(element).html();
		else value = $(element).val();
		return value;
	},

	checkRuleRange : function(value, rule, element, name){
		if (undefined !== rule[1]){
			let min = +rule[1];
			if (value < min) this.error.push([element, name + '_MIN']);
		}
		if (undefined !== rule[2]){
			let max = +rule[2];
			if (value > max) this.error.push([element, name + '_MAX']);
		}
	},

	// Validate type string
	validString : function(element, rule){
		let value = this.getValue(element);
		this.checkRuleRange(value.length, rule, element, 'INVALID_STRING');
	},

	// Validate type number
	validNumber : function(element, rule){
		let value = this.getValue(element);
		if (this.isNum(value)){
			value = +value;
			this.checkRuleRange(value, rule, element, 'INVALID_NUMBER');
		}else this.error.push([element, 'INVALID_NOT_NUMBER']);
	},

	// Validate type integer
	validInteger(element, rule){
		let value = this.getValue(element);
		if (this.isInt(value)){
			value = parseInt(value);
			this.checkRuleRange(value, rule, element, 'INVALID_INTEGER');
		}else this.error.push([element, 'INVALID_NOT_INTEGER']);
	},

	// Validate type email
	validEmail(element, rule){
		let value = this.getValue(element),
			regex = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
		if (regex.test(value)) this.checkRuleRange(value, rule, element, 'INVALID_EMAIL');
		else this.error.push([element, 'INVALID_NOT_EMAIL']);
	},

	// Validate type file
	validSingleFile : function(file, rule, element){
		if (undefined !== rule[3]){
			let arrExt = rule[3].split(','),
				arrName = file.name.split('.'),
				length = arrName.length;
			if ($.inArray(arrName[length - 1], arrExt) < 0){
				this.error.push([element, 'INVALID_DENY_FILE']);
				return false;
			}
		}
		let minSize = (undefined !== rule[4]) ? rule[4] : null,
			maxSize = (undefined !== rule[5]) ? rule[5] : null;
		this.checkRuleRange(file.size, ['', minSize, maxSize], element, 'INVALID_FILESIZE');
		return true;
	},

	// Validate type files
	validFile : function(element, rule){
		let value = this.getValue(element),
			isFiles = (undefined !== value && null !== value && FileList === value.constructor),
			length = isFiles ? value.length : 0;
		this.checkRuleRange(length, rule, element, 'INVALID_FILE');
		if (isFiles){
			let limit = length;
			if (undefined !== rule[1] && this.isInt(rule[1])) limit = parseInt(rule[1]);
			if (undefined !== rule[2] && this.isInt(rule[2])) limit = parseInt(rule[2]);
			if (limit > length) limit = length;
			for (let i = 0; i < limit; i++){
				let isAllow = this.validSingleFile(value[i], rule, element);
				if (!isAllow) break;
			}
		}else if (undefined !== rule[1]) this.checkRuleRange(0, rule, element, 'INVALID_FILES');
	},

	// Validate type IP
	validIP : function(element, rule){
		let flag = true,
			value = this.getValue(element),
			regex = /^((1\d{0,2})|(2(([0-4]\d?)|(5[0-5]?)|([6-9]))?)|([3-9]\d?))(\.((1\d{0,2})|(2(([0-4]\d?)|(5[0-5]?)|([6-9]))?)|([3-9]\d?))){3}$/g;
		if ('' === value){
			if (undefined === rule[1] || 0 !== parseInt(rule[1])) flag = false;
		}else if (!regex.test(value)) flag = false;
		if (!flag) this.error.push([element, 'INVALID_IP_ADDRESS']);
	},

	// Validate type domain
	validDomain : function(element, rule){
		let value = this.getValue(element),
			regex = /^https?:\/\/(www\.)?([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}\/?$/g;
		if (regex.test(value)) this.checkRuleRange(value.length, rule, element, 'INVALID_DOMAIN');
		else this.error.push([element, 'INVALID_NOT_DOMAIN']);
	},

	// Main method validate form
	action : function(selector, options){
		// Reset options
		if ('object' === $.type(options)) this.bindOptions(options);
		else if (this.options === null) this.initOptions();

		// Reset element and error
		this.element = selector;
		this.error = [];

		// Blur element and call before validate function
		document.activeElement.blur();
		this.options.beforeValid(this.element, this.options.attribute);

		// Each element has rule of Validate
		$(this.element).find('[' + this.options.attribute + ']').each(function(){
			let rule = $(this).attr(Validate.options.attribute).split(':');
			switch(rule[0]){
				case 'str':
					Validate.validString(this, rule);
					break;
				case 'num':
					Validate.validNumber(this, rule);
					break;
				case 'int':
					Validate.validInteger(this, rule);
					break;
				case 'email':
					Validate.validEmail(this, rule);
					break;
				case 'file':
					Validate.validFile(this, rule);
					break;
				case 'ip':
					Validate.validIP(this, rule);
					break;
				case 'domain':
					Validate.validDomain(this, rule);
					break;
			}
		});

		if (!this.error.length){
			if (this.options.doAjax){
				let action = $(selector).attr('action') || '/',
					method = $(selector).attr('method') || 'get',
					form = new FormData();
				$(selector).find('[name]').each(function(){
					if (!$(this).prop('disabled')){
						let name = $(this).attr('name'),
							value = Validate.getValue(this);
						if (undefined !== value && null !== value){
							if (FileList === value.constructor){
								let length = value.length;
								for(let i = 0; i < length; i++) form.append(name + '[]', value[i]);
							}else form.append(name, value);
						}
					}
				});
				this.options.beforeSend(this.element, form);
				$.ajax({
					url : action,
					data : form,
					method : method,
					contentType: false,
					processData: false,
					success : function(response, status, xhr){
						Validate.options.ajaxSuccess(Validate.element, response, xhr);
						this.options = null;
					},
					error : function(xhr, status, statusText){
						Validate.options.ajaxError(Validate.element, xhr, statusText);
						this.options = null;
					}
				});
			}else this.options.handlingForm(this.element);
		}else this.options.validError(this.element, this.error);
		this.error = [];
	},

	// Bind submit for form
	submit : function(selector, options){
		this.bindOptions(options);
		$(document).on('submit', selector, function(){
			Validate.action(this);
			return ('object' === $.type(Validate.options) && Validate.options.submit);
		});
	}
};