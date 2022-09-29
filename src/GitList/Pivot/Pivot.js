"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
require("./Pivot.scss");
var SDK = require("azure-devops-extension-sdk");
var React = require("react");
var Common_1 = require("../../Common");
var azure_devops_extension_api_1 = require("azure-devops-extension-api");
var Core_1 = require("azure-devops-extension-api/Core");
var Git_1 = require("azure-devops-extension-api/Git");
var Header_1 = require("azure-devops-ui/Header");
var Page_1 = require("azure-devops-ui/Page");
var Table_1 = require("azure-devops-ui/Table");
var Provider_1 = require("azure-devops-ui/Utilities/Provider");
var PivotContent = /** @class */ (function (_super) {
    __extends(PivotContent, _super);
    function PivotContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PivotContent.prototype.componentDidMount = function () {
        SDK.init();
        this.initializeComponent();
    };
    PivotContent.prototype.initializeComponent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var projects, repositories, i, repos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, azure_devops_extension_api_1.getClient)(Core_1.CoreRestClient).getProjects()];
                    case 1:
                        projects = _a.sent();
                        repositories = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < projects.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, azure_devops_extension_api_1.getClient)(Git_1.GitRestClient).getRepositories(projects[i].name)];
                    case 3:
                        repos = _a.sent();
                        repositories = repositories.concat(repos);
                        console.log(repositories);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        //Sort the list in alphabetical on repository name
                        repositories = repositories.sort(function (a, b) {
                            return a.name.localeCompare(b.name);
                        });
                        this.setState({
                            projects: new Provider_1.ArrayItemProvider(projects),
                            gitRepos: new Provider_1.ArrayItemProvider(repositories),
                            nbrRepos: repositories.length
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PivotContent.prototype.render = function () {
        return (<Page_1.Page className="page-pivot flex-grow">

                <Header_1.Header title={"My repositories (" + this.state.nbrRepos + ")"} titleSize={0 /* TitleSize.Medium */}/>

                <div className="git-list-pivot">
                    {!this.state.gitRepos &&
                <p>Loading...</p>}
                    {this.state.gitRepos &&
                <Table_1.Table columns={this.state.columns} itemProvider={this.state.gitRepos}/>}
                </div>
                    
            </Page_1.Page>);
    };
    return PivotContent;
}(React.Component));
(0, Common_1.showRootComponent)(<PivotContent />);
