# 机器学习k-nearest-neighbor算法
k-nearest-neighbor算法是一种监督学习算法

机器学习两大类:监督学习和非监督学习

非监督学习:收集挖掘数据,从数据中尝试得出有用的结论,通常在一开始处理数据之前没有更多的关于数据的信息可供参考.

监督学习:从训练数据开始,就如我们小时候作为孩子了解世界的过程.重复学习过程.训练数据不是每次都一样,但是通过训练数据能够得出有用的结论.这是一个泛化的过程.我们希望我们的算法能够实现泛化但又不能过度泛化.

## kNN算法
它是一种归类算法.

特征:机器学习中一个重要概念.从对象中提取出来,能够放入机器学习过程中的信息.考虑对象的哪种特征能有最大效率的辨别对象的能力.

例子:给出一个住宅的房屋数和面积,判断住宅是apartment,house,flat.
给定一组数据,从此数据集中获取有用的结论
```js
var data = [
    { rooms: 1, area: 350, type: 'apartment' },
    { rooms: 2, area: 300, type: 'apartment' },
    { rooms: 3, area: 300, type: 'apartment' },
    { rooms: 4, area: 250, type: 'apartment' },
    { rooms: 4, area: 500, type: 'apartment' },
    { rooms: 4, area: 400, type: 'apartment' },
    { rooms: 5, area: 450, type: 'apartment' },
    ...
    ...
    ...
];
```
我们以rooms作为横坐标,area作为纵坐标,将每个数据对象都在坐标轴上表示出来.

当我们想知道某个已知房间数和面积但未知类型的住宅时,可以将其在坐标轴上的点表示出来,假定一个数k,找到图中最接近未知点的k个数据,判断这k个数据中主要是flat还是apartment还是house,如果主要是flat,那么久猜测这个未知点的住宅类型是flat,这就是kNN算法.

具体的过程:
* 把所有数据包括未知类型的数据放入坐标轴中
* 测量未知类型点和每个点的距离
* 选取一个k值
* 找出哪k个值离未知点最近
* k个点中的多数点所代表的类型就是我们猜测的未知点的类型

## 通过js实现kNN算法并在canvas中展示
首先,创建两个类Node和NodeList,Node代表数据集中的一个数据点或者未知点,NodeList是一组Node及一些功能
```js
var Node = function (object) {
    for (var key in object) {
        this[key] = object[key]
    }
};
```
这是一个Node对象,属性有type,area,rooms
```js
var NodeList = function (k) {
    this.nodes = [];
    this.k = k;
};
```
这是一个NodeList对象,把kNN中的k作为唯一的参数.

然后,用`NodeList.prototype.add(node)`函数把node加入nodes数组中.
```js
NodeList.prototype.add = function (node) {
    this.nodes.push(node);
};
```
在计算距离之前,我们需要将房间数目1到10,面积250到1700归一化到0到1之间,消除比例矛盾的问题
```js
NodeList.prototype.calculateRanges = function () {
    this.areas = { min: 1000000, max: 0 };
    this.rooms = { min: 1000000, max: 0 };
    for (var i in this.nodes) {
        if (this.nodes[i].rooms < this.rooms.min) {
            this.rooms.min = this.nodes[i].rooms;
        }

        if (this.nodes[i].rooms > this.rooms.max) {
            this.rooms.max = this.nodes[i].rooms;
        }

        if (this.nodes[i].area < this.areas.min) {
            this.areas.min = this.nodes[i].area;
        }

        if (this.nodes[i].area > this.areas.max) {
            this.areas.max = this.nodes[i].area;
        }
    }
};
```
给NodeList提供一个能够找出每个特征数据最大值和最小值的方法

接下来就可以计算距离,确定未知点了
```js
NodeList.prototype.determineUnknown = function () {

    this.calculateRanges();//首先计算最大最小值范围

    for (var i in this.nodes) {//循环Node集合寻找未知Node,一旦发现某个未知Node,就把所有已知的Node克隆出来作为该未知Node的邻居序列,用来计算该未知Node和所有已知Node的距离

        if (!this.nodes[i].type) {
            this.nodes[i].neighbors = [];
            for (var j in this.nodes) {
                if (!this.nodes[j].type)
                    continue;
                this.nodes[i].neighbors.push(new Node(this.nodes[j]));
            }

            //调用未知Node的三个方法
            this.nodes[i].measureDistances(this.areas, this.rooms);

            this.nodes[i].sortByDistance();

            console.log(this.nodes[i].guessType(this.k));
        }
    }
};
//measureDistances方法(参数为面积和房间数最大最小值区间)
Node.prototype.measureDistances = function (area_range_obj, rooms_range_obj) {
    var rooms_range = rooms_range_obj.max - rooms_range_obj.min;
    var area_range = area_range_obj.max - area_range_obj.min;

    //处理未知Node的所有邻居点
    for (var i in this.neighbors) {
        var neighbor = this.neighbors[i];

        var delta_rooms = neighbor.rooms - this.rooms;
        delta_rooms = (delta_rooms) / rooms_range;

        var delta_area = neighbor.area - this.area;
        delta_area = (delta_area) / area_range;
        //勾股定理计算距离
        neighbor.distance = Math.sqrt(delta_rooms * delta_rooms + delta_area * delta_area);
    }
};
//sortByDistance方法,用距离来排序
Node.prototype.sortByDistance = function () {
    this.neighbors.sort(function (a, b) {
        return a.distance - b.distance;
    });
};
//guessType方法(参数为k),找出k个最接近该店的邻居,按照邻居的类型标记,找出占大多数的一类,返回这个类型
Node.prototype.guessType = function (k) {
    var types = {};

    for (var i in this.neighbors.slice(0, k)) {
        var neighbor = this.neighbors[i];

        if (!types[neighbor.type]) {
            types[neighbor.type] = 0;
        }

        types[neighbor.type] += 1;
    }

    var guess = { type: false, count: 0 };
    for (var type in types) {
        if (types[type] > guess.count) {
            guess.type = type;
            guess.count = types[type];
        }
    }

    this.guess = guess;

    return types;
}
```

最后,用canvas画出结果
```js
NodeList.prototype.draw = function (canvas_id) {
    var rooms_range = this.rooms.max - this.rooms.min;
    var areas_range = this.areas.max - this.areas.min;
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");
    var width = 400;
    var height = 400;
    ctx.clearRect(0, 0, width, height);

    for (var i in this.nodes) {
        ctx.save();
        
        //用颜色标记类型,apartment=红色,houses=绿色,flat=蓝色
        switch (this.nodes[i].type) {
            case 'apartment':
                ctx.fillStyle = 'red';
                break;
            case 'house':
                ctx.fillStyle = 'green';
                break;
            case 'flat':
                ctx.fillStyle = 'blue';
                break;
            default:
                ctx.fillStyle = '#666666';
        }

        var padding = 40;
        var x_shift_pct = (width - padding) / width;
        var y_shift_pct = (height - padding) / height;

        var x = (this.nodes[i].rooms - this.rooms.min) * (width / rooms_range) * x_shift_pct + (padding / 2);
        var y = (this.nodes[i].area - this.areas.min) * (height / areas_range) * y_shift_pct + (padding / 2);
        y = Math.abs(y - height);


        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        if (!this.nodes[i].type) {
            switch (this.nodes[i].guess.type) {
                case 'apartment':
                    ctx.strokeStyle = 'red';
                    break;
                case 'house':
                    ctx.strokeStyle = 'green';
                    break;
                case 'flat':
                    ctx.strokeStyle = 'blue';
                    break;
                default:
                    ctx.strokeStyle = '#666666';
            }

            var radius = this.nodes[i].neighbors[this.k - 1].distance * width;
            radius *= x_shift_pct;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }
};
```

## kNN算法缺点
* 数据训练集密集,充满整个空间,就很难从中学习出有用的结果
* 数据训练集太大,计算效率会降低