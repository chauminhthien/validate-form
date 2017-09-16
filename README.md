# Validate Form and AJAX Form

## Using

This library need include JQuery

## Validate Form

````
Validate.submit(selector, options);
````

**Validate** will bind submit event for **selector** form and handing form with **options** included. **Validate** just started its job when the form submitted.

## Validate section

````
Validate.action(selector, options);
````

When `action` method called, **Validate** will start.

## selector parameter

`selector` is element then Validate.

## options parameter

`options` is object specify how `Validate` works

### + options.submit 

* Specify the form will submit
* Default : **fasle**

### + options.doAjax

* Specify the form will call AJAX
* Default : **true**

### + options.attribute

### + options.handlingForm(selector)

### + options.beforeValid()

### + options.validError()

### + options.beforeSend()

### + options.ajaxError()

### + options.ajaxSuccess()

## Rules validate

## Get value textbox

## Example

````
<style type="text/css">
	.invalid{border: 1px solid red}	
</style>

<form action="register.php" method="post" id="register-form">

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
				error[0].focus();
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