/**
 * Created by Letty on 18/01/16.
 */

var fs = require('fs');
var async = require('async');

var groupHeader = ['Bevölkerung', 'Sozioökonomische Lage', 'Gesundheitszustand',
	'Gesundheitsvorsorge im Kindesalter', 'Versorgung'];

var transformProfiles = function (profil, cb) {
	var o = {
		area: profil.Bezirk,
		area_id: profil.Bezirksnummer,
		source: profil.Quelle,
		values: []
	};

	o.values.push(parsePopulation(profil['Bevölkerung']));
	o.values.push(parseSocioEconomic(profil['Sozioökonomische Lage']));
	//parseHealth(profil['Gesundheitszustand']);
	o.values.push(parseHealth(profil['Gesundheitszustand']));
	o.values.push(parseChildren(profil['Gesundheitsvorsorge im Kindesalter']));
	o.values.push(parseProvision(profil['Versorgung']));

	fs.writeFile(o.area_id + '_bez.json', JSON.stringify(o, null, 3), function (err) {
		console.log('done<3');
	});

	cb();
};

function parsePopulation(data) {
	var header = ['Bevölkerung insgesamt', 'Bevölkerung nach Altersgruppen', 'Bevölkerungsprognose', 'Bevölkerungsentwicklung'];
	var desc = [
		{
			'Bevölkerung insgesamt': {
				header: ['gesamt', 'männlich', 'weiblich', 'Migrationshintergrund'],
				'Migrationshintergrund': {
					header: ['gesamt', 'mit deutsche Staatsangehörigkeit', 'mit ausländische Staatsangehörigkeit']
				}
			}

		}, {
			'Bevölkerung nach Altersgruppen': {
				header: ['0-5', '6-14', '15-17', '18-39', '40-64', '65-74', '75-x', 'Jugendquotient', 'Altenquotient']
			}
		}, {
			'Bevölkerungsprognose': {
				header: ['0-5', '6-14', '15-17', '18-39', '40-64', '65-74', '75-x', 'Jugendquotient', 'Altenquotient']
			}
		}, {
			'Bevölkerungsentwicklung': {
				header: ['Lebendgeborene', 'Geborene (außerklinisch)', 'Geburtenziffer', 'Fruchtbarkeitsziffer',
					'Gestorbene', 'Sterbeziffer', 'Geburten- bzw. Sterbeüberschuss', 'Wanderungssaldo', 'Bevölkerungszu- oder abnahme']
			}
		}
	];

	var obj = {
		name: 'Bevölkerung',
		values: []
	};

	header.forEach(function (h, i) {
		obj.values.push(proekel(data[h], desc[i], h));
	});

	return obj;
}

function parseSocioEconomic(data) {
	var header = ['Bildungsabschluss (Alter: 18-64 Jahre)', 'Einpersonenhaushalte', 'Erwerbsstatus', 'Einkommen'];
	var desc = [
		{
			'Bildungsabschluss (Alter: 18-64 Jahre)': {
				header: ['Bevölkerung ohne Schulabschluss', 'Bevölkerung ohne berufl. Ausbildungsabschluss']
			}

		}, {
			'Einpersonenhaushalte': {
				header: ['gesamt', 'Einpersonenhaushalte unter 65 J.', 'Einpersonenhaushalte 65 J. u.ä.']
			}
		}, {
			'Erwerbsstatus': {
				header: ['Erwerbstätigenquote (15- bis 64-jährige Erwerbstätige an Bevölkerung gleichen Alters)',
					'Arbeitslosenquote (Arbeitslose an allen zivilen Erwerbspersonen)']
			}
		}, {
			'Einkommen': {
				header: ['HzL und bedarfsorientierte Grundsicherung außerhalb von Einrichtungen', 'Armutsquote']
			}
		}
	];

	var obj = {
		name: 'Sozioökonomische Lage',
		values: []
	};

	header.forEach(function (h, i) {
		obj.values.push(proekel(data[h], desc[i], h));
	});

	return obj;
}

function parseHealth(data) {
	//
	//var obj = {
	//	name: 'Gesundheit',
	//	values: []
	//};
	//for (var key in data) {
	//	var sub = data[key];
	//	sub.name = key;
	//	var o = rec(key,data[key]);
	//	console.log('geht das?-----------------------------------------');
	//	console.log(o);
	//	obj.values.push(o);
	//}
	//
	//function rec(parentName,d) {
	//	//console.log('hey: '+parentName);
	//	var o = {
	//		name: parentName,
	//		values: []
	//	};
	//	for (var key in d) {
	//		if (typeof d[key] == 'object'){
	//			rec(key, d[key]);
	//		}else{
	//			console.log('----------------------------------'+d+'----------------------------------');
	//			console.log(d);
	//			var a = {
	//				name: key,
	//				value: d['Wert'],
	//				date: d['Datum'],
	//				unit: d['Maßeinheit']
	//			};
	//			o.values.push(a);
	//			break;
	//		}
	//	}
	//	console.log('by: ');
	//	return o;
	//}
	//
	//return obj;

	var header = ['Lebenserwartung', 'Allgemeine Sterblichkeit','Vermeidbare Sterbefälle',
		'Morbidität'];

	var desc = [
		{
			'Lebenserwartung': {
				header: ['bei Geburt', 'mit 80 Jahren'],
				'bei Geburt' : {
					header: ['männlich', 'weiblich']
				},
				'mit 80 Jahren' : {
					header: ['männlich', 'weiblich']
				}
			}

		}, {
			'Allgemeine Sterblichkeit': {
				header: ['Gesamtsterblichkeit', 'Vorzeitige Sterblichkeit (0-64 Jahre)',
					'Sterblichkeit 65 Jahre u.ä.'],
				'Gesamtsterblichkeit':{
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Vorzeitige Sterblichkeit (0-64 Jahre)':{
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Sterblichkeit 65 Jahre u.ä.':{
					header: ['gesamt', 'männlich', 'weiblich']
				}
			}
		}, {
			'Vermeidbare Sterbefälle': {
				header: ['Lungenkrebs', 'Ischämiche Herzkrankheiten', 'Akuter Myokardinfarkt',
				'Hypertonie und zerebrovaskuläre Krankheiten', 'Krankheiten der Leber',
				'Alkoholische Leberkrankheit', 'Bösartige Neubildung der Brustdrüse'],
				'Lungenkrebs':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Ischämiche Herzkrankheiten':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Akuter Myokardinfarkt':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Hypertonie und zerebrovaskuläre Krankheiten':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Krankheiten der Leber':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Alkoholische Leberkrankheit':{
					'Klassifikation': true,
					header: ['gesamt', 'männlich', 'weiblich']
				},
				'Bösartige Neubildung der Brustdrüse':{
					'Klassifikation': true,
					header: ['gesamt', 'weiblich']
				}
			}
		}, {
			'Morbidität': {
				header: ['Neuerkrankungsrate an bösartigen Neubildungen',
					'Neuerkrankungsrate an tabakassoziierten bösartigen Neubildungen',
					'Pflegebedürftige in ambulanter oder stationärer Pflege',
				'Schwerbehinderte Personen mit Schwb-Ausweis',
				'Zahnstatus behandlungsbedürftig bei vom ZÄD untersuchten Kindern',
				'Übergewicht (im Rahmen der Einschulungsunter- suchung untersuchte Kinder; mittleres Alter: 5,8 Jahre)'],
				'Neuerkrankungsrate an bösartigen Neubildungen': {
					'Klassifikation': true,
					header: ['männlich', 'weiblich']
				},
				'Neuerkrankungsrate an tabakassoziierten bösartigen Neubildungen': {
					'Klassifikation': true,
					header: ['männlich', 'weiblich']
				},
				'Pflegebedürftige in ambulanter oder stationärer Pflege': {
					header: ['gesamt','ambulante Pflege', 'stationäre Pflege']
				},
				'Schwerbehinderte Personen mit Schwb-Ausweis': {
					header: ['gesamt' ,'männlich', 'stationäre Pflege']
				},
				'Zahnstatus behandlungsbedürftig bei vom ZÄD untersuchten Kindern': {
					header: ['3-Jährige' ,'6-Jährige', '12-Jährige']
				},
				'Übergewicht (im Rahmen der Einschulungsunter- suchung untersuchte Kinder; mittleres Alter: 5,8 Jahre)': {
					header: ['untersuchte Kinder' ,'übergewichtig (>90. bis 97. Perzentil)',
						'adipös (>97. Perzentil)']
				}
			}
		}
	];

	var obj = {
		name: 'Gesundheitszustand',
		values: []
	};

	header.forEach(function (h, i) {
		obj.values.push(proekel(data[h], desc[i], h));
	});

	//console.log(obj.values[1].values);
	console.log(data['Allgemeine Sterblichkeit']['Perinatale Sterblichkeit'][0]['Wert']);
	obj.values[1].values.push(
		{
			"name": "Perinatale Sterblichkeit",
			"values": [
				{
					"name": "Perinatale Sterblichkeit",
					"value": data['Allgemeine Sterblichkeit']['Perinatale Sterblichkeit'][0]['Wert'],
					"date": "2011/13",
					"unit": "absolut"
				}, {
					"name": "Perinatale Sterblichkeit",
					"value": data['Allgemeine Sterblichkeit']['Perinatale Sterblichkeit'][1]['Wert'],
					"date": "2011/13",
					"unit": "je 1.000 Geborene"
				}
			]
		});

//	header.forEach(function (h, i) {
//		var o = rec(h, data[h]);
//console.log(o);
//		obj.values.push(o);
//	});
//
//	function rec(parentName,d) {
//		var o = {
//			name: parentName,
//			values: []
//		};
//		for (var key in d) {
//			if (typeof d[key] == 'object') {
//				rec(key, d[key]);
//			} else {
//				//console.log('----------------------------------' + d + '----------------------------------');
//				//console.log(d);
//				var a = {
//					name: key,
//					value: d['Wert'],
//					date: d['Datum'],
//					unit: d['Maßeinheit']
//				};
//				o.values.push(a);
//				break;
//			}
//		}
//		//console.log('by: ');
//		return o;
//	}

	return obj;
}

function parseProvision(data) {
	var header = ['Ambulant', 'Stationär'];
	var desc = [
		{
			'Ambulant': {
				header: ['Ärzte', 'Hausärzte', 'Zahnärzte', 'Psychotherapeut']
			}

		}, {
			'Stationär': {
				header: ['Krankenhausbetten']
			}
		}
	];

	var obj = {
		name: 'Versorgung',
		values: []
	};

	header.forEach(function (h, i) {
		obj.values.push(proekel(data[h], desc[i], h));
	});

	obj.values.push(
		{
			"name": "Pflegerisch",
			"values": [
				{
					"name": "Plätze in stationären Pflegeeinrichtungen",
					"value": data['Pflegerisch']['Plätze in stationären Pflegeeinrichtungen'][0]['Wert'],
					"date": "15.12.2013",
					"unit": "absolut"
				}, {
					"name": "Plätze in stationären Pflegeeinrichtungen",
					"value": data['Pflegerisch']['Plätze in stationären Pflegeeinrichtungen'][1]['Wert'],
					"date": "15.12.2013",
					"unit": "je 100.000 EW 65 J. u.ä."
				}
			]
		});

	return obj;
}


function parseChildren(data) {
	var header = ['Inanspruchnahme des Krankheitsfrüherkennungsprogramms', 'Impfquoten'];
	var desc = [
		{
			'Inanspruchnahme des Krankheitsfrüherkennungsprogramms': {
				header: ['untersuchte Kinder', 'Kinder ohne Dokumentation',
					'Teilnahme an U 8 (Anteil an Einschülern mit Dokumentation)']
			}

		}, {
			'Impfquoten': {
				header: ['untersuchte Kinder', 'Kinder ohne Impfdokumentation', 'Impfquoten 2. Masernimpf. bei Kindern mit Dokumentation']
			}
		}
	];

	var obj = {
		name: 'Gesundheitsvorsorge im Kindesalter',
		values: []
	};

	header.forEach(function (h, i) {
		obj.values.push(proekel(data[h], desc[i], h));
	});

	return obj;
}


function proekel(data, header, name) {
	var o = {
		name: name,
		values: []
	};
	var h = header[name].header;
	if(header[name]['Klassifikation']) o.classification = data['Klassifikation'];

	h.forEach(function (h2) {
		var o2;
		var d = data[h2];
		if (header[name][h2]) {
			o2 = proekel(data[h2], header[name], h2);
			o.values.push(o2);
		} else {
			//console.log(d);
			o2 = {
				name: h2,
				value: d['Wert'],
				date: d['Datum'],
				unit: d['Maßeinheit']
			};
			o.values.push(o2);
		}
	});

	return o;
}

var profiles = [];
for (var i = 1; i < 13; i++) {
	profiles.push((i < 10 ? '0' : '') + i);
}

async.forEachSeries(profiles, function (p, nextProfile) {
	console.log('[load profile]', '\t', p);
	var profile = JSON.parse(fs.readFileSync('bezirksprofile/' + p + '_Bezirksprofil.json').toString());
	transformProfiles(profile, nextProfile);
});
