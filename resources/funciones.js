document.Ready({
	var modocontacto = document.getElementsByTagName('accmcontacto');
	modocontacto.onchange = function(){
		var seleccionado = modocontacto.options[modocontacto.selectedIndex].text;
		var modoc_otro = document.getElementsByTagName('accmcotro');
		if (seleccionado === "Otro") {
			modoc_otro.disabled = false;
		} else {
			modoc_otro.disabled = true;
		}
	}
});