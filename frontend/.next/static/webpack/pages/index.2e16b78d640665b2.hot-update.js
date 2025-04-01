"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "(pages-dir-browser)/./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Home)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"(pages-dir-browser)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n\nvar _s = $RefreshSig$();\n\n\nfunction Home() {\n    _s();\n    const [users, setUsers] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Home.useEffect\": ()=>{\n            // 開発環境ではlocalhostを使用\n            const baseUrl =  true ? \"http://localhost:8000\" : 0;\n            fetch(\"\".concat(baseUrl, \"/users\"), {\n                headers: {\n                    'Accept': 'application/json; charset=utf-8',\n                    'Content-Type': 'application/json; charset=utf-8'\n                }\n            }).then({\n                \"Home.useEffect\": (res)=>{\n                    if (!res.ok) {\n                        throw new Error('Failed to fetch users');\n                    }\n                    return res.json();\n                }\n            }[\"Home.useEffect\"]).then({\n                \"Home.useEffect\": (data)=>{\n                    setUsers(data);\n                    setLoading(false);\n                }\n            }[\"Home.useEffect\"]).catch({\n                \"Home.useEffect\": (err)=>{\n                    console.error(\"Fetch error:\", err);\n                    setError(err.message);\n                    setLoading(false);\n                }\n            }[\"Home.useEffect\"]);\n        }\n    }[\"Home.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        charSet: \"utf-8\"\n                    }, void 0, false, {\n                        fileName: \"/app/pages/index.js\",\n                        lineNumber: 41,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/app/pages/index.js\",\n                        lineNumber: 42,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/app/pages/index.js\",\n                lineNumber: 40,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"ユーザー一覧\"\n            }, void 0, false, {\n                fileName: \"/app/pages/index.js\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, this),\n            loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: \"Loading...\"\n            }, void 0, false, {\n                fileName: \"/app/pages/index.js\",\n                lineNumber: 46,\n                columnNumber: 9\n            }, this) : error ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: [\n                    \"Error: \",\n                    error\n                ]\n            }, void 0, true, {\n                fileName: \"/app/pages/index.js\",\n                lineNumber: 48,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                children: users.map((user)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                        children: [\n                            user.name,\n                            \" (\",\n                            user.email,\n                            \")\"\n                        ]\n                    }, user.id, true, {\n                        fileName: \"/app/pages/index.js\",\n                        lineNumber: 52,\n                        columnNumber: 13\n                    }, this))\n            }, void 0, false, {\n                fileName: \"/app/pages/index.js\",\n                lineNumber: 50,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/app/pages/index.js\",\n        lineNumber: 39,\n        columnNumber: 5\n    }, this);\n}\n_s(Home, \"vvG5G9m+JVa2SSWAm277lQVAKio=\");\n_c = Home;\nvar _c;\n$RefreshReg$(_c, \"Home\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3BhZ2VzL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUE0QztBQUNmO0FBRWQsU0FBU0c7O0lBQ3RCLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHSiwrQ0FBUUEsQ0FBQyxFQUFFO0lBQ3JDLE1BQU0sQ0FBQ0ssU0FBU0MsV0FBVyxHQUFHTiwrQ0FBUUEsQ0FBQztJQUN2QyxNQUFNLENBQUNPLE9BQU9DLFNBQVMsR0FBR1IsK0NBQVFBLENBQUM7SUFFbkNELGdEQUFTQTswQkFBQztZQUNSLHFCQUFxQjtZQUNyQixNQUFNVSxVQUFVQyxLQUFzQyxHQUNsRCwwQkFDQUEsQ0FBK0I7WUFFbkNHLE1BQU0sR0FBVyxPQUFSSixTQUFRLFdBQVM7Z0JBQ3hCSyxTQUFTO29CQUNQLFVBQVU7b0JBQ1YsZ0JBQWdCO2dCQUNsQjtZQUNGLEdBQ0dDLElBQUk7a0NBQUMsQ0FBQ0M7b0JBQ0wsSUFBSSxDQUFDQSxJQUFJQyxFQUFFLEVBQUU7d0JBQ1gsTUFBTSxJQUFJQyxNQUFNO29CQUNsQjtvQkFDQSxPQUFPRixJQUFJRyxJQUFJO2dCQUNqQjtpQ0FDQ0osSUFBSTtrQ0FBQyxDQUFDSztvQkFDTGhCLFNBQVNnQjtvQkFDVGQsV0FBVztnQkFDYjtpQ0FDQ2UsS0FBSztrQ0FBQyxDQUFDQztvQkFDTkMsUUFBUWhCLEtBQUssQ0FBQyxnQkFBZ0JlO29CQUM5QmQsU0FBU2MsSUFBSUUsT0FBTztvQkFDcEJsQixXQUFXO2dCQUNiOztRQUNKO3lCQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ21COzswQkFDQyw4REFBQ3hCLGtEQUFJQTs7a0NBQ0gsOERBQUN5Qjt3QkFBS0MsU0FBUTs7Ozs7O2tDQUNkLDhEQUFDRDt3QkFBS0UsTUFBSzt3QkFBV0MsU0FBUTs7Ozs7Ozs7Ozs7OzBCQUVoQyw4REFBQ0M7MEJBQUc7Ozs7OztZQUNIekIsd0JBQ0MsOERBQUMwQjswQkFBRTs7Ozs7dUJBQ0R4QixzQkFDRiw4REFBQ3dCOztvQkFBRTtvQkFBUXhCOzs7Ozs7cUNBRVgsOERBQUN5QjswQkFDRTdCLE1BQU04QixHQUFHLENBQUMsQ0FBQ0MscUJBQ1YsOERBQUNDOzs0QkFDRUQsS0FBS04sSUFBSTs0QkFBQzs0QkFBR00sS0FBS0UsS0FBSzs0QkFBQzs7dUJBRGxCRixLQUFLRyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7O0FBUTVCO0dBeER3Qm5DO0tBQUFBIiwic291cmNlcyI6WyIvYXBwL3BhZ2VzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhvbWUoKSB7XG4gIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGUoW10pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIOmWi+eZuueSsOWig+OBp+OBr2xvY2FsaG9zdOOCkuS9v+eUqFxuICAgIGNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyBcbiAgICAgID8gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuICAgICAgOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfVVJMO1xuICAgIFxuICAgIGZldGNoKGAke2Jhc2VVcmx9L3VzZXJzYCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXG4gICAgICB9XG4gICAgfSlcbiAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCB1c2VycycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHNldFVzZXJzKGRhdGEpO1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmV0Y2ggZXJyb3I6XCIsIGVycik7XG4gICAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgPGgxPuODpuODvOOCtuODvOS4gOimpzwvaDE+XG4gICAgICB7bG9hZGluZyA/IChcbiAgICAgICAgPHA+TG9hZGluZy4uLjwvcD5cbiAgICAgICkgOiBlcnJvciA/IChcbiAgICAgICAgPHA+RXJyb3I6IHtlcnJvcn08L3A+XG4gICAgICApIDogKFxuICAgICAgICA8dWw+XG4gICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxuICAgICAgICAgICAgPGxpIGtleT17dXNlci5pZH0+XG4gICAgICAgICAgICAgIHt1c2VyLm5hbWV9ICh7dXNlci5lbWFpbH0pXG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkhlYWQiLCJIb21lIiwidXNlcnMiLCJzZXRVc2VycyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsImJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfQVBJX1VSTCIsImZldGNoIiwiaGVhZGVycyIsInRoZW4iLCJyZXMiLCJvayIsIkVycm9yIiwianNvbiIsImRhdGEiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJtZXNzYWdlIiwiZGl2IiwibWV0YSIsImNoYXJTZXQiLCJuYW1lIiwiY29udGVudCIsImgxIiwicCIsInVsIiwibWFwIiwidXNlciIsImxpIiwiZW1haWwiLCJpZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./pages/index.js\n"));

/***/ })

});