var fs = require('fs');

(function () {
    var projectName = process.argv[2];

    var demoPath = 'demo_graph';
    var demoIndexHtml = demoPath + '/index.html';
    var demoScriptJs = demoPath + '/js/script.js';
    var demoStyleCss = demoPath + '/css/style.css';
    var demoDataJson = demoPath + '/data/data.json';

    var dirPath = handleName('project');

    if (fs.existsSync(dirPath)) {
        console.log('Already exists!');
        return;
    } else {
        // 创建文件夹
        mkdir_project();

        // 创建index.html
        mk_index_html();

        // 创建style.css
        mk_style_css();

        // 创建script.js
        mk_script_js();

        // 创建data.json
        mk_data_json();

        // 修改主目录下的index.html文件
        modify_index_html();
    }

    function handleName(type) {
        if (type == 'project') {
            return projectName.toLowerCase().replace(/-/g, '_');
        }
        if (type == 'title') {
            return projectName.toLowerCase().replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
                return $1.toUpperCase() + $2.toLowerCase();
            });;
        }
        if (type == 'class') {
            return 'd3-' + projectName.replace(/_/g, '-');
        }
        return projectName;
    }

    function mkdir_project() {
        fs.mkdirSync(dirPath);

        var jsDirPath = dirPath + '/js';
        fs.mkdirSync(jsDirPath);

        var cssDirPath = dirPath + '/css';
        fs.mkdirSync(cssDirPath);

        var dataDirPath = dirPath + '/data';
        fs.mkdirSync(dataDirPath);

        console.log('directors creation complete!');
    }

    function mk_index_html() {
        var data = fs.readFileSync(demoIndexHtml);
        data = data.toString();
        data = data.replace('Demo Graph', handleName('title')).replace('d3-demo-graph', handleName('class'));

        fs.writeFile(dirPath + '/index.html', data, function (error) {
            if (error) throw error;
            console.log('index.html creation complete!');
        })
    }

    function mk_style_css() {
        var data = fs.readFileSync(demoStyleCss);
        data = data.toString();

        fs.writeFile(dirPath + '/css/style.css', data, function (error) {
            if (error) throw error;
            console.log('style.css creation complete!');
        })
    }

    function mk_script_js() {
        var data = fs.readFileSync(demoScriptJs);
        data = data.toString();
        data = data.replace('d3-demo-graph', handleName('class'));

        fs.writeFile(dirPath + '/js/script.js', data, function (error) {
            if (error) throw error;
            console.log('script.js creation complete!');
        })
    }

    function mk_data_json() {
        var data = fs.readFileSync(demoDataJson);
        data = data.toString();

        fs.writeFile(dirPath + '/data/data.json', data, function (error) {
            if (error) throw error;
            console.log('data.json creation complete!');
        })
    }

    function modify_index_html() {
        var data = fs.readFileSync('index.html');
        data = data.toString();
        var arr = data.split('</ul>');
        if (arr.length > 1) {
            var strHtml = '<li><a href="' + handleName('project') + '/index.html">' + handleName('title') + '</a></li>'
            data = arr[0] + strHtml + '</ul>' + arr[1];
        }

        fs.writeFile('index.html', data, function (error) {
            if (error) throw error;
            console.log('index.html modification complete!');
        })
    }
})()