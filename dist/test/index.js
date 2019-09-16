"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var index_1 = __importDefault(require("../src/index"));
ava_1.default("success", function (assert) {
    assert.plan(1);
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var queueWorker, expectedResults, results, answer, addedOne, esqlateQueue, queue, queue_1, queue_1_1, s, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    queueWorker = function (n) {
                        return new Promise(function (workerResolver) {
                            setTimeout(function () {
                                workerResolver("Number: A" + n);
                            }, 5);
                        });
                    };
                    expectedResults = [
                        "WAIT",
                        "ADD",
                        "Number: A1",
                        "Number: A2",
                        "Number: A3",
                    ];
                    results = [];
                    answer = 1;
                    addedOne = false;
                    esqlateQueue = index_1.default(queueWorker);
                    // Push items onto the Queue... afterwards, otherwise we'd never get to the loop
                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            results.push("ADD");
                            esqlateQueue.push(1);
                            esqlateQueue.push(2);
                            return [2 /*return*/];
                        });
                    }); }, 500);
                    queue = esqlateQueue.results();
                    results.push("WAIT");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    queue_1 = __asyncValues(queue);
                    _b.label = 2;
                case 2: return [4 /*yield*/, queue_1.next()];
                case 3:
                    if (!(queue_1_1 = _b.sent(), !queue_1_1.done)) return [3 /*break*/, 5];
                    s = queue_1_1.value;
                    results.push(s);
                    if (!addedOne) {
                        addedOne = true;
                        esqlateQueue.push(3);
                    }
                    if (answer++ === 3) {
                        assert.deepEqual(results, expectedResults);
                        return [2 /*return*/, resolve()];
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(queue_1_1 && !queue_1_1.done && (_a = queue_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(queue_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
ava_1.default("promise rejection", function (assert) {
    assert.plan(5);
    var queueWorker = function (n) {
        return new Promise(function (resolve, reject) {
            if (n > 4) {
                return reject(new Error("Cannot process: B" + n));
            }
            setTimeout(function () {
                resolve("Number: B" + n);
            }, 5);
        });
    };
    var i = 0;
    var answer = 1;
    var esqlateQueue = index_1.default(queueWorker);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, s, e_2_1, e_3;
        var e_2, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 13, , 14]);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 12]);
                    _a = __asyncValues(esqlateQueue.results());
                    _d.label = 2;
                case 2: return [4 /*yield*/, _a.next()];
                case 3:
                    if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                    s = _b.value;
                    assert.is(s, "Number: B" + answer++);
                    if (i <= 9) {
                        esqlateQueue.push(++i);
                    }
                    _d.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _d.trys.push([7, , 10, 11]);
                    if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(_a)];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [3 /*break*/, 14];
                case 13:
                    e_3 = _d.sent();
                    assert.is(e_3.message, "Cannot process: B5");
                    resolve();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    }); });
});
