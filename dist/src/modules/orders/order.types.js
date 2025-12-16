"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
// All possible order states
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["ROUTING"] = "routing";
    OrderStatus["BUILDING"] = "building";
    OrderStatus["SUBMITTED"] = "submitted";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
