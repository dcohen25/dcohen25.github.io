window.onload = function(){
	var imageForm = document.getElementById("#image-form");
	imageForm.on("submit", function(e){
		e.preventDefault();
		var imageFile = document.getElementById("#image-form-file");
		var text = OCRAD(imageFile[0]);
		console.log(text);
	});
}