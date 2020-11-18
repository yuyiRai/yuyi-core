"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
var AstUtils;
(function (AstUtils) {
    /**
     * 创建简单变量行
     * @param name 名称
     * @param value 表达式
     */
    function createVariableStatement(name, value) {
        return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ConstKeyword)], [ts.createVariableDeclaration(name, undefined, value)]);
    }
    AstUtils.createVariableStatement = createVariableStatement;
    /**
     * 创建是否为null的判断语句
     * @param sub
     */
    function createIsNotNull(sub, strict = true) {
        return createIsNot(sub, ts.createNull(), strict);
    }
    AstUtils.createIsNotNull = createIsNotNull;
    /**
     * 创建是否为XXX的判断语句
     * @param sub
     * @param target
     */
    function createIsNot(sub, target = ts.createIdentifier('undefined'), strict = true) {
        const { ExclamationEqualsToken, ExclamationEqualsEqualsToken } = ts.SyntaxKind;
        return ts.createBinary(sub, strict ? ExclamationEqualsEqualsToken : ExclamationEqualsToken, target);
    }
    AstUtils.createIsNot = createIsNot;
    /**
     * 创建简单的匿名函数闭包调用
     * @param line - 闭包行
     * @param isCall - 是否立即调用
     */
    function createArrowCall(line, isCall = true) {
        const func = ts.createParen(ts.createArrowFunction([], [], [], ts.createLiteralTypeNode(ts.createLiteral('any')), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock(line, true)));
        return isCall ? ts.createCall(func, [], []) : func;
    }
    AstUtils.createArrowCall = createArrowCall;
    /**
     * 创建三元运算符节点
     * @param express - 判断语句
     * @param whenTrue - 当为真
     * @param whenFalse - 当为false(默认值为undefined)
     */
    function createConditional(express, whenTrue, whenFalse) {
        // tslint:disable-next-line: deprecation
        return ts.createConditional(express, whenTrue, whenFalse || ts.createIdentifier('undefined'));
    }
    AstUtils.createConditional = createConditional;
    /**
     *
     * @param expressList
     * @param i
     */
    function createWhenToDoForEach(expressList, when = createIsNotNull, whenTrue = ((e) => ts.createReturn(e)), leftReturn = true) {
        const block = [];
        const tmpDeclare = ts.createIdentifier('tmp');
        expressList.forEach((sub, index, list) => {
            if (block.length === 0) {
                // 初始化临时变量
                block.push(createVariableStatement('tmp', sub));
            }
            else {
                // 再度赋值
                block.push(ts.createExpressionStatement(ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, sub)));
            }
            // 创建条件判断
            const condition = when(tmpDeclare);
            if (index === list.length - 1) {
                // 最后一项时直接用三元判断
                block.push(whenTrue(createConditional(condition, tmpDeclare)));
            }
            else {
                block.push(ts.createIf(condition, ts.createBlock([
                    leftReturn ? ts.createReturn(tmpDeclare) : whenTrue(tmpDeclare)
                ])));
            }
        });
        return createArrowCall(block);
    }
    AstUtils.createWhenToDoForEach = createWhenToDoForEach;
})(AstUtils = exports.AstUtils || (exports.AstUtils = {}));
//# sourceMappingURL=AstUtils.js.map