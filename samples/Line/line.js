var svg, gNode, gLine;
var dimension = 3, curLevel = 1, curTimes = 0, curScole = 0;
var maxLevel = 8;
var radius = 0;
var width = 400, height = 400;
var delay = 500, duration = 500;
var autoNodes = [], userNodes = [];
var isFailed = false;
var autoClear = true;
var levels = [
    { times: 1, score: 1 },
    { times: 2, score: 2 },
    { times: 3, score: 3 },
    { times: 4, score: 4 },
    { times: 5, score: 5 },
    { times: 6, score: 6 },
    { times: 7, score: 7 },
    { times: 8, score: 8 }
]
var color = {
    fill: {
        default: 'gray',
        hightlight: 'lightblue'
    },
    stroke: {
        default: 'gray',
        hightlight: 'red',
    }
}



//// ########## 主要功能 ##########
function main() {
    // 初始化游戏
    initGame();

    // 添加游戏按键事件
    handleGameButtons();

    // 添加游戏事件监听
    document.addEventListener('gamestart', function () { onGameStart(); });
    document.addEventListener('gamepass', function () { onGamePass(); });
    document.addEventListener('gamefail', function () { onGameFail(); });
    document.addEventListener('gamereset', function () { onGameReset(); });
    document.addEventListener('startuserphase', function () { onStartUserPhase(); });
    document.addEventListener('enduserphase', function () { onEndUserPhase(); });
}

//// ########## 逻辑代码 ##########
// 初始化svg元素和gNode、gLine组
function initGame() {
    svg = d3.select('svg')
        .style('width', width)
        .style('height', height)
        .style('border', '1px solid ' + color.fill.default);
    gNode = svg
        .append('g')
        .attr('class', 'node');
    gLine = svg
        .append('g')
        .attr('class', 'line');
}

// 添加Start、Reset按键事件
function handleGameButtons() {
    d3.select('#start')
        .on('click', function () {
            onStartButtonClick();
        });

    d3.select('#reset')
        .on('click', function () {
            onResetButtonClick();
        })
}

// 配置当前关卡的参数
function configLevel() {
    if (levels[curLevel - 1].times == curTimes) {
        curLevel++;
        curTimes = 0;
        dimension++;
    }
    radius = width / (dimension * 16);

    curScole = calUserScole();
    showMessage('当前关卡：' + curLevel + '，过关次数：' + curTimes + '，当前得分：' + curScole);
}

// 生成随机路线节点数组
function genRandomNodes() {
    var curNode = { x: 0, y: 0 };
    var nextNode;
    autoNodes = [curNode];
    while (!isLastNode(curNode)) {
        nextNode = findNextNode(curNode);
        if (!autoNodes.contains(nextNode)) {
            autoNodes.push(nextNode);
            curNode = nextNode;
        }
    }
}

// 查找下一个节点
function findNextNode(curNode) {
    var number = 0;
    var random = Math.random();
    if (curNode.x == 0) {
        if (curNode.y == 0) {
            // 左上角，只能选择 2、3
            number = Math.ceil(random * 2) + 1;
        } else if (curNode.y == dimension - 1) {
            // 左下角，只能选择 1、2
            number = Math.ceil(random * 2);
        } else {
            // 左轴上，只能选择 2、3
            number = Math.ceil(random * 2) + 1;
        }
    } else if (curNode.x == dimension - 1) {
        if (curNode.y == 0) {
            // 左上角，只能选择 3、4
            number = Math.ceil(random * 2) + 2;
        } else if (curNode.y == dimension - 1) {
            // 右下角
            number = 0;
        } else {
            // 右轴上，只能选择 3、4
            number = Math.ceil(random * 2) + 2;
        }
    } else if (curNode.y == 0) {
        if (curNode.x == 0) {
            // 左上角，只能选择 2、3
            number = Math.ceil(random * 2) + 1;
        } else if (curNode.x == dimension - 1) {
            // 右上角，只能选择 3、4
            number = Math.ceil(random * 2) + 2;
        } else {
            // 顶轴上，只能选择 2、3
            number = Math.ceil(random * 2) + 1;
        }
    } else if (curNode.y == dimension - 1) {
        if (curNode.x == 0) {
            // 左下角，只能选择 1、2
            number = Math.ceil(random * 2) + 1;
        } else if (curNode.x == dimension - 1) {
            // 右下角
            number = 0;
        } else {
            // 底轴上，只能选择 1、2
            number = Math.ceil(random * 2);
        }
    } else {
        // 中间区域，选择 1、2、3、4
        number = Math.ceil(random * 4);
    }
    var nextNode = {};
    switch (number) {
        case 1: // up
            nextNode.x = curNode.x;
            nextNode.y = curNode.y - 1;
            break;
        case 2: // right
            nextNode.x = curNode.x + 1;
            nextNode.y = curNode.y;
            break;
        case 3: // down
            nextNode.x = curNode.x;
            nextNode.y = curNode.y + 1;
            break;
        case 4: // left
            nextNode.x = curNode.x - 1;
            nextNode.y = curNode.y;
            break;
    }
    return nextNode;
}

// 游戏是否结束
function isGameOver() {
    if (curLevel == maxLevel && curTimes == levels[maxLevel - 1].times) {
        return true;
    }
    if (isFailed) {
        return true;
    }
    return false;
}

// 清空当前画布
function clearGameMap() {
    autoNodes = [];
    userNodes = [];

    gNode.selectAll('circle')
        .remove();

    gLine.selectAll('line')
        .remove();
}

//// ########## 公用方法 ##########
// 数组添加额外方法
Array.prototype.contains = function (node) {
    return this.filter(function (item) {
        return (item.x == node.x && item.y == node.y)
    }).length > 0;
}

// 根据node的x、y值查找node selection
function findNodeSelByIndex(xIndex, yIndex) {
    var strClass = 'x' + xIndex + 'y' + yIndex;
    return gNode.selectAll('circle.' + strClass);
}

// 根据d3.event获取鼠标当前所对应的node selection
function findNodeSelByEvent(event) {
    var rect = svg.node().getBoundingClientRect();
    var offsetLeft = event.x - rect.left;
    var offsetTop = event.y - rect.top;
    var unit = width / (dimension * 2);
    var x = Math.floor(Math.floor(offsetLeft / unit) / 2);
    var y = Math.floor(Math.floor(offsetTop / unit) / 2);
    return findNodeSelByIndex(x, y);
}

// 获取当前序号所对应的位置，暂时只支持正方形svg
function getLocation(index) {
    var unit = width / (dimension * 2);
    return (index * 2 + 1) * unit;
}

// 是否为最后一个节点
function isLastNode(node) {
    return node.x == dimension - 1 && node.y == dimension - 1;
}

// 对比两个节点是否为同一点
function compareNodes(nodeA, nodeB) {
    return (nodeA.x == nodeB.x && nodeA.y == nodeB.y);
}

// 检查指定节点是否与生成的节点一致
function checkNodeValid(node) {
    var i = userNodes.length;
    if (i < autoNodes.length && compareNodes(autoNodes[i], node)) {
        userNodes.push(node);
        return (i == autoNodes.length - 1 && isLastNode(node)) ? 1 : 0;
    } else {
        return -1;
    }
}

// 计算玩家得分数
function calUserScole() {
    var score = 0;
    for (var i = 0; i < curLevel - 1; i++) {
        score += levels[i].times * levels[i].score;
    }
    score += levels[curLevel - 1].score * curTimes;
    return score;
}

// 派发事件
function fireEvent(eventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, false, false);
    document.dispatchEvent(event);
}

// 输出内容
function showMessage(msg) {
    d3.selectAll('.message').text(msg);
}

//// ########## 事件方法 ##########
function onStartButtonClick() {
    fireEvent('gamestart');
}

function onResetButtonClick() {
    fireEvent('gamereset');
}

// 游戏开始
function onGameStart() {
    // 第一步：计算当前关卡的参数
    configLevel();

    // 第二步：清空当前画布
    clearGameMap();

    // 第三步：绘制所有节点元素
    drawGameNodes();

    // 第四步：生成随机路线
    genRandomNodes();

    // 第五步：绘制生成的随机节点
    drawAutoNode();

    // 第六步：绘制生成的随机路线
    drawAutoLine();
}

// 游戏通关
function onGamePass() {
    isFailed = false;
    curTimes++;
    fireEvent('enduserphase');
}

// 游戏失败
function onGameFail() {
    isFailed = true;
    fireEvent('enduserphase');
    
    curScole = calUserScole();
    showMessage('游戏结束，总得分：' + curScole);
}

// 游戏重置
function onGameReset() {
    curLevel = 1;
    curTimes = 0;
    dimension = 3;
    score = 0;

    clearGameMap();

    d3.select('#start').attr('disabled', null);
    d3.select('#reset').attr('disabled', true);

    fireEvent('enduserphase');

    showMessage('');
}

// 开启用户交互
function onStartUserPhase() {
    svg.on('mousemove', function () {
        gNode.selectAll('circle')
            .style('fill', function (d) {
                var selection = findNodeSelByEvent(d3.event);
                return compareNodes(selection.data()[0], d) ? color.fill.hightlight : color.fill.default;
            });
    }).on('mouseout', function () {
        gNode.selectAll('circle')
            .style('fill', color.fill.default);
    }).on('click', function () {
        var node = findNodeSelByEvent(d3.event);

        if (userNodes.contains(node.data()[0]))
            return;

        var flag = checkNodeValid(node.data()[0]);
        if (flag == 1 || flag == 0) {
            node.style('stroke', color.stroke.hightlight)
                .style('stroke-width', '4px');
            if (userNodes.length > 1) {
                drawGameLine(userNodes[userNodes.length - 2], node.data()[0]);
            }
            if (flag == 1) {
                fireEvent('gamepass');
            }            
        } else if (flag == -1) {
            fireEvent('gamefail');
        }
    })
}

// 停止用户交互
function onEndUserPhase() {
    svg.on('mousemove', null)
        .on('mouseout', null)
        .on('click', null);
    
    if (!isFailed) {
        fireEvent('gamestart');
    }
}

//// ########## 图形绘制 ##########
function drawGameNodes() {
    for (var i = 0; i < dimension; i++) {
        for (var j = 0; j < dimension; j++) {
            drawGameNode({ x: i, y: j });
        }
    }
}

// 绘制节点
function drawGameNode(node) {
    gNode.selectAll('circle.' + 'x' + node.x + 'y' + node.y)
        .data([node])
        .enter()
        .append('circle')
        .attr('cx', getLocation(node.x))
        .attr('cy', getLocation(node.y))
        .attr('r', radius)
        .attr('class', 'x' + node.x + 'y' + node.y)
        .attr('fill', color.fill.default)
}

// 绘制随机生成的节点
function drawAutoNode() {
    autoNodes.forEach(function (node, index) {
        var selNode = findNodeSelByIndex(node.x, node.y);
        selNode.transition()
            .duration(duration)
            .delay(index * delay)
            .style('fill', color.fill.hightlight)
            .on('end', function (d, i) {
                if (autoClear) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .delay(delay)
                        .style('fill', color.fill.default)
                };                
            });
    })
}

// 绘制随机生成的连线图
function drawAutoLine() {
    gLine.selectAll('line')
        .data(autoNodes)
        .enter()
        .append('line')
        .attr('x1', function (d, i) {
            return getLocation(d.x);
        })
        .attr('y1', function (d, i) {
            return getLocation(d.y);
        })
        .attr('x2', function (d, i) {
            if (i < autoNodes.length - 1) {
                return getLocation(autoNodes[i + 1].x);
            } else {
                return getLocation(autoNodes[i].x);
            }
        })
        .attr('y2', function (d, i) {
            if (i < autoNodes.length - 1) {
                return getLocation(autoNodes[i + 1].y);
            } else {
                return getLocation(autoNodes[i].y);
            }
        })
        .style('stroke', 'transparent')
        .style('stroke-width', '4px');

    gLine.selectAll('line')
        .transition()
        .delay(function (d, i) {
            return i * delay;
        })
        .duration(duration)
        .ease(d3.easeLinear)
        .style('stroke', color.fill.hightlight)
        .style('stroke-width', '4px')

        .on('end', function (d, i) {
            d3.select(this)
                .transition()
                .delay(delay)
                .duration(duration)
                .ease(d3.easeLinear)
                .remove()
                .on('end', function () {
                    if (i == autoNodes.length - 1) {
                        d3.select('#reset').attr('disabled', null);
                        fireEvent('startuserphase');
                    }
                });
        });
}

// 绘制连接线
function drawGameLine(start, end) {
    var x1 = getLocation(start.x);
    var y1 = getLocation(start.y);
    var x2 = getLocation(end.x);
    var y2 = getLocation(end.y);

    if (start.x == end.x) {
        if (start.y < end.y) {
            y1 += radius;
            y2 -= radius;
        } else {
            y1 -= radius;
            y2 += radius;
        }
    } else if (start.y == end.y) {
        if (start.x < end.x) {
            x1 += radius;
            x2 -= radius;
        } else {
            x1 -= radius;
            x2 += radius;
        }
    }

    gLine.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .style('stroke', color.stroke.hightlight)
        .style('stroke-width', '4px');
}