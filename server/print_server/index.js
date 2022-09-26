var fs = require("fs"),
	gm = require("gm"),
	YAML = require("yamljs");
var Printer = require("ipp-printer");

const config_filepath = __dirname + "/../config.yml";
const config = YAML.load(config_filepath).PRINT_SERVER;

console.log(
	`Starting PRINT server named ${config.printer_name} on port ${config.port}`
);

var printer = new Printer({
	name: config.printer_name,
	port: config.port,
});

printer.on("job", function (job) {
	console.log("[job %d] Printing document: %s", job.id, job.name);
	var filename = "job-" + job.id + ".ps"; // .ps = PostScript
	var file = fs.createWriteStream(filename);
	job.pipe(file);

	job.on("end", function () {
		console.log("[job %d] Document saved as %s", job.id, filename);
		ps2bmp(filename);
	});
});

function convert(filename) {
	console.log("converting postscript");
	gm(filename)
		.density(150, 150)
		// .resizeExact(1200,825)
		//.monochrome()
		.write(filename + ".png", function (err) {
			if (err) {
				console.log("converting postscript failed");
				console.log(err);
			} else {
				console.log("converting postscript finished");
				python_script(filename + ".png");
				// client(filename+'.png');
			}
		});
}

function ps2bmp(filename) {
	file_wo_end = filename.slice(0, -3);
	var spawn = require("child_process").spawn;
	var process = spawn("gs", [
		"-sDEVICE=bmpgray",
		"-dNOPAUSE",
		"-dBATCH",
		"-dSAFER",
		"-r145",
		"-g825x1200",
		"-dPDFFitPage",
		"-sOutputFile=" + file_wo_end + "_%d.bmp",
		filename,
	]);

	process.stdout.on("data", function (data) {
		console.log("gs: " + data);
	});

	process.on("exit", function () {
		python_script(filename);
	});
}

// execute the script which scans the directory, deletes ps files, moves bmp files
function python_script(filename) {
	console.log("executing python script");
	var spawn = require("child_process").spawn;
	var process = spawn("python", [
		__dirname + "/new_image.py",
		__dirname + "/" + filename,
	]);

	process.stdout.on("data", function (data) {
		console.log("python: " + data);
	});
}