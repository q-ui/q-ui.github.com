function radioChangeHandler() {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            if (selectedType != radios[i].value) {
                selectedType = radios[i].value;
                redrawMap(selectedType);
            }
            break;
        }
    }
}

function redrawMap(type) {
    d3.json('data/' + type.toLowerCase() + '.geo.json', function (err, geoData) {
        if (type.toLowerCase() == 'china') {
            map.nameField('abbreviation');
        } else if (type.toLowerCase() == 'world') {
            map.nameField('iso_a2');
        }
        map.draw(geoData);
        d3.json('data/' + type.toLowerCase() + '.data.json', function (err, data) {
            map.fillData(data);
        });
    });
}

var radios = document.getElementsByName('type');
var selectedType;
var container = document.querySelector('.container');
var map = Map().container(container).width(container.clientWidth).height(container.clientHeight);
for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = radioChangeHandler;
}
radios[0].checked = true;
radios[0].onclick();
