"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/timer");
var specmate_data_service_1 = require("../../../../data/modules/data-service/services/specmate-data.service");
var common_control_service_1 = require("../services/common-control.service");
var confirmation_modal_service_1 = require("../../../../notification/modules/modals/services/confirmation-modal.service");
var navigator_service_1 = require("../../../../navigation/modules/navigator/services/navigator.service");
var config_1 = require("../../../../../config/config");
var CommonControls = /** @class */ (function () {
    function CommonControls(dataService, commonControlService, modal, navigator) {
        var _this = this;
        this.dataService = dataService;
        this.commonControlService = commonControlService;
        this.modal = modal;
        this.navigator = navigator;
        this.connected = true;
        var timer = Observable_1.Observable.timer(0, config_1.Config.CONNECTIVITY_CHECK_DELAY);
        timer.subscribe(function () {
            _this.dataService.checkConnection().then(function (val) { return _this.connected = val; });
        });
    }
    CommonControls.prototype.save = function () {
        if (this.isSaveEnabled) {
            this.dataService.commit('Save');
        }
    };
    CommonControls.prototype.close = function () {
        this.back();
    };
    CommonControls.prototype.undo = function () {
        if (this.isUndoEnabled) {
            this.dataService.undo();
        }
    };
    CommonControls.prototype.forward = function () {
        if (this.isForwardEnabled) {
            this.navigator.forward();
        }
    };
    CommonControls.prototype.back = function () {
        if (this.isBackEnabled) {
            this.navigator.back();
        }
    };
    Object.defineProperty(CommonControls.prototype, "isSaveEnabled", {
        get: function () {
            return this.isEnabled && this.dataService.hasCommits && this.commonControlService.isCurrentEditorValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "isUndoEnabled", {
        get: function () {
            return this.isEnabled && this.dataService.hasCommits;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "isBackEnabled", {
        get: function () {
            return this.navigator.hasPrevious;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "isForwardEnabled", {
        get: function () {
            return this.navigator.hasNext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "isEnabled", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "themes", {
        get: function () {
            return ['cosmo', 'slate', 'yeti'].sort();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "currentTheme", {
        get: function () {
            return this.themeLinkElement.getAttribute('href').replace('https://bootswatch.com/4-alpha/', '').replace('/bootstrap.min.css', '');
        },
        set: function (name) {
            var href = 'https://bootswatch.com/4-alpha/' + name + '/bootstrap.min.css';
            document.getElementById('bootstrap-link').setAttribute('href', href);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonControls.prototype, "themeLinkElement", {
        get: function () {
            return document.getElementById('bootstrap-link');
        },
        enumerable: true,
        configurable: true
    });
    CommonControls = __decorate([
        core_1.Component({
            moduleId: module.id.toString(),
            selector: 'common-controls',
            templateUrl: 'common-controls.component.html',
            styleUrls: ['common-controls.component.css']
        }),
        __metadata("design:paramtypes", [specmate_data_service_1.SpecmateDataService,
            common_control_service_1.EditorCommonControlService,
            confirmation_modal_service_1.ConfirmationModal,
            navigator_service_1.NavigatorService])
    ], CommonControls);
    return CommonControls;
}());
exports.CommonControls = CommonControls;
//# sourceMappingURL=common-controls.component.js.map