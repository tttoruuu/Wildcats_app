"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/conversation",{

/***/ "(pages-dir-browser)/./pages/conversation/index.js":
/*!*************************************!*\
  !*** ./pages/conversation/index.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ConversationIndex)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-browser)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/link */ \"(pages-dir-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Layout */ \"(pages-dir-browser)/./components/Layout.js\");\n\nvar _s = $RefreshSig$();\n\n\n\n\nfunction ConversationIndex() {\n    _s();\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const [selectedPartner, setSelectedPartner] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');\n    const [partners, setPartners] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    // ローカルストレージから会話相手を取得\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"ConversationIndex.useEffect\": ()=>{\n            const fetchPartners = {\n                \"ConversationIndex.useEffect.fetchPartners\": ()=>{\n                    try {\n                        // ローカルストレージから会話相手のデータを取得\n                        const storedPartners = JSON.parse(localStorage.getItem('conversationPartners') || '[]');\n                        if (storedPartners.length > 0) {\n                            // 登録された会話相手がある場合はそれを使用\n                            setPartners(storedPartners);\n                        } else {\n                            // サンプルデータ（ローカルストレージに登録がない場合のみ表示）\n                            setPartners([\n                                {\n                                    id: '1',\n                                    name: 'あいさん'\n                                },\n                                {\n                                    id: '2',\n                                    name: 'ゆうりさん'\n                                },\n                                {\n                                    id: '3',\n                                    name: 'しおりさん'\n                                },\n                                {\n                                    id: '4',\n                                    name: 'かおりさん'\n                                },\n                                {\n                                    id: '5',\n                                    name: 'なつみさん'\n                                }\n                            ]);\n                        }\n                    } catch (error) {\n                        console.error('会話相手データの取得に失敗しました:', error);\n                        // エラー時はサンプルデータを使用\n                        setPartners([\n                            {\n                                id: '1',\n                                name: 'あいさん'\n                            },\n                            {\n                                id: '2',\n                                name: 'ゆうりさん'\n                            },\n                            {\n                                id: '3',\n                                name: 'しおりさん'\n                            },\n                            {\n                                id: '4',\n                                name: 'かおりさん'\n                            },\n                            {\n                                id: '5',\n                                name: 'なつみさん'\n                            }\n                        ]);\n                    } finally{\n                        setLoading(false);\n                    }\n                }\n            }[\"ConversationIndex.useEffect.fetchPartners\"];\n            fetchPartners();\n        }\n    }[\"ConversationIndex.useEffect\"], []);\n    const handleSelectPartner = (e)=>{\n        setSelectedPartner(e.target.value);\n    };\n    const handleNext = ()=>{\n        if (selectedPartner) {\n            // 選択された相手のIDをクエリパラメータとして渡し、セットアップページに遷移\n            router.push(\"/conversation/setup?partnerId=\".concat(selectedPartner));\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Layout__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        title: \"会話練習\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"flex flex-col items-center min-h-screen bg-gray-800 text-white p-4\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    className: \"text-2xl font-bold mt-16 mb-12 text-center\",\n                    children: \"誰との会話を練習する？\"\n                }, void 0, false, {\n                    fileName: \"/app/pages/conversation/index.js\",\n                    lineNumber: 64,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex justify-center space-x-4 w-full mb-12\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                            href: \"/conversation/register\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"bg-orange-300 text-white rounded-full py-3 px-6 text-center shadow-md\",\n                                children: \"新しく登録\"\n                            }, void 0, false, {\n                                fileName: \"/app/pages/conversation/index.js\",\n                                lineNumber: 68,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/app/pages/conversation/index.js\",\n                            lineNumber: 67,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                            href: \"/conversation/partners\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"bg-orange-300 text-white rounded-full py-3 px-6 text-center shadow-md\",\n                                children: \"名簿を見る\"\n                            }, void 0, false, {\n                                fileName: \"/app/pages/conversation/index.js\",\n                                lineNumber: 74,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/app/pages/conversation/index.js\",\n                            lineNumber: 73,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/app/pages/conversation/index.js\",\n                    lineNumber: 66,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"w-full max-w-md\",\n                    children: loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"text-center mb-12\",\n                        children: \"読み込み中...\"\n                    }, void 0, false, {\n                        fileName: \"/app/pages/conversation/index.js\",\n                        lineNumber: 82,\n                        columnNumber: 13\n                    }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n                        value: selectedPartner,\n                        onChange: handleSelectPartner,\n                        className: \"w-full p-4 text-gray-800 bg-white rounded-md focus:outline-none mb-12\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                value: \"\",\n                                children: \"会話する相手を選択\"\n                            }, void 0, false, {\n                                fileName: \"/app/pages/conversation/index.js\",\n                                lineNumber: 89,\n                                columnNumber: 15\n                            }, this),\n                            partners.map((partner)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                    value: partner.id,\n                                    children: partner.name\n                                }, partner.id, false, {\n                                    fileName: \"/app/pages/conversation/index.js\",\n                                    lineNumber: 91,\n                                    columnNumber: 17\n                                }, this))\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/app/pages/conversation/index.js\",\n                        lineNumber: 84,\n                        columnNumber: 13\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/app/pages/conversation/index.js\",\n                    lineNumber: 80,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: handleNext,\n                    disabled: !selectedPartner,\n                    className: \"bg-orange-300 text-white rounded-full py-3 px-10 text-lg \".concat(!selectedPartner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'),\n                    children: \"次へ進む\"\n                }, void 0, false, {\n                    fileName: \"/app/pages/conversation/index.js\",\n                    lineNumber: 99,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/app/pages/conversation/index.js\",\n            lineNumber: 63,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/app/pages/conversation/index.js\",\n        lineNumber: 62,\n        columnNumber: 5\n    }, this);\n}\n_s(ConversationIndex, \"b3bmgdDzRmoXTXUaJ06PyGhJjro=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter\n    ];\n});\n_c = ConversationIndex;\nvar _c;\n$RefreshReg$(_c, \"ConversationIndex\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3BhZ2VzL2NvbnZlcnNhdGlvbi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBNEM7QUFDSjtBQUNYO0FBQ2dCO0FBRTlCLFNBQVNLOztJQUN0QixNQUFNQyxTQUFTSixzREFBU0E7SUFDeEIsTUFBTSxDQUFDSyxpQkFBaUJDLG1CQUFtQixHQUFHUiwrQ0FBUUEsQ0FBQztJQUN2RCxNQUFNLENBQUNTLFVBQVVDLFlBQVksR0FBR1YsK0NBQVFBLENBQUMsRUFBRTtJQUMzQyxNQUFNLENBQUNXLFNBQVNDLFdBQVcsR0FBR1osK0NBQVFBLENBQUM7SUFFdkMscUJBQXFCO0lBQ3JCQyxnREFBU0E7dUNBQUM7WUFDUixNQUFNWTs2REFBZ0I7b0JBQ3BCLElBQUk7d0JBQ0YseUJBQXlCO3dCQUN6QixNQUFNQyxpQkFBaUJDLEtBQUtDLEtBQUssQ0FBQ0MsYUFBYUMsT0FBTyxDQUFDLDJCQUEyQjt3QkFFbEYsSUFBSUosZUFBZUssTUFBTSxHQUFHLEdBQUc7NEJBQzdCLHVCQUF1Qjs0QkFDdkJULFlBQVlJO3dCQUNkLE9BQU87NEJBQ0wsaUNBQWlDOzRCQUNqQ0osWUFBWTtnQ0FDVjtvQ0FBRVUsSUFBSTtvQ0FBS0MsTUFBTTtnQ0FBTztnQ0FDeEI7b0NBQUVELElBQUk7b0NBQUtDLE1BQU07Z0NBQVE7Z0NBQ3pCO29DQUFFRCxJQUFJO29DQUFLQyxNQUFNO2dDQUFRO2dDQUN6QjtvQ0FBRUQsSUFBSTtvQ0FBS0MsTUFBTTtnQ0FBUTtnQ0FDekI7b0NBQUVELElBQUk7b0NBQUtDLE1BQU07Z0NBQVE7NkJBQzFCO3dCQUNIO29CQUNGLEVBQUUsT0FBT0MsT0FBTzt3QkFDZEMsUUFBUUQsS0FBSyxDQUFDLHNCQUFzQkE7d0JBQ3BDLGtCQUFrQjt3QkFDbEJaLFlBQVk7NEJBQ1Y7Z0NBQUVVLElBQUk7Z0NBQUtDLE1BQU07NEJBQU87NEJBQ3hCO2dDQUFFRCxJQUFJO2dDQUFLQyxNQUFNOzRCQUFROzRCQUN6QjtnQ0FBRUQsSUFBSTtnQ0FBS0MsTUFBTTs0QkFBUTs0QkFDekI7Z0NBQUVELElBQUk7Z0NBQUtDLE1BQU07NEJBQVE7NEJBQ3pCO2dDQUFFRCxJQUFJO2dDQUFLQyxNQUFNOzRCQUFRO3lCQUMxQjtvQkFDSCxTQUFVO3dCQUNSVCxXQUFXO29CQUNiO2dCQUNGOztZQUVBQztRQUNGO3NDQUFHLEVBQUU7SUFFTCxNQUFNVyxzQkFBc0IsQ0FBQ0M7UUFDM0JqQixtQkFBbUJpQixFQUFFQyxNQUFNLENBQUNDLEtBQUs7SUFDbkM7SUFFQSxNQUFNQyxhQUFhO1FBQ2pCLElBQUlyQixpQkFBaUI7WUFDbkIsd0NBQXdDO1lBQ3hDRCxPQUFPdUIsSUFBSSxDQUFDLGlDQUFpRCxPQUFoQnRCO1FBQy9DO0lBQ0Y7SUFFQSxxQkFDRSw4REFBQ0gsMERBQU1BO1FBQUMwQixPQUFNO2tCQUNaLDRFQUFDQztZQUFJQyxXQUFVOzs4QkFDYiw4REFBQ0M7b0JBQUdELFdBQVU7OEJBQTZDOzs7Ozs7OEJBRTNELDhEQUFDRDtvQkFBSUMsV0FBVTs7c0NBQ2IsOERBQUM3QixrREFBSUE7NEJBQUMrQixNQUFLO3NDQUNULDRFQUFDSDtnQ0FBSUMsV0FBVTswQ0FBd0U7Ozs7Ozs7Ozs7O3NDQUt6Riw4REFBQzdCLGtEQUFJQTs0QkFBQytCLE1BQUs7c0NBQ1QsNEVBQUNIO2dDQUFJQyxXQUFVOzBDQUF3RTs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBTTNGLDhEQUFDRDtvQkFBSUMsV0FBVTs4QkFDWnJCLHdCQUNDLDhEQUFDb0I7d0JBQUlDLFdBQVU7a0NBQW9COzs7Ozs2Q0FFbkMsOERBQUNHO3dCQUNDUixPQUFPcEI7d0JBQ1A2QixVQUFVWjt3QkFDVlEsV0FBVTs7MENBRVYsOERBQUNLO2dDQUFPVixPQUFNOzBDQUFHOzs7Ozs7NEJBQ2hCbEIsU0FBUzZCLEdBQUcsQ0FBQyxDQUFDQyx3QkFDYiw4REFBQ0Y7b0NBQXdCVixPQUFPWSxRQUFRbkIsRUFBRTs4Q0FDdkNtQixRQUFRbEIsSUFBSTttQ0FERmtCLFFBQVFuQixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7OzhCQVEvQiw4REFBQ29CO29CQUNDQyxTQUFTYjtvQkFDVGMsVUFBVSxDQUFDbkM7b0JBQ1h5QixXQUFXLDREQUVWLE9BREMsQ0FBQ3pCLGtCQUFrQixrQ0FBa0M7OEJBRXhEOzs7Ozs7Ozs7Ozs7Ozs7OztBQU1UO0dBekd3QkY7O1FBQ1BILGtEQUFTQTs7O0tBREZHIiwic291cmNlcyI6WyIvYXBwL3BhZ2VzL2NvbnZlcnNhdGlvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9MYXlvdXQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb252ZXJzYXRpb25JbmRleCgpIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG4gIGNvbnN0IFtzZWxlY3RlZFBhcnRuZXIsIHNldFNlbGVjdGVkUGFydG5lcl0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtwYXJ0bmVycywgc2V0UGFydG5lcnNdID0gdXNlU3RhdGUoW10pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICAvLyDjg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgYvjgonkvJroqbHnm7jmiYvjgpLlj5blvpdcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBmZXRjaFBhcnRuZXJzID0gKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8g44Ot44O844Kr44Or44K544OI44Os44O844K444GL44KJ5Lya6Kmx55u45omL44Gu44OH44O844K/44KS5Y+W5b6XXG4gICAgICAgIGNvbnN0IHN0b3JlZFBhcnRuZXJzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29udmVyc2F0aW9uUGFydG5lcnMnKSB8fCAnW10nKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzdG9yZWRQYXJ0bmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8g55m76Yyy44GV44KM44Gf5Lya6Kmx55u45omL44GM44GC44KL5aC05ZCI44Gv44Gd44KM44KS5L2/55SoXG4gICAgICAgICAgc2V0UGFydG5lcnMoc3RvcmVkUGFydG5lcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOOCteODs+ODl+ODq+ODh+ODvOOCv++8iOODreODvOOCq+ODq+OCueODiOODrOODvOOCuOOBq+eZu+mMsuOBjOOBquOBhOWgtOWQiOOBruOBv+ihqOekuu+8iVxuICAgICAgICAgIHNldFBhcnRuZXJzKFtcbiAgICAgICAgICAgIHsgaWQ6ICcxJywgbmFtZTogJ+OBguOBhOOBleOCkycgfSxcbiAgICAgICAgICAgIHsgaWQ6ICcyJywgbmFtZTogJ+OChuOBhuOCiuOBleOCkycgfSxcbiAgICAgICAgICAgIHsgaWQ6ICczJywgbmFtZTogJ+OBl+OBiuOCiuOBleOCkycgfSxcbiAgICAgICAgICAgIHsgaWQ6ICc0JywgbmFtZTogJ+OBi+OBiuOCiuOBleOCkycgfSxcbiAgICAgICAgICAgIHsgaWQ6ICc1JywgbmFtZTogJ+OBquOBpOOBv+OBleOCkycgfSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcign5Lya6Kmx55u45omL44OH44O844K/44Gu5Y+W5b6X44Gr5aSx5pWX44GX44G+44GX44GfOicsIGVycm9yKTtcbiAgICAgICAgLy8g44Ko44Op44O85pmC44Gv44K144Oz44OX44Or44OH44O844K/44KS5L2/55SoXG4gICAgICAgIHNldFBhcnRuZXJzKFtcbiAgICAgICAgICB7IGlkOiAnMScsIG5hbWU6ICfjgYLjgYTjgZXjgpMnIH0sXG4gICAgICAgICAgeyBpZDogJzInLCBuYW1lOiAn44KG44GG44KK44GV44KTJyB9LFxuICAgICAgICAgIHsgaWQ6ICczJywgbmFtZTogJ+OBl+OBiuOCiuOBleOCkycgfSxcbiAgICAgICAgICB7IGlkOiAnNCcsIG5hbWU6ICfjgYvjgYrjgorjgZXjgpMnIH0sXG4gICAgICAgICAgeyBpZDogJzUnLCBuYW1lOiAn44Gq44Gk44G/44GV44KTJyB9LFxuICAgICAgICBdKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmZXRjaFBhcnRuZXJzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVTZWxlY3RQYXJ0bmVyID0gKGUpID0+IHtcbiAgICBzZXRTZWxlY3RlZFBhcnRuZXIoZS50YXJnZXQudmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZU5leHQgPSAoKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkUGFydG5lcikge1xuICAgICAgLy8g6YG45oqe44GV44KM44Gf55u45omL44GuSUTjgpLjgq/jgqjjg6rjg5Hjg6njg6Hjg7zjgr/jgajjgZfjgabmuKHjgZfjgIHjgrvjg4Pjg4jjgqLjg4Pjg5fjg5rjg7zjgrjjgavpgbfnp7tcbiAgICAgIHJvdXRlci5wdXNoKGAvY29udmVyc2F0aW9uL3NldHVwP3BhcnRuZXJJZD0ke3NlbGVjdGVkUGFydG5lcn1gKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHRpdGxlPVwi5Lya6Kmx57e057+SXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIG1pbi1oLXNjcmVlbiBiZy1ncmF5LTgwMCB0ZXh0LXdoaXRlIHAtNFwiPlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIG10LTE2IG1iLTEyIHRleHQtY2VudGVyXCI+6Kqw44Go44Gu5Lya6Kmx44KS57e057+S44GZ44KL77yfPC9oMT5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBzcGFjZS14LTQgdy1mdWxsIG1iLTEyXCI+XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9jb252ZXJzYXRpb24vcmVnaXN0ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctb3JhbmdlLTMwMCB0ZXh0LXdoaXRlIHJvdW5kZWQtZnVsbCBweS0zIHB4LTYgdGV4dC1jZW50ZXIgc2hhZG93LW1kXCI+XG4gICAgICAgICAgICAgIOaWsOOBl+OBj+eZu+mMslxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIFxuICAgICAgICAgIDxMaW5rIGhyZWY9XCIvY29udmVyc2F0aW9uL3BhcnRuZXJzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW9yYW5nZS0zMDAgdGV4dC13aGl0ZSByb3VuZGVkLWZ1bGwgcHktMyBweC02IHRleHQtY2VudGVyIHNoYWRvdy1tZFwiPlxuICAgICAgICAgICAgICDlkI3nsL/jgpLopovjgotcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1tZFwiPlxuICAgICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi0xMlwiPuiqreOBv+i+vOOBv+S4rS4uLjwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZFBhcnRuZXJ9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWxlY3RQYXJ0bmVyfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcC00IHRleHQtZ3JheS04MDAgYmctd2hpdGUgcm91bmRlZC1tZCBmb2N1czpvdXRsaW5lLW5vbmUgbWItMTJcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+5Lya6Kmx44GZ44KL55u45omL44KS6YG45oqePC9vcHRpb24+XG4gICAgICAgICAgICAgIHtwYXJ0bmVycy5tYXAoKHBhcnRuZXIpID0+IChcbiAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cGFydG5lci5pZH0gdmFsdWU9e3BhcnRuZXIuaWR9PlxuICAgICAgICAgICAgICAgICAge3BhcnRuZXIubmFtZX1cbiAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVOZXh0fVxuICAgICAgICAgIGRpc2FibGVkPXshc2VsZWN0ZWRQYXJ0bmVyfVxuICAgICAgICAgIGNsYXNzTmFtZT17YGJnLW9yYW5nZS0zMDAgdGV4dC13aGl0ZSByb3VuZGVkLWZ1bGwgcHktMyBweC0xMCB0ZXh0LWxnICR7XG4gICAgICAgICAgICAhc2VsZWN0ZWRQYXJ0bmVyID8gJ29wYWNpdHktNTAgY3Vyc29yLW5vdC1hbGxvd2VkJyA6ICdob3ZlcjpiZy1vcmFuZ2UtNDAwJ1xuICAgICAgICAgIH1gfVxuICAgICAgICA+XG4gICAgICAgICAg5qyh44G46YCy44KAXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59ICJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZVJvdXRlciIsIkxpbmsiLCJMYXlvdXQiLCJDb252ZXJzYXRpb25JbmRleCIsInJvdXRlciIsInNlbGVjdGVkUGFydG5lciIsInNldFNlbGVjdGVkUGFydG5lciIsInBhcnRuZXJzIiwic2V0UGFydG5lcnMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImZldGNoUGFydG5lcnMiLCJzdG9yZWRQYXJ0bmVycyIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsZW5ndGgiLCJpZCIsIm5hbWUiLCJlcnJvciIsImNvbnNvbGUiLCJoYW5kbGVTZWxlY3RQYXJ0bmVyIiwiZSIsInRhcmdldCIsInZhbHVlIiwiaGFuZGxlTmV4dCIsInB1c2giLCJ0aXRsZSIsImRpdiIsImNsYXNzTmFtZSIsImgxIiwiaHJlZiIsInNlbGVjdCIsIm9uQ2hhbmdlIiwib3B0aW9uIiwibWFwIiwicGFydG5lciIsImJ1dHRvbiIsIm9uQ2xpY2siLCJkaXNhYmxlZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./pages/conversation/index.js\n"));

/***/ })

});