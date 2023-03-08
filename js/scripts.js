(function () {
	
	function appCtrl(value, html){
		document.getElementById("optTab").style.display = "none";
		document.getElementById("displayArea").style.display = "flex";
		document.getElementById("msgTab").innerHTML = "";
		
		switch(value){
			case 1 : displayTable(patientList, html, value); break;
			case 2 : displayTable(buildList, html, value); break;
			case 3 : displayTable(hospList, html, value); break;
			case 4 : searchPatient(patientList); break;
			case 5 : searchUnit(buildList); break;
		}
	}
	
	function displayTable(array, html, value){
		let objKeys = Object.keys(array[0]);		

		let displayTab = document.createElement("div");
		displayTab.id = "displayTab";
		
		let table = document.createElement("table");
		table.id = "table";
		let tableHead = document.createElement("thead");
		let hRow = document.createElement("tr");
		for(let objKey of objKeys){
			let th = document.createElement("th");
			th.appendChild(document.createTextNode(objKey));
			hRow.appendChild(th);
		}
		tableHead.appendChild(hRow);
		table.appendChild(tableHead);
		
		let tableBody = document.createElement("tbody");
		tableBody.id = "tableData";
		for(let obj of array){ 
			let row = document.createElement("tr");
			for(let objValue of Object.values(obj)){
				let td = document.createElement("td");
				td.appendChild(document.createTextNode(objValue));
				row.appendChild(td);
			}
			tableBody.appendChild(row); 
		}	
		table.appendChild(tableBody);   
		displayTab.appendChild(table);
		
		let clearDisplay = document.createElement("img");
		clearDisplay.id = "clearDisplay";
		clearDisplay.src = "img/close-box-red.png";
		clearDisplay.alt = "clearDisplay";
		clearDisplay.addEventListener("click", () => {
			if(value <= 3){
				document.getElementById("displayArea").style.display = "none";
			}else if(value == 4){
				appCtrl(value, html)
			}else if(value == 5){
				appCtrl(value, html)
			}
		});
		
		document.getElementById("displayTab").replaceWith(displayTab);
		document.getElementById("optTab").innerHTML = html;
		document.getElementById("optTab").appendChild(clearDisplay);
		document.getElementById("optTab").style.display = "block";
		tableSorter();
	}
	
	function searchPatient(patients){
		document.getElementById("displayTab").style.display = "none";
		
		let optTab = document.createElement("div");
		optTab.id = "optTab";
		
		let labelPatient = document.createElement("label");
		labelPatient.htmlFor = "patientList";
		labelPatient.appendChild(document.createTextNode("Sélectionnez un patient:"));
		
		let inputPatient = document.createElement("input");
		inputPatient.setAttribute("list", "patientList");
		inputPatient.name = "selPatient";
		inputPatient.id = "selPatient";
		
		let datalistPatients = document.createElement("datalist");
		datalistPatients.id = "patientList";
		
		for(let patient of patientList){
			let options = document.createElement("option");
			options.value = patient["fileNo"] + ". " + patient["lName"] + ", " + patient["fName"];
			datalistPatients.appendChild(options);
		}
		
		let clearInput = document.createElement("img");
		clearInput.id = "clearInput";
		clearInput.src = "img/close-box-red.png";
		clearInput.alt = "clearInput";
		
		optTab.appendChild(labelPatient);
		optTab.appendChild(inputPatient);
		optTab.appendChild(datalistPatients);
		optTab.appendChild(clearInput);
		
		document.getElementById("optTab").replaceWith(optTab);
		document.getElementById("optTab").style.display = "block";
		
		document.getElementById("clearInput").addEventListener("click", () => {document.getElementById("selPatient").value = ""; document.getElementById("msgTab").innerHTML = "";});
		document.getElementById("selPatient").focusout = function() {
			displayPatient(document.getElementById("selPatient").value);
		};
	}
	
	function displayPatient(patientInfo){
		let html = document.querySelectorAll(".navItem")[3].innerHTML; 
		html += "--> " + patientInfo.substr(2);
		let value = document.querySelectorAll(".navItem")[3].value;
		if(hospList.filter(h => h.fileNo == patientInfo.substr(0,2)).length >= 1){
			document.getElementById("msgTab").style.display = "none";
			displayTable(hospList.filter(h => h.fileNo == patientInfo.substr(0,2)), html, value);
		}else{
			document.getElementById("msgTab").style.display = "block";
			document.getElementById("msgTab").innerHTML = "<p>" + patientInfo + " n'a pas d'hospitalisation(s) dans nos dossiers </p>";
		}
	}
	
	function searchUnit(buildings){
		document.getElementById("displayTab").style.display = "none";
		
		let optTab = document.createElement("div");
		optTab.id = "optTab";
		
		let labelBuild = document.createElement("label");
		labelBuild.htmlFor = "buildList";
		labelBuild.appendChild(document.createTextNode("Sélectionnez un hôpital:"));
		
		let inputBuild = document.createElement("input");
		inputBuild.setAttribute("list", "buildList");
		inputBuild.name = "selBuild";
		inputBuild.id = "selBuild";
		
		let datalistBuild = document.createElement("datalist");
		datalistBuild.id = "buildList";
		
		for(let build of buildList){
			let options = document.createElement("option");
			options.value = build["buildCode"] + ". " + build["name"];
			datalistBuild.appendChild(options);
		}
		
		let clearInput = document.createElement("img");
		clearInput.id = "clearInput";
		clearInput.src = "img/close-box-red.png";
		clearInput.alt = "clearInput";		
		
		optTab.appendChild(labelBuild);
		optTab.appendChild(inputBuild);
		optTab.appendChild(datalistBuild);
		optTab.appendChild(clearInput);
		
		document.getElementById("optTab").replaceWith(optTab);
		document.getElementById("optTab").style.display = "block";
		
		document.getElementById("clearInput").addEventListener("click", () => {document.getElementById("selBuild").value = ""; document.getElementById("msgTab").innerHTML = "";});
		document.getElementById("selBuild").focusout = function() {
			if(hospList.filter(h => h.buildCode == (document.getElementById("selBuild").value).substr(0,4)).length >= 1){
				document.getElementById("msgTab").style.display = "none";
				displaySpecs(document.getElementById("selBuild").value);
			}else{
				document.getElementById("msgTab").style.display = "block";
				document.getElementById("msgTab").innerHTML = "<p> hôpital " + (document.getElementById("selBuild").value).substr(0,4) + 
				" n'a pas d'hospitalisation(s) dans nos dossiers ou n'existe pas</p>";
			}
		};
	}
	
	function displaySpecs(building){
		let optTab = document.getElementById("optTab");
		
		let labelSpec = document.createElement("label");
		labelSpec.htmlFor = "specList";
		labelSpec.appendChild(document.createTextNode("Sélectionnez une spécialité:"));
		labelSpec.id = "labelSpec";
		
		let inputSpec = document.createElement("input");
		inputSpec.setAttribute("list", "specList");
		inputSpec.name = "selSpec";
		inputSpec.id = "selSpec";
		
		let datalistSpec = document.createElement("datalist");
		datalistSpec.id = "specList";
		
		let ctrlArr = [];
		for(let hosp of hospList){
			let options = document.createElement("option");
			if(hosp["buildCode"] == building.substr(0,5)){
				if(ctrlArr.indexOf(hosp["spec"]) == -1){
					options.value = hosp["spec"];
					datalistSpec.appendChild(options);
					ctrlArr.push(hosp["spec"]);
				}
			}
		}
		
		let clearInput2 = document.createElement("img");
		clearInput2.id = "clearInput2";
		clearInput2.src = "img/close-box-red.png";
		clearInput2.alt = "clearInput2";	
		
		if(document.getElementById("selSpec")){		
			document.getElementById("labelSpec").replaceWith(labelSpec);
			document.getElementById("selSpec").replaceWith(inputSpec);
			document.getElementById("specList").replaceWith(datalistSpec);
			document.getElementById("clearInput2").replaceWith(clearInput2);
		}else{
			optTab.appendChild(labelSpec);
			optTab.appendChild(inputSpec);
			optTab.appendChild(datalistSpec);
			optTab.appendChild(clearInput2);
		}
		
		document.getElementById("clearInput2").addEventListener("click", () => {
			document.getElementById("selSpec").value = ""; 
			document.getElementById("msgTab").innerHTML = "";
		});
		document.getElementById("selSpec").oninput = function() {
			displayHosps(document.getElementById("selBuild").value, document.getElementById("selSpec").value);
		};
	}
	
	function displayHosps(building, spec){
		let html = document.querySelectorAll(".navItem")[4].innerHTML;
		html += "--> hôpital: " + building.substr(0,4) + ", spécialité: " + spec;
		let value = document.querySelectorAll(".navItem")[4].value;
		displayTable(hospList.filter(h => h.buildCode == building.substr(0,4)).filter(a => a.spec == spec), html, value);
	}
	
	function tableSorter(){
		const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent; //TH TD

		const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
			v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
			)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

		document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
			const tableBody = document.getElementById("tableData");
			Array.from(tableBody.querySelectorAll('tr:nth-child(n+1)'))
				.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
				.forEach(tr => tableBody.appendChild(tr) );
		})));
	};
	
	function setEventListeners(){
		var listItems = document.querySelectorAll(".navItem");

		listItems.forEach(function(item) {
			item.addEventListener("click", () => {appCtrl(item.value, item.innerHTML)});
		});
	}
	
	function init() {
		setEventListeners();
	}
	
	window.onload = function() {
		init();
	};
})();