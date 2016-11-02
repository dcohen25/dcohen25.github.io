window.onload = function(){
	var imageForm = document.getElementById("image-form");
	imageForm.addEventListener("submit", function(e){
		e.preventDefault();
		var imageFile = document.getElementById("image-form-file");
		var text = OCRAD(imageFile.files[0]);
		console.log(text);
	});
}