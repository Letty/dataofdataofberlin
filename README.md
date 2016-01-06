#dataofdataofberlin

Befreite Daten über Berlin.

##Bezirksprofile
* enthält die Daten pro Bezirks in einer json-Datei
* Dateiname: `<lorNummer>_Bezirksprofil.json`
* Quelle der Berichte [GSI-Berlin](http://www.gsi-berlin.info/gsi_suchen.asp?seite=2&CBFest=Kategorie,Bereich,Thema,Unterthema&Kategorie=Berichte&Bereich=GBE&Thema=Basisberichte&Unterthema=Bezirksprofile)
* wobei die Hierarchieebenen (blauer Balken, fettgedruckte Überschriften) erhalten geblieben sind inform von Objekten/ Unterobjekten
* eine Zeile besteht aus einem Objekt mit den Feldern: Wert, Datum und Maßeinheit

	"Bevölkerung": {
   	"Bevölkerung insgesamt": {
   	  "gesamt": {
   		"Wert": 326354,
   		"Datum": "31.12.2014",
   		"Maßeinheit": "absolut"
   	  }, ...
   	}
   }

* Ausnahme sind Zeilen die in zwei Maßeinheiten angegebn sind, diese enthalten ein Array von Objekten

	"Versorgung": {
      	"Pflegerisch": {
         	  "Plätze in stationären Pflegeeinrichtungen": [
         		{
         		  "Wert": 2996,
         		  "Datum": "15.12.2013",
         		  "Maßeinheit": "absolut"
         		},
         		{
         		  "Wert": 4119.9,
         		  "Datum": "15.12.2013",
         		  "Maßeinheit": "je 100.000 EW 65 J. u.ä."
         		}
         	  ]
         	}
   }