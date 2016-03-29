#dataofdataofberlin

Aufgehübschte Daten aus Berlin auf verschiedenen geografischen Ebenen:

* Bezirke
* Planungsräume
* Prognoseräume


## Aufbau der Daten
Fast alle Daten haben eine einheitliche Datenstruktur (Ausnahme: Bezirksprofile)

	{
		"name": "Name des Datensatzes",
		"date": "Erhebungsdatum",
		"src": {
			"name": "Konkreter Name des Datensatzes in der Quelle",
			"url": "URL zum Datensatz",
			"license": "..",
			"publisher": {
	  			"name": "Herausgeber der Daten",
	  			"url": "..."
			}
  		},
  		"values": [
  		// sofern es nur einen Datensatz gibt, erfolgt hier die Auflistung der 
  		// einzelnen Daten
  		
  		// falls es mehrere Datensätze gibt, kann die Angabe der Quelle auch hier 
  		// enthalten sein
  		
  		{
	  		"geografischer Bezugsraum": "Nummer", // (zB "Bezirk": "01")
	  		"values": [
			{
		  		"name": "Merkmal",
		  		"value": Wert,
		  		"date" : Datum,
		  		"unit" : "Einehit"
			},
			{
		  		"name": "Merkmal",
			  	"value": Wert,
		  		"date" : Datum,
		  		"unit" : "Einehit"
			  	// Einzelne Merkmale ebenfalls wieder values besitzen können
			},
			{...}
	  	]
		},
  		{ ... }, { ... }, ... ]
	}

## Bezirksprofile
Der Aufbau der Datei unterscheidet sich nur in den Feldern vor den values

	{
	   "area": "Bezirksname",
	   "area_id": "Bezirksnummer",
   		"values": [ { ... },{ ... },{ ... } ]