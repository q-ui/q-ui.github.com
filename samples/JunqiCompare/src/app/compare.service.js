"use strict";
var CompareService = (function () {
    function CompareService() {
        this.memberData = [{
                label: '司令',
                value: 40
            }, {
                label: '军长',
                value: 39
            }, {
                label: '师长',
                value: 38
            }, {
                label: '旅长',
                value: 37
            }, {
                label: '团长',
                value: 36
            }, {
                label: '营长',
                value: 35
            }, {
                label: '连长',
                value: 34
            }, {
                label: '排长',
                value: 33
            }, {
                label: '工兵',
                value: 32
            }, {
                label: '炸弹',
                value: -1
            }, {
                label: '地雷',
                value: -2
            }, {
                label: '军旗',
                value: -3
            }];
        this.frontMember = null;
        this.logData = [];
    }
    CompareService.prototype.getMembers = function () {
        return this.memberData;
    };
    CompareService.prototype.getLogs = function () {
        return this.logData;
    };
    CompareService.prototype.compareMembers = function (member) {
        if (this.frontMember == null) {
            this.frontMember = member;
            return 'store';
        }
        else {
            var result = this.compareMembersAction(this.frontMember, member);
            var date = new Date();
            this.logData.push({
                time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                frontMember: this.frontMember.label,
                afterMember: member.label,
                winOrLose: result
            });
            this.frontMember = null;
            return result;
        }
    };
    CompareService.prototype.compareMembersAction = function (member1, member2) {
        var value1 = member1.value;
        var value2 = member2.value;
        if (value1 == -1 || (value2 == -1)) {
            return "equal";
        }
        else if (value1 == -3 || value2 == -3) {
            if (value1 == -3) {
                return "lose";
            }
            else {
                return "win";
            }
        }
        else if (value1 == -2 || value2 == -2) {
            if (value1 == -2) {
                return (value2 == 32) ? "lose" : "win";
            }
            else {
                return (value1 == 32) ? "win" : "lose";
            }
        }
        else {
            return (value1 > value2) ? "win" : ((value1 == value2) ? "equal" : "lose");
        }
    };
    return CompareService;
}());
exports.CompareService = CompareService;
//# sourceMappingURL=compare.service.js.map