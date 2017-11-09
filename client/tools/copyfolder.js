let _folder = process.argv[1];
let _source = process.argv[2];
let _dest = process.argv[3];

const fs = require("fs");

fs.readdir(_source, (err, files) => {
	if (files) {
		files.forEach(file => {
			copyFile(_source + file, _dest + file, () => {});
		});
	} else {
		console.log(err);
	}
});

function copyFile(file, target) {
	if ((file, target)) {
		fs.readFile(file, (err, data) => {
			fs.writeFile(data, target, err => {
				if (err) {
					console.log(err);
				} else {
					console.log("file saved ", target);
				}
			});
		});
	}
}
