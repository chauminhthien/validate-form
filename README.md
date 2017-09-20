# Validate Form and AJAX Form

## 1. Using

This library need include JQuery

## 2. Validate Form

````javascript
Validate.submit(selector, options);
````

**Validate** will bind submit event for **selector** form and handing form with **options** included. **Validate** just started its job when the form submitted.

## 3. Validate section

````javascript
Validate.action(selector, options);
````

When `action` method called, **Validate** will start.

## 4. selector parameter

`selector` is element then Validate.

## 5. options parameter

`options` is object specify how `Validate` works

### + options.submit 

* Specifies the form will submit
* Type : Boolean
* Default : **fasle**

### + options.doAjax

* Specifies the form will call AJAX
* Type : Boolean
* Default : **true**

### + options.attribute

* Specifies **attribute name** of the element inside _selector_ to check rule validate, rule validate is attribute value of element.
* Type : String
* Default : **"form-valid"**

### + options.beforeValid(selector, attr)

* Specifies the function will called when `Validate ` Object examine the elements. `attr` parameter is attribute name of the elements specified by `options.attribute`.
* Type : Function

### + options.handlingForm(selector)

* Specifies the function will handling selector form when all element specified by `options.attribute` were valid. This function is only called when `options.doAjax` is specified with `false`
* Type : Function

### + options.validError(selector, error)

* Specifies a function to be called when there is at least one `options.attribute` element in the selector form is invalid. `error` parameter is an array containing invalid elements.
* Type : Function

### + options.beforeSend(selector, form)

* Specifies a function to be called when the all elements `options.attribute` are valid and before `Validate` call Ajax. `form` parameter is instance of FormData, this form will containing value of all elements has `name` attribute inside selector form.
* Type : Function

### + options.ajaxError(selector, xhr, statusText)

* Specifies a function to be called when `Validate` call Ajax fail. `xhr` parameter is instance of XMLHttpRequest, `statusText` parameter is statusText of `xhr`.
* Type : Function

### + options.ajaxSuccess(selector, response, xhr)

* Specifies a function to be called when `Validate` call Ajax success. `reponse` parameter is content reponse from server, `xhr` parameter is instance of XMLHttpRequest.
* Type : Function

## 6. Rules validate

`options.attribute` specify attribute name of the elements inside selector form will be tested value. Hence, value of `options.attribute` is the rule to do that.

### + Rule String

* Syntax : str:min_length:max_length
* Example : str:3:20 (form-valid="str:3:20")

### + Rule Number

* Syntax : num:min_value:max_value
* Example : num:13:60 (form-valid="num:13:60")

### + Rule Integer

* Syntax : int:min_value:max_value
* Example : int:13:60 (form-valid="int:13:60")

### + Rule Email

* Syntax : email:min_length:max_length
* Example : email:10:50 (form-valid="email:10:50")

### + Rule File

* Syntax : file:min_number_file:max_number_file:extension1,extension2,...:min_size:max_size
* Example : file:1:1:jpg,png:10:20000 (form-valid="file:1:1:jpg,png:10:20000")

### + Rule IP Address

* Syntax : ip
* Example : ip (form-valid="ip")

### + Rule Domain

* Syntax : domain:min_length:max_lenght
* Example : domain:7:60 (form-valid="domain:7:60")

If you do not want to use a rule element in a rule set, you can ignore that element.

Example, **file::1:jpg,png::20000** or **file:0:5**

## 7. Get value textbox

While checking the value of the elements inside the selector, `Validate` will get the value of the element based on `options.attribute`. However, when `Validate` calls AJAX, it will get the value of the elements inside the selector based on the `name` attribute.

For a div element, it needs to have a `form-div` attribute with an assigned value of `1`.

For an element that is an editor, `Validate` only supports get value of the two types of editors, CKEditor and tinyMCE. The element must be declared as two attributes that are `form-editor` attribute with value is _ckeditor_ or _tinymce_ and `form-name` with the value is the name of the element

## 8. Example

````html
<style type="text/css">
	.invalid{border: 1px solid red}	
</style>

<form action="register.html" method="post" id="register-form">

	<p>Username : <input type="text" name="username" form-valid="str:3:20" /></p>

	<p>Email : <input type="text" name="email" form-valid="email:10:50" /></p>

	<p>Password : <input type="password" name="password" form-valid="str:6:32" /></p>

	<p>Age : <input type="text" name="age" form-valid="int:13:60" /></p>

	<p>Website : <input type="text" name="website" form-valid="domain:7:50" /></p>

	<p>Avatar : <input type="file" name="avatar" form-valid="file:1:1:jpg,png:10:200000" /></p>

	<div>Description : <div name="description" contenteditable="true" form-valid="str:0:500" form-div="1"></div></div>
	
	<button type="submit">Register</button>
</form>

<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="validate.js"></script>
<script type="text/javascript">

	$(document).ready(function(){

		Validate.submit('#register-form', {
			// Handling form before validate form
			beforeValid : function(selector, attr){
				$(selector).find('[' + attr + ']').removeClass('invalid');
			},
			// Handling form if validate invalid
			validError : function(selector, error){
				console.log(error);
				error.forEach(function(element){
					$(element).addClass('invalid');
				});
				$(error[0]).focus();
			},
			// Handling form data before send request ajax
			beforeSend : function(selector, form){
				console.log(form); //form is instance of FormData Object
				form.append('token', Math.random())
			},
			// Handling when call AJAX success
			ajaxSuccess : function(selector, response, xhr){
				console.log(response);
			},
			ajaxError : function(selector, xhr, statusText){
				console.log(statusText);
			}
		});
	
	});

</script>
````