window.onload = function(){
	var imageForm = document.getElementById("image-form");
	imageForm.addEventListener("submit", function(e){
		e.preventDefault();
		var imageFile = document.getElementById("image-form-file");
		var text = OCRAD(imageFile);
		console.log(text);
	});
}