export function load(fs: any, cache: any) {
  loadAllFilesFromFolder(fs, cache, './data/');
}

function loadAllFilesFromFolder(fs: any, cache: any, path: string) { 
  fs.readdir(path, function (err: any, filenames: string[]) {
    if (err) {
      throw err;
    }
    filenames.forEach(function (filename: string) {
      const fileCompletePath = `${path}/${filename}`;

      if (fs.existsSync(fileCompletePath) && !fs.lstatSync(fileCompletePath).isDirectory()) {
        fs.readFile(fileCompletePath, 'utf-8', function (err: any, data: any) {
          if (err) {
            throw err;
          }
          if (filename !== '.DS_Store') {
            cache.set(filename.replace('.json', ''), JSON.parse(data));
            console.log(`\t${filename}`);
          }
        });
      } else if (fs.existsSync(fileCompletePath) && fs.lstatSync(fileCompletePath).isDirectory()) {
        loadAllFilesFromFolder(fs, cache, fileCompletePath);
      }
    });
  });
}
