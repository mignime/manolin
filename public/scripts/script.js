
(function(d){jQuery.fn.extend({slimScroll:function(o){var a=ops=d.extend({wheelStep:20,width:"100%",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:0.4,alwaysVisible:!1,railVisible:!1,railColor:"#333",railOpacity:"0.2",railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,scroll:0},o);this.each(function(){function h(a,d,e){var f=a;d&&(f=parseInt(c.css("top"))+a*B/100*c.outerHeight(),d=b.outerHeight()-c.outerHeight(),
f=Math.min(Math.max(f,0),d),c.css({top:f+"px"}));k=parseInt(c.css("top"))/(b.outerHeight()-c.outerHeight());f=k*(b[0].scrollHeight-b.outerHeight());e&&(f=a,a=f/b[0].scrollHeight*b.outerHeight(),c.css({top:a+"px"}));b.scrollTop(f);p();i()}function w(){q=Math.max(b.outerHeight()/b[0].scrollHeight*b.outerHeight(),o);c.css({height:q+"px"})}function p(){w();clearTimeout(x);l=C&&k==~~k;q>=b.outerHeight()?l=!0:(c.stop(!0,!0).fadeIn("fast"),y&&g.stop(!0,!0).fadeIn("fast"))}function i(){m||(x=setTimeout(function(){!r&&
!s&&(c.fadeOut("slow"),g.fadeOut("slow"))},1E3))}var t,r,s,x,q,k,o=30,l=!1,B=parseInt(a.wheelStep),j=a.width,z=a.height,e=a.size,D=a.color,E=a.position,A=a.distance,u=a.start,F=a.opacity,m=a.alwaysVisible,y=a.railVisible,G=a.railColor,H=a.railOpacity,C=a.allowPageScroll,n=a.scroll,b=d(this);if(b.parent().hasClass("slimScrollDiv"))n&&(c=b.parent().find(".slimScrollBar"),g=b.parent().find(".slimScrollRail"),h(b.scrollTop()+parseInt(n),!1,!0));else{n=d("<div></div>").addClass(a.wrapperClass).css({position:"relative",
overflow:"hidden",width:j,height:z});b.css({overflow:"hidden",width:j,height:z});var g=d("<div></div>").addClass(a.railClass).css({width:e,height:"100%",position:"absolute",top:0,display:m&&y?"block":"none","border-radius":e,background:G,opacity:H,zIndex:90}),c=d("<div></div>").addClass(a.barClass).css({background:D,width:e,position:"absolute",top:0,opacity:F,display:m?"block":"none","border-radius":e,BorderRadius:e,MozBorderRadius:e,WebkitBorderRadius:e,zIndex:99}),j="right"==E?{right:A}:{left:A};
g.css(j);c.css(j);b.wrap(n);b.parent().append(c);b.parent().append(g);c.draggable({axis:"y",containment:"parent",start:function(){s=!0},stop:function(){s=!1;i()},drag:function(){h(0,d(this).position().top,!1)}});g.hover(function(){p()},function(){i()});c.hover(function(){r=!0},function(){r=!1});b.hover(function(){t=!0;p();i()},function(){t=!1;i()});var v=function(a){if(t){var a=a||window.event,b=0;a.wheelDelta&&(b=-a.wheelDelta/120);a.detail&&(b=a.detail/3);h(b,!0);a.preventDefault&&!l&&a.preventDefault();
l||(a.returnValue=!1)}};(function(){window.addEventListener?(this.addEventListener("DOMMouseScroll",v,!1),this.addEventListener("mousewheel",v,!1)):document.attachEvent("onmousewheel",v)})();w();"bottom"==u?(c.css({top:b.outerHeight()-c.outerHeight()}),h(0,!0)):"object"==typeof u&&(h(d(u).position().top,null,!0),m||c.hide())}});return this}});jQuery.fn.extend({slimscroll:jQuery.fn.slimScroll})})(jQuery);


var messageContainer, submitButton;
var pseudo = "";
var rooms = {'rooms':['room1', 'room2']};
var pmSocket = "";
var myself;
var tanqueSeleccionado;
var precioTanque;
var $messagesActive;
var comboTanques, comboMedidores, vistaTanque, vistaMedidor, totalMedidores, lecturaActual, gasto, calculoSurtido;
var countMedidores = 0, medidoresLeidos =- 0;
var adicionales;
// Init
$(function() {
	vistaMedidor = $("#vistaMedidor"); //vistaMedidor.hide();
	comboTanques = $("#tanqueSelect");
	divMedidores = $("#medidores");
	totalMedidores = $("#totalMedidores"); totalMedidores.hide();
	lecturaFinal = $(".lecturaFinal");
	calculoSurtido = $("#calculoSurtido"); calculoSurtido.hide();
	gasto = $(".gasto"); gasto.hide();
	initEvents();
	llenaCombo();
});

function initEvents(){
	lecturaFinal.attr('disabled',true);
	//comboMedidores.chosen({width: "100%"});
	comboTanques.change(function(){
		totalMedidores.hide();
		llenaMedidores();
		lecturaFinal.attr('disabled',true);
		calculoSurtido.hide();
		gasto.hide();
		lecturaFinal.val("");
		$.post("/descripcionTanque", {"clave":$(this).val()} ,function(datos){
			
			$("#tanques").empty();
			tanqueSeleccionado = datos[0];

			agregaTanque(tanqueSeleccionado);

			if (tanqueSeleccionado.esMultiple) {
				$.each(adicionales, function(idd, adi){
					if (adi.unido == tanqueSeleccionado.clave) {
						$.post("/descripcionTanque", {"clave":adi.clave} ,function(datosAd){
							tanqueSeleccionado = datosAd[0];
							agregaTanque(tanqueSeleccionado);
						});
					}
				});
			}

			
			
			
			$.post("/precioTanque", {"clavePrecio":tanqueSeleccionado.clavePrecio} ,function(precio){
				precioTanque = precio[0];
				console.debug("PRECIO ",precioTanque.precio);
			});
		});
	});
	

	
	lecturaFinal.change(function(){
		var litrosSurtidos = (($(this).val()-$(".lecturaActual").val()) * tanqueSeleccionado.capacidad)/100;
		var subtotal = litrosSurtidos * precioTanque.precio;
		var iva = subtotal * .15;
		var total = subtotal + iva
		$("#litrosSurtidos").text(" "+litrosSurtidos+" lts.");
		$("#precio").text(" $ "+precioTanque.precio+" ");
		$("#subTotal").text(" $ "+subtotal+" ");
		$("#iva").text(" $ "+iva+" ");
		$("#total").text(" $ "+total+" ");
		calculoSurtido.show();
	});
}

function agregaTanque(tanque) {
	
	$(".lecturaActual").off('change');
	$(".lecturaFinal").off('change');

	var porcentaje = (tanqueSeleccionado.ultimaCarga * 100)/tanqueSeleccionado.capacidad;
	var snipTanq = $("<div class='tanque'></div>").data("tanque", tanque);
	var snipActual = "<div><label class='inputLabel'>Lectura Actual</label><input placeholder='xxx%' type='text' class='entradaDatos respuestas lecturaActual'/></div>";
	var snipFinal = "<div><label class='inputLabel'>Lectura Final</label><input disabled placeholder='xxx%' type='text' class='entradaDatos respuestas lecturaFinal'/></div>";
	var snipGasto = "<div class='gasto'><label>Consumido</label><span class='ltsConsumidos datos'></span><label>Restante</label><span class='ltsRestantes'></span><label>Debe quedar</label><span class='debeQuedar'></span></div>";
	snipTanq.append("<span>"+tanqueSeleccionado.clave+"  -  "+tanqueSeleccionado.ultimaCarga+" lts  " + porcentaje+"%</span>");
	snipTanq.append(snipActual);
	snipTanq.append(snipFinal);
	snipTanq.append(snipGasto);
	$("#tanques").append(snipTanq);

	$(".lecturaActual").on('change', function(){
		var tanqueNow = $(this).parent().parent().data("tanque");
		var divGasto = $(this).parent().parent().find(".gasto");
		var litrosActuales = ($(this).val()*tanqueNow.capacidad)/100;
		var consumidos = (tanqueSeleccionado.ultimaCarga-litrosActuales);
		var restantes = tanqueNow.ultimaCarga-consumidos;
		$(".ltsConsumidos", divGasto).text(" "+consumidos+" lts.");
		$(".ltsRestantes", divGasto).text(" "+restantes+" lts.");
		$(".debeQuedar", divGasto).text(" "+tanqueNow.debeQuedar+" %");
				
		divGasto.show();
		$(this).parent().parent().find(".lecturaFinal").attr('disabled',false);
		lecturaTanquesLista();
	});

	$(".lecturaFinal").on('change', function(){
		var litrosSurtidos = (($(this).val()-$(".lecturaActual").val()) * tanqueSeleccionado.capacidad)/100;
		var subtotal = litrosSurtidos * precioTanque.precio;
		var iva = subtotal * .15;
		var total = subtotal + iva
		$("#litrosSurtidos").text(" "+litrosSurtidos+" lts.");
		$("#precio").text(" $ "+precioTanque.precio+" ");
		$("#subTotal").text(" $ "+subtotal+" ");
		$("#iva").text(" $ "+iva+" ");
		$("#total").text(" $ "+total+" ");
		calculoSurtido.show();
	});
	$(".gasto").hide();
}

function llenaMedidores() {
	divMedidores.empty();
	var snippetCalculoMedidor = "<span class='conversionLitros datos'></span>";
	$.post('/obtenMedidores', {"claveTanque":comboTanques.val()},function(meds){
		$.each(meds,function(idx, med){
			countMedidores++;
			divMedidores.append("<div class='medidorBox'><label class='inputLabel'>Ultima lectura </label><input class='entradaDatos ultimaCargaMedidor' type='text' value='"+med.ultimaLectura+"' disabled/><label class='inputLabel'>"+med.clave+"</label><input class='entradaDatos datosMedidor "+med.clave+"' type='text' placeholder='mts.'/>"+snippetCalculoMedidor+"</div>");
		});
		$(".datosMedidor").change(function(){
			var ultimaLectura = $(this).siblings(".ultimaCargaMedidor").val();
			console.debug("UL= ",ultimaLectura);
				var conversion = ($(this).val() - ultimaLectura) * 4;
				$(this).siblings(".conversionLitros").text(conversion+" lts.");
				var conteo = lecturaMedidoresLista();
				if (conteo.listo) {
					totalMedidores.show();
					var subtotal = conteo.suma * precioTanque.precio;
					var iva = subtotal * .15;
					var total = iva + subtotal;
					$("#totalLitros").text(conteo.suma);
					$("#precioM").text(" $ "+precioTanque.precio+" ");
					$("#subTotalM").text(" $ "+subtotal+" ");
					$("#ivaM").text(" $ "+iva+" ");
					$("#totalM").text(" $ "+total+" ");
				}
			});
	});
}

function lecturaTanquesLista(){
	var listo = true;
	var suma = 0;
	$.each($(".lecturaActual"), function(){
		if ($(this).val().trim() == "") {
			listo = false;
			return false;
		}
		suma += 1;
	});
	return {'listo':listo, 'suma':suma};
}

function lecturaMedidoresLista(){
	var suma = 0;
	var listo = true;
	$.each($(".datosMedidor"), function(){
		if ($(this).val().trim() == "") {
			listo = false;
			return false;
		}
		var ultimaL = $(this).siblings(".ultimaCargaMedidor").val();
		suma += parseInt($(this).siblings(".conversionLitros").text().substring(0, $(this).siblings(".conversionLitros").text().indexOf(" ")));
	});
	return {'listo':listo, 'suma':suma};
}

function llenaCombo(){
	comboTanques.empty();
	$.post("/obtenTanques", function(datos){
		console.debug("ADISO ",datos);
		comboTanques.append("<option value='-1'>----</option>");
		$.each(datos.tanques,function(idx, tanq){
			var capacidad = tanq.capacidad;
			adicionales = datos.adicionales;
			//Checar si están ligados mas tanques
			if (tanq.esMultiple) {
				$.each(datos.adicionales, function(rxt, adi){
					if (adi.unido == tanq.clave) {
						capacidad += adi.capacidad
					}
				});
			}
			comboTanques.append("<option value='"+tanq.clave+"'>"+tanq.clave+" "+capacidad+" lts.</option>");
			console.debug("TANQUE2 ",tanq);
		});
		$("#tanqueSelect").chosen({width: "100%"});
	});
}


function bindButton() {
	submitButton.button('loading');
	messageContainer.on('input', function() {
		if (messageContainer.val() == "") submitButton.button('loading');
		else submitButton.button('reset');
	});
}

function setHeight() {
	$(".slimScrollDiv").height('603');
	$(".slimScrollDiv").css('overflow', 'visible')
}