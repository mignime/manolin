
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
var comboTanques, lecturaActual, gasto, calculoSurtido;
// Init
$(function() {
	comboTanques = $("#tanqueSelect");
	lecturaActual = $(".lecturaActual");
	lecturaFinal = $(".lecturaFinal");
	calculoSurtido = $("#calculoSurtido"); calculoSurtido.hide();
	gasto = $("#gasto"); gasto.hide();
	initEvents();
	llenaCombo();
});

function initEvents(){
	comboTanques.change(function(){
		$.post("/descripcionTanque", {"clave":$(this).val()} ,function(datos){
			tanqueSeleccionado = datos[0];
			var porcentaje = (tanqueSeleccionado.ultimaCarga * 100)/tanqueSeleccionado.capacidad;
			$("#ultimaRecLts").text(tanqueSeleccionado.ultimaCarga+" lts.");
			$("#ultimaRecPct").text(porcentaje+"%");
			$.post("/precioTanque", {"clavePrecio":tanqueSeleccionado.clavePrecio} ,function(precio){
				precioTanque = precio[0];
				console.debug("PRECIO ",precioTanque.precio);
			});
		});
	});
	lecturaActual.change(function(){
		var litrosActuales = ($(".lecturaActual").val()*tanqueSeleccionado.capacidad)/100;
		var consumidos = ($("#ultimaRecLts").text().substring(0,$("#ultimaRecLts").text().indexOf(" "))-litrosActuales);
		var restantes = tanqueSeleccionado.ultimaCarga-consumidos;
		$("#ltsConsumidos").text(" "+consumidos+" lts.");
		$("#ltsRestantes").text(" "+restantes+" lts.");
		$("#debeQuedar").text(" "+tanqueSeleccionado.debeQuedar+" %");
		gasto.show();
	});
	lecturaFinal.change(function(){
		var litrosSurtidos = ($(this).val() * tanqueSeleccionado.capacidad)/100;
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

function llenaCombo(){
	comboTanques.empty();
	$.post("/obtenTanques", function(datos){
		comboTanques.append("<option value='-1'>--Seleccione--</option>");
		$.each(datos,function(idx, tanq){
			comboTanques.append("<option value='"+tanq.clave+"'>"+tanq.clave+"</option>");
			console.debug("TANQUE ",tanq);
		});
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