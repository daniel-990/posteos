/*------------*/
/*-name app: administrador de servicios*/
/*-version: 0.0.1*/
/*-autor: daniel arango villegas*/
/*------------*/
jQuery(document).ready(function($){
	init();
	mrBot();

	$(".boton-bot").sideNav();
	$(".inicia-sesion").sideNav();

	$(".boton-bot").on('click',function(){
		$("#data").html("...");
	});
});

function init(){
	var btn = $("#btn_data");
	var btn_seccion = $("#btn_seccion");
	var btn_file = $("#btn_file");
	var btn_google = $("#google");


			var config = {
				apiKey: "AIzaSyDhuQPMMEyJG9ucfxJSHjFBXlRtZjfUwQk",
				authDomain: "test-85d7f.firebaseapp.com",
				databaseURL: "https://test-85d7f.firebaseio.com",
				storageBucket: "test-85d7f.appspot.com",
			};
			firebase.initializeApp(config);

			var db = firebase.database();
			var secciones = firebase.database();
			var addSection = firebase.database();

			var recupera_data = firebase.database().ref('categorias');
			var view_data = firebase.database().ref('contenido');
			var link = firebase.database().ref('link');

			var provider = new firebase.auth.GoogleAuthProvider();

            //verificacion del inicio de sesion
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					console.log(user.email);
					console.log(user.emailVerified);
					console.log(user.isAnonymous);
					var $contenido2 = $('<h5 class="text-center">Hola '+user.email+'</h5>');
					Materialize.toast($contenido2, 5000);
				} else {
					console.log("no inicio sesion");
				    var $contenido = $('<h5 class="text-center">para poder utilizar todas las funcionalidades<br>inicie sesion</h5>');
					Materialize.toast($contenido, 5000);
				}
			});
			//inicio de sesion con google
			btn_google.on('click',function(event){
				event.preventDefault();
				firebase.auth().signInWithRedirect(provider).then(function(result) {
					var token = result.credential.accessToken;
					var user = result.user;

					    var contador=0;
        			    setInterval(function(){
        			    	contador++;
        			    	if (contador==1){
        			    		window.location.href = "index.html";
        			    	}else{
        			    		console.log("error_1!");
        			    	}
        			    },1000);

				}).catch(function(error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					var email = error.email;
					var credential = error.credential;
				});
			});

//inicia session
			$("#login").on('click', function(event) {
				event.preventDefault();

			var inputUser = $("#input-user").val();
			var inputPass =  $("#input-pass").val();

			var email = inputUser;
			var password = inputPass;

				firebase.auth().onAuthStateChanged(function(user) {
    				if (user) {
        			var email = user.email;
        			    console.log("dio "+email);
        			    Materialize.toast('Bienvenido '+email, 3000, 'rounded');
        			    var contador=0;
        			    setInterval(function(){
        			    	contador++;
        			    	if (contador==1){
        			    		window.location.href = "index.html";
        			    	}else{
        			    		console.log("error_1!");
        			    	}
        			    },1000);
    				} else {
        				console.log("error!");
        				Materialize.toast('Error al iniciar sesion', 3000, 'rounded');
    				}
				});
				firebase.auth().signInWithEmailAndPassword(email, password);
			});

//cierra session
			$("#cerrar-s").on('click', function(event){
				event.preventDefault();
				firebase.auth().signOut().then(function(){
					console.log("cerro sesion");
					Materialize.toast('Cerro sesion', 3000, 'rounded');
					var contador=0;
					setInterval(function(){
						contador++;
						if (contador==1){
							window.location.href = "index.html";
						}else{

						}
					},1000);
				}, function(error) {
				});
			});

	secciones.ref('categorias').update({
		'categoria_1':{
			'categoria':'categoria_juegos'
		},
		'categoria_2':{
			'categoria':'categoria_tecnologia'
		}
	});

	btn_seccion.on('click', function(event) {
		event.preventDefault();

			var data_seccion = $("#data_seccion").val();
				data_seccion = data_seccion.replace(/\s/g,"_");
					console.log(data_seccion);

			var data = $("#data_seccion").val().substr(1,2);

				addSection.ref('categorias/cat_'+data).update({
						'categoria':data_seccion
						});
				$("#data_seccion").val("");
	});


	recupera_data.on('child_added', function(data) {
		var dataDB = data.val().categoria;
		$("#listas").append("<option value="+dataDB+">"+dataDB+"</option>");
	});

	$("select[name=nombre]").change(function(){
		$('input[name=valor1]').val($(this).val());
	});

	btn.on('click', function(event){
		event.preventDefault();

			var data_nombre = $("#data_nombre").val();
			var data_apellido = $("#data_apellido").val();
			var data_contenido = $("#data_contenido").val();
			var link_data_imagen = $("#img_data").val();

			var data_selecter = $("#selecter").val();

				db.ref('contenido/contenido_'+data_selecter).update({
					'name':data_nombre,
					'apellidos':data_apellido,
					'contenido':data_contenido,
					'link':link_data_imagen
				});
				$("#data_nombre,#data_apellido,#data_contenido,#img_data").val("");
	});
	view_data.on('child_added', function(data){
		var dataDB_nombre = data.val().name;
		var dataDB_apellido = data.val().apellidos;
		var dataDB_post = data.val().contenido;
		var dataDB_link = data.val().link;
        $("#text_data").append('<div class="card horizontal"><div class="card-stacked"><section class="ancho-500 container-fluid"><img id="file_post" src="'+dataDB_link+'" style="width: 100%; padding: 20px;" class="center-align"></section><div class="card-content"><p><strong>Nombre:</strong> <span class="color">'+dataDB_nombre+'</span><br><strong>Apellido:</strong> <span class="color">'+dataDB_apellido+'</span><br><strong>Mensaje:</strong> <span class="color2">'+dataDB_post+'</span></p></div><div class="card-action"><a href="#">This is a link</a></div></div></div>');
	});

	link.on('child_added', function(data){
		var link_data = data.val();
		$("#img_data").val(link_data);
		$("#file_post").attr('src', link_data);
	});

	btn_file.on('click', function(event) {
		event.preventDefault();
		var fileUploadControl = $("#file")[0];
		if (fileUploadControl.files.length > 0) {

			CB.CloudApp.init('oipgdytcnclg', '54c99790-f1e4-48df-9281-b623574878a4');

			var file = fileUploadControl.files[0];
			var name = "space.jpg";
			var cloudFile = new CB.CloudFile(file);

			cloudFile.set('img','default');
			cloudFile.save({
				success : function(cloudFile){
					console.log("url: "+cloudFile.url);
					$("#console").val("objeto guardado "+cloudFile.url);
					var obj = new CB.CloudObject('test');
					obj.set('img',cloudFile.url);
					obj.set('datos','rrft56');
					obj.save({
						success:function(res){
							var imgData = cloudFile.url;
							console.log(imgData);
							//$("#file_post").attr('src', imgData);
							db.ref('link').update({
								'link_imagen_post':imgData
							});
						},
						error:function(err){
							console.log("error al guardar el objeto "+err);
						}
					});
				}, error: function(error){
					console.log("error: "+error)
				}, uploadProgress : function(percentComplete){
					console.log("carga "+percentComplete);
					Materialize.toast("Cargando imagen "+percentComplete, 3000, 'rounded');
					if (percentComplete >= 0.9){
						reload();
					}else{
						//console.log("error");
					}
					function reload(){
						setTimeout(function(){
							location.reload();
						},4500);
					}
				}
			})
		}
	});
}

function mrBot(){
	var accessToken = "050ad805c70140a38d6a57395ee4d289";
	var baseUrl = "https://api.api.ai/v1/";
	$(document).ready(function() {
		$("#input").keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				send();
			}
		});
		$("#rec").click(function(event) {
			switchRecognition();
		});
	});
	var recognition;
	function startRecognition() {
		recognition = new webkitSpeechRecognition();
		recognition.onstart = function(event) {
			updateRec();
		};
		recognition.onresult = function(event) {
			var text = "";
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				text += event.results[i][0].transcript;
			}
			setInput(text);
			stopRecognition();
		};
		recognition.onend = function() {
			stopRecognition();
		};
		recognition.lang = "en-US";
		recognition.start();
	}

	function stopRecognition() {
		if (recognition) {
			recognition.stop();
			recognition = null;
		}
		updateRec();
	}
	function switchRecognition() {
		if (recognition) {
			stopRecognition();
		} else {
			startRecognition();
		}
	}
	function setInput(text) {
		$("#input").val(text);
		send();
	}
	function updateRec() {
		$("#rec").text(recognition ? "Detener" : "Habla");
	}
	function send() {
		var text = $("#input").val();
		$.ajax({
			type: "POST",
			url: baseUrl + "query/",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + accessToken
			},
			data: JSON.stringify({ q: text, lang: "en" }),
			success: function(data){
				console.log(data);
				console.log(data.result.parameters.respuesta);
				$("#input").val("");
				var htmlPlano = "";
				htmlPlano = "<span><strong class='color'>Mr. Bot:</strong> "+data.result.parameters.respuesta+"</span>";
				$("#data").html(htmlPlano);
			},
			error: function() {
				setResponse("Internal Server Error");
			}
		});
	}
}
















