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

function proekel(data, header, name) {
	var o = {
		name: name,
		values: []
	};
	var h = header[name].header;

	h.forEach(function (h2) {
		var o2;
		var d = data[h2];
		if (header[name][h2]) {
			o2 = proekel(data[h2], header[name], h2);
			o.values.push(o2);
		} else {
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
