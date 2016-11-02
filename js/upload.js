window.onload = function(){
	var imageForm = document.getElementById("image-form");
	imageForm.addEventListener("submit", function(e){
		e.preventDefault();
		var reader = new FileReader();
		reader.onload = function(){
			var img = new Image();
			img.onload = function(){
				OCRAD(img, function(text){
					var imageText = document.getElementById('image-text');
					imageText.innerText = text;
				});
			}
			img.src = reader.result;
		}
		var imageFile = document.getElementById('image-form-file');
		reader.readAsDataURL(imageFile.files[0])
	});
}