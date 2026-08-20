window.__ModuleLoader__.load({
	id: "@ywzhang1031/dsh-client-ui-aside",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") {
				if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
				else vals.push(Number(val));
			} else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region ../aside-host/lib/typert-contract.js
		/**
		* Package-owned Remote descriptor shared by the Host registry contribution
		* and the browser Remote stub.
		* @module @ywzhang1031/dsh-aside-host/typert-contract
		*/
		const ASIDE_PACKAGE = "@ywzhang1031/dsh-aside-host";
		const anchorSchema = object({
			messageId: string().nullable(),
			exact: string(),
			prefix: string(),
			suffix: string(),
			occurrence: number().nullable(),
			startOffset: number().nullable()
		});
		const recordSchema = object({
			schemaVersion: literal(1),
			parentSessionId: string(),
			subSessionId: string(),
			anchor: anchorSchema,
			createdAt: number(),
			updatedAt: number()
		});
		//#endregion
		//#region ../aside-host/lib/typert.remote-client.js
		/** Browser Remote contribution for the Aside endpoints. @module @ywzhang1031/dsh-aside-host/remote */
		const TYPERT_REMOTE = {
			package: ASIDE_PACKAGE,
			descriptors: [{
				id: `${ASIDE_PACKAGE}#aside/create`,
				service: "aside",
				namespace: "aside",
				method: "create",
				invocation: { kind: "direct" },
				parameters: [{
					name: "request",
					wire: "request",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateRequest`,
						schema: object({
							parentSessionId: string(),
							anchor: anchorSchema
						})
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateResult`,
					schema: object({ record: recordSchema })
				}
			}, {
				id: `${ASIDE_PACKAGE}#aside/list`,
				service: "aside",
				namespace: "aside",
				method: "list",
				invocation: { kind: "direct" },
				parameters: [{
					name: "request",
					wire: "request",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: `${ASIDE_PACKAGE}/types#AsideListRequest`,
						schema: object({ parentSessionId: string() })
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: `${ASIDE_PACKAGE}/types#AsideListResult`,
					schema: object({ records: array(recordSchema) })
				}
			}]
		};
		//#endregion
		//#region ../aside-host/lib/types/types.js
		/**
		* Decode the anchor marker out of a first user message, or undefined when the
		* message carries none. Never throws on malformed input.
		*/
		function parseAnchor(text) {
			const match = /\[aside:([^\]]+)\]/.exec(text);
			if (match === null || match[1] === void 0) return void 0;
			try {
				const parsed = JSON.parse(decodeURIComponent(match[1]));
				return isAsideAnchor(parsed) ? parsed : void 0;
			} catch {
				return;
			}
		}
		/** Structural guard for an anchor recovered from untrusted persisted text. */
		function isAsideAnchor(value) {
			if (typeof value !== "object" || value === null) return false;
			const record = value;
			return (record["messageId"] === null || typeof record["messageId"] === "string") && typeof record["exact"] === "string" && typeof record["prefix"] === "string" && typeof record["suffix"] === "string" && (record["occurrence"] === null || typeof record["occurrence"] === "number") && (record["startOffset"] === null || typeof record["startOffset"] === "number");
		}
		/** Whitespace-normalized human summary of an anchor's exact text (for titles/sidebar). */
		function anchorSummary(exact, max = 60) {
			const compact = exact.replace(/\s+/g, " ").trim();
			return compact.length > max ? `${compact.slice(0, max)}…` : compact;
		}
		/**
		* Canonical dedup identity for one anchor. Every disambiguation field counts:
		* the same text in a different message, at a different occurrence, or at a
		* different offset is a different aside.
		*/
		function anchorKey(anchor) {
			return [
				anchor.messageId ?? "",
				anchor.exact,
				anchor.prefix,
				anchor.suffix,
				anchor.occurrence ?? "",
				anchor.startOffset ?? ""
			].join("\0");
		}
		//#endregion
		//#region lib/types/client/repository.js
		/**
		* Aside repository: the browser cache over the Host's durable aside index.
		* The Host (not localStorage) is the single source of truth — this store only
		* mirrors `aside.list`/`aside.create` results for the current parent
		* session. A freshly created aside is added to the cache directly from the
		* create response (no second local fact), and switching parent sessions
		* triggers one `aside.list` refresh. No polling and no `localStorage`.
		* @module @ywzhang1031/dsh-client-ui-aside/repository
		*/
		/** Normalize one record's anchor text for the sidebar display. */
		function asideText(record, max = 60) {
			const compact = record.anchor.exact.replace(/\s+/g, " ").trim();
			return compact.length > max ? `${compact.slice(0, max)}…` : compact;
		}
		/**
		* Mutable cache of asides for one parent conversation, populated from the
		* Host. One instance per browser application (the plugin owns it).
		*/
		var AsideRepository = class {
			remote;
			records = [];
			parentSessionId = null;
			version = 0;
			/** Bumped by every refresh() and add(), so a slow stale refresh cannot clobber a newer write. */
			generation = 0;
			listeners = /* @__PURE__ */ new Set();
			constructor(remote) {
				this.remote = remote;
			}
			/** Monotonic change counter; renderers subscribe and re-derive on bump. */
			getVersion() {
				return this.version;
			}
			/** Records for the currently cached parent session. */
			list() {
				return this.records;
			}
			/** Clear the projection when no main session is selected. */
			clear() {
				if (this.parentSessionId === null && this.records.length === 0) return;
				this.parentSessionId = null;
				this.records = [];
				this.generation += 1;
				this.notify();
			}
			/**
			* Load the asides for one parent session. A call is discarded when a newer
			* refresh or a local `add` superseded it (generation changed), or when the
			* user switched sessions mid-flight. Failures clear the cache so a broken
			* parent never shows a stale list.
			*/
			async refresh(parentSessionId) {
				this.parentSessionId = parentSessionId;
				const generation = ++this.generation;
				const result = await this.remote.list({ parentSessionId });
				if (this.parentSessionId !== parentSessionId || this.generation !== generation) return;
				this.records = result.ok && result.value !== void 0 ? result.value.records : [];
				this.notify();
			}
			/**
			* Add a freshly created record to the cache. The record already came from
			* the Host's create response, so this is a cache update, never a second fact.
			* Bumping the generation invalidates any in-flight refresh whose snapshot
			* predates this record, so it cannot overwrite it with a stale (possibly
			* empty) list.
			*/
			add(record) {
				if (record.parentSessionId !== this.parentSessionId) return;
				this.generation += 1;
				if (this.records.findIndex((item) => item.subSessionId === record.subSessionId) === -1) this.records = [...this.records, record];
				else this.records = this.records.map((item) => item.subSessionId === record.subSessionId ? record : item);
				this.notify();
			}
			/** The record one anchor already answers, if any (full anchor identity). */
			find(parentSessionId, anchor) {
				const key = anchorKey(anchor);
				return this.records.find((record) => record.parentSessionId === parentSessionId && anchorKey(record.anchor) === key);
			}
			/** The record one aside id answers, if any. */
			findSub(subSessionId) {
				return this.records.find((record) => record.subSessionId === subSessionId);
			}
			/** Subscribe to cache-set changes (refresh and add). */
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			notify() {
				this.version += 1;
				for (const listener of [...this.listeners]) try {
					listener();
				} catch (error) {
					console.error("[aside] repository listener threw:", error);
				}
			}
		};
		//#endregion
		//#region lib/types/client/drawer-store.js
		/**
		* Drawer open-state store: which side conversation the overlay shows, or a
		* pending draft that only becomes a real aside once the user actually sends
		* a question. A closed unanswered draft leaves nothing behind — no session,
		* no anchor, no highlight. The full {@link AsideAnchor} is carried so the
		* first send can hand it to `aside.create`; the Host (not the client)
		* persists it into the child's first message.
		* @module @ywzhang1031/dsh-client-ui-aside/drawer-store
		*/
		const CLOSED = {
			subSessionId: null,
			parentSessionId: null,
			anchor: null,
			draft: false,
			error: null,
			record: null
		};
		var DrawerStore = class {
			state = CLOSED;
			version = 0;
			listeners = /* @__PURE__ */ new Set();
			get() {
				return this.state;
			}
			/**
			* Monotonic counter bumped on every state transition. Callers capture it
			* before an async first-send and re-check it afterwards so a drawer that was
			* closed/reopened mid-flight never gets bound to the wrong anchor.
			*/
			getVersion() {
				return this.version;
			}
			/**
			* Open a fresh draft: the drawer shows an empty composer bound to one
			* selection. Nothing durable is created until the first send succeeds.
			*/
			openDraft(next) {
				this.state = {
					subSessionId: null,
					parentSessionId: next.parentSessionId,
					anchor: next.anchor,
					draft: true,
					error: null,
					record: null
				};
				this.notify();
			}
			/** Open the drawer on one existing aside (anchor or sidebar entry click). */
			openSub(record) {
				this.state = {
					subSessionId: record.subSessionId,
					parentSessionId: record.parentSessionId,
					anchor: record.anchor,
					draft: false,
					error: null,
					record
				};
				this.notify();
			}
			/** Bind the exact Host record to the draft that initiated its first send. */
			attach(record, expectedVersion) {
				if (this.version !== expectedVersion || this.state.subSessionId !== null || !this.state.draft || this.state.anchor === null || this.state.parentSessionId !== record.parentSessionId || anchorKey(this.state.anchor) !== anchorKey(record.anchor)) return false;
				this.state = {
					subSessionId: record.subSessionId,
					parentSessionId: record.parentSessionId,
					anchor: record.anchor,
					draft: false,
					error: null,
					record
				};
				this.notify();
				return true;
			}
			close() {
				if (this.state === CLOSED) return;
				this.state = CLOSED;
				this.notify();
			}
			setError(message) {
				this.state = {
					...this.state,
					error: message
				};
				this.notify();
			}
			clearError() {
				if (this.state.error === null) return;
				this.state = {
					...this.state,
					error: null
				};
				this.notify();
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			notify() {
				this.version += 1;
				for (const listener of [...this.listeners]) try {
					listener();
				} catch (error) {
					console.error("[aside] drawer listener threw:", error);
				}
			}
		};
		//#endregion
		//#region lib/types/client/quote.js
		/**
		* Quote selector: build and restore the precise character span an aside is
		* anchored to, across Markdown's inline element boundaries. The anchor keeps
		* `exact` (the selected prose), `prefix`/`suffix` (surrounding text for
		* disambiguation), `occurrence` (1-based index among identical matches) and
		* `startOffset` (character offset inside the message's plain text). None of
		* these is a sole source of truth — restore tries raw then whitespace-
		* normalized matching and degrades gracefully.
		* @module @ywzhang1031/dsh-client-ui-aside/quote
		*/
		/** Collapse every whitespace run to one space and trim (matching normalizer). */
		function normalizeText(text) {
			return text.replace(/\s+/g, " ").trim();
		}
		/** Walk a message subtree and return its text nodes plus the concatenated text. */
		function collectTextSpans(root) {
			const doc = root.ownerDocument ?? (typeof document !== "undefined" ? document : void 0);
			if (doc === void 0) return {
				text: "",
				spans: []
			};
			const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
			const spans = [];
			let text = "";
			let current;
			while ((current = walker.nextNode()) !== null) {
				const node = current;
				const start = text.length;
				text += node.data;
				spans.push({
					node,
					start,
					end: text.length
				});
			}
			return {
				text,
				spans
			};
		}
		/** Resolve a (container, offset) to an absolute character offset, or null. */
		function absoluteOffset(spans, container, offset) {
			if (container.nodeType === Node.TEXT_NODE) {
				const span = spans.find((item) => item.node === container);
				if (span === void 0) return null;
				return span.start + offset;
			}
			if (container.nodeType === Node.ELEMENT_NODE) {
				const child = container.childNodes[offset];
				if (child === void 0) return null;
				const first = firstTextOffset(spans, child);
				if (first !== null) return first;
				for (const span of spans) if (container.compareDocumentPosition(span.node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
					if ((child.compareDocumentPosition(span.node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)) !== 0) return span.start;
				}
			}
			return null;
		}
		function firstTextOffset(spans, root) {
			for (const span of spans) if (root === span.node || root.contains(span.node)) return span.start;
			return null;
		}
		/** Count occurrences of `needle` in `haystack` strictly before `before`. */
		function priorOccurrences(haystack, needle, before) {
			let count = 0;
			let index = haystack.indexOf(needle);
			while (index !== -1 && index < before) {
				count += 1;
				index = haystack.indexOf(needle, index + needle.length);
			}
			return count;
		}
		/**
		* Build the disambiguation fields for a selection range inside one message.
		* Returns null when the range carries no usable text.
		*/
		function buildQuote(messageEl, range) {
			const exact = range.toString();
			if (exact.trim() === "") return null;
			const { text, spans } = collectTextSpans(messageEl);
			const start = absoluteOffset(spans, range.startContainer, range.startOffset);
			const end = absoluteOffset(spans, range.endContainer, range.endOffset);
			const startOffset = start ?? 0;
			const occurrence = start === null ? null : priorOccurrences(text, exact, start) + 1;
			return {
				exact,
				prefix: start === null ? "" : text.slice(Math.max(0, start - 60), start),
				suffix: end === null ? "" : text.slice(end, end + 60),
				occurrence,
				startOffset
			};
		}
		/** Map an absolute character offset to a (text node, node-local offset). */
		function spanAt(spans, offset) {
			for (const span of spans) if (offset >= span.start && offset <= span.end) return {
				node: span.node,
				offset: Math.min(offset - span.start, span.node.data.length)
			};
			const last = spans[spans.length - 1];
			if (last !== void 0 && offset >= last.end) return {
				node: last.node,
				offset: last.node.data.length
			};
			return null;
		}
		/** All raw ranges of `needle` in `haystack` (exact, then normalized). */
		function matchRanges(haystack, needle) {
			const raw = indexAll(haystack, needle);
			if (raw.length > 0) return raw.map((start) => ({
				start,
				end: start + needle.length
			}));
			const normalizedHaystack = normalizeText(haystack);
			const normalizedNeedle = normalizeText(needle);
			if (normalizedNeedle === "") return [];
			return indexAll(normalizedHaystack, normalizedNeedle).map((offset) => {
				const start = denormalizeOffset(haystack, offset);
				const end = denormalizeOffset(haystack, offset + normalizedNeedle.length);
				return start === null || end === null ? null : {
					start,
					end
				};
			}).filter((match) => match !== null);
		}
		function indexAll(haystack, needle) {
			const out = [];
			if (needle === "") return out;
			let index = haystack.indexOf(needle);
			while (index !== -1) {
				out.push(index);
				index = haystack.indexOf(needle, index + needle.length);
			}
			return out;
		}
		/** Convert a normalized-string offset back to a raw-string offset. */
		function denormalizeOffset(raw, normalizedOffset) {
			let rawIndex = 0;
			let normIndex = 0;
			while (rawIndex < raw.length && normIndex < normalizedOffset) {
				const rawChar = raw[rawIndex];
				if (/\s/.test(rawChar)) {
					while (rawIndex < raw.length && /\s/.test(raw[rawIndex])) rawIndex += 1;
					normIndex += 1;
				} else {
					rawIndex += 1;
					normIndex += 1;
				}
			}
			return normIndex === normalizedOffset ? rawIndex : null;
		}
		/**
		* Restore the Range an anchor describes inside one message element. Tries the
		* recorded occurrence, then prefix/suffix disambiguation, then normalized
		* matching. Returns null when no reliable span can be found.
		*/
		function restoreRange(messageEl, anchor) {
			const doc = messageEl.ownerDocument ?? (typeof document !== "undefined" ? document : void 0);
			if (doc === void 0) return null;
			const { text, spans } = collectTextSpans(messageEl);
			if (text === "" || anchor.exact === "") return null;
			const matches = matchRanges(text, anchor.exact);
			if (matches.length === 0) return null;
			const starts = matches.map((match) => match.start);
			let match;
			if (anchor.occurrence !== null && anchor.occurrence >= 1 && anchor.occurrence <= starts.length) match = matches[anchor.occurrence - 1];
			else {
				const start = disambiguate(text, starts, anchor);
				match = matches.find((candidate) => candidate.start === start);
			}
			const startPoint = spanAt(spans, match.start);
			const endPoint = spanAt(spans, match.end);
			if (startPoint === null || endPoint === null) return null;
			const range = doc.createRange();
			range.setStart(startPoint.node, startPoint.offset);
			range.setEnd(endPoint.node, endPoint.offset);
			return range;
		}
		/** Pick a match by prefix/suffix proximity when occurrence is unavailable. */
		function disambiguate(text, starts, anchor) {
			let best = starts[0];
			let bestScore = -1;
			for (const start of starts) {
				const before = text.slice(Math.max(0, start - anchor.prefix.length), start);
				const after = text.slice(start + anchor.exact.length, start + anchor.exact.length + anchor.suffix.length);
				const score = similarity(before, anchor.prefix) + similarity(after, anchor.suffix);
				if (score > bestScore) {
					bestScore = score;
					best = start;
				}
			}
			return best;
		}
		function similarity(left, right) {
			const a = normalizeText(left);
			const b = normalizeText(right);
			if (a === "" || b === "") return 0;
			if (a === b) return 2;
			return a.endsWith(b) || b.endsWith(a) ? 1 : 0;
		}
		/**
		* Find the chat-anchor row (one rendered message node) whose text contains
		* the anchor's exact prose. Used to scope exact-text restoration to a single
		* message. Falls back to null when no row contains it (the caller then
		* degrades to message-level positioning).
		*/
		function findRowContaining(root, exact) {
			const needle = normalizeText(exact);
			if (needle === "") return null;
			for (const row of root.querySelectorAll("[data-chat-anchor-key]")) {
				if (!(row instanceof HTMLElement)) continue;
				if (normalizeText(row.textContent ?? "").includes(needle)) return row;
			}
			return null;
		}
		//#endregion
		//#region lib/types/client/message-dom-registry.js
		/**
		* Message DOM registry: the plugin's own map from a stock assistant
		* `messageId` to that message's turn-tail row and action sentinel. The
		* per-message {@link AsideAskAction} registers its nodes on mount and
		* unregisters on unmount; the sidebar/highlight layers use the registry to
		* scroll to a message — using the stock `data-chat-anchor-key` row as a
		* local, verifiable DOM hint, with the action sentinel as the fallback (never
		* a stock CSS class name as the sole authority).
		* @module @ywzhang1031/dsh-client-ui-aside/message-dom-registry
		*/
		/**
		* Resolve the nearest chat-anchor row above a node, or null when the node
		* sits outside a rendered conversation row. Stock publishes the row as
		* `data-chat-anchor-key`; this is a best-effort hint, not a hard contract.
		*/
		function chatAnchorRow(node) {
			if (node === null) return null;
			return (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest("[data-chat-anchor-key]") ?? null;
		}
		/**
		* Resolve the rendered message row for an exact span immediately before one
		* registered turn-tail. Searching backwards only to the prior turn-tail
		* avoids selecting the same prose from an older turn.
		*/
		function findMessageRowBefore(turnTail, exact) {
			const needle = exact.replace(/\s+/g, " ").trim();
			if (needle === "") return null;
			const rows = [...turnTail.ownerDocument.querySelectorAll("[data-chat-anchor-key]")];
			const boundary = rows.indexOf(turnTail);
			if (boundary === -1) return null;
			for (let index = boundary - 1; index >= 0; index -= 1) {
				const row = rows[index];
				if (!(row instanceof HTMLElement)) continue;
				if ((row.dataset.chatAnchorKey ?? "").includes("turn-tail")) break;
				if ((row.textContent ?? "").replace(/\s+/g, " ").trim().includes(needle)) return row;
			}
			return null;
		}
		/**
		* Process-local registry keyed by stock messageId. Registration is scoped to
		* the action component's lifecycle; nothing observes the conversation DOM
		* here (that belongs to the highlight layer).
		*/
		var MessageDomRegistry = class {
			entries = /* @__PURE__ */ new Map();
			/** Register a message's DOM anchors; returns the unregister disposer. */
			register(messageId, entry) {
				this.entries.set(messageId, entry);
				return () => {
					if (this.entries.get(messageId) === entry) this.entries.delete(messageId);
				};
			}
			/** The DOM anchors for one message, if it is currently mounted. */
			get(messageId) {
				return this.entries.get(messageId);
			}
			/** Whether any message is registered. */
			get size() {
				return this.entries.size;
			}
		};
		//#endregion
		//#region lib/types/client/selection.js
		/**
		* Prose-selection watcher: detects a text selection in the conversation
		* surface, floats an "ask about this" button above it, and hands the
		* resolved selection context (including a quote-selector anchor) to the
		* plugin's opener. Message identity is resolved separately via
		* {@link resolveMessageId} (history matching) because stock renders the
		* assistant-actions strip in a sibling node of the message text. The watcher
		* stays outside the React tree entirely.
		* @module @ywzhang1031/dsh-client-ui-aside/selection
		*/
		/** Selection bounds: reject empty, whole-message, or giant selections. */
		const MIN_SELECTION_CHARS = 2;
		const MAX_SELECTION_CHARS = 800;
		const BUTTON_CLASS = "aside-ask-button";
		/**
		* Resolve one browser selection to a {@link SelectionContext}, or undefined
		* when it is empty, out of bounds, or no session is current. The anchor's
		* `messageId` starts null; the opener resolves it from history before the
		* aside is created.
		*/
		function resolveSelection(doc, currentSessionId) {
			if (currentSessionId === null || currentSessionId === "") return void 0;
			const selection = doc.getSelection();
			if (selection === null || selection.rangeCount === 0 || selection.isCollapsed) return void 0;
			const range = selection.getRangeAt(0);
			const exact = range.toString();
			if (exact.trim().length < 2 || exact.trim().length > 800) return void 0;
			const start = range.startContainer;
			const messageEl = start.nodeType === Node.ELEMENT_NODE ? start : start.parentElement;
			if (messageEl === null) return void 0;
			const row = chatAnchorRow(start);
			const quote = row === null ? null : buildQuote(row, range);
			const anchor = {
				messageId: null,
				exact,
				prefix: quote?.prefix ?? "",
				suffix: quote?.suffix ?? "",
				occurrence: quote?.occurrence ?? null,
				startOffset: quote?.startOffset ?? null
			};
			let rect;
			try {
				const probe = range.getBoundingClientRect();
				rect = probe.width === 0 && probe.height === 0 ? messageEl.getBoundingClientRect() : probe;
			} catch {
				rect = messageEl.getBoundingClientRect();
			}
			return {
				sessionId: currentSessionId,
				anchor,
				rect
			};
		}
		/** Extract the plain text of a content-block array. */
		function textOfContent(content) {
			return (Array.isArray(content) ? content : []).filter((block) => typeof block === "object" && block !== null && block.type === "text").map((block) => block.text ?? "").join("\n");
		}
		/**
		* Resolve the unique assistant message a selected span belongs to by matching
		* its normalized text against the session history. Returns the messageId only
		* when exactly one assistant message contains the span; ambiguity or absence
		* yields null (the aside still works message-less).
		*/
		function resolveMessageId(entries, exact) {
			const needle = normalizeText(exact);
			if (needle === "") return null;
			let found = null;
			let count = 0;
			for (const entry of entries) {
				const event = entry.event;
				if (event.type !== "assistant/message") continue;
				const data = event.data;
				if (typeof data?.message?.id !== "string") continue;
				if (normalizeText(textOfContent(data.message.content)).includes(needle)) {
					found = data.message.id;
					count += 1;
				}
			}
			return count === 1 ? found : null;
		}
		/**
		* Document-level watcher owning the floating ask button. `start()` installs
		* the listeners; the returned disposer removes the button and the listeners.
		*/
		var SelectionWatcher = class {
			doc;
			onAsk;
			label;
			currentSession;
			button = null;
			active = null;
			busy = false;
			errorTimer;
			constructor(doc, onAsk, label = "💬 就此提问", currentSession = () => null) {
				this.doc = doc;
				this.onAsk = onAsk;
				this.label = label;
				this.currentSession = currentSession;
			}
			/** Install the listeners; returns a disposer for the whole watcher. */
			start() {
				const onSelection = () => {
					this.sync();
				};
				this.doc.addEventListener("selectionchange", onSelection);
				this.doc.addEventListener("mouseup", onSelection);
				this.doc.addEventListener("mousedown", (event) => {
					if (this.button !== null && event.target instanceof Node && !this.button.contains(event.target)) this.hide();
				});
				return () => {
					this.doc.removeEventListener("selectionchange", onSelection);
					this.doc.removeEventListener("mouseup", onSelection);
					if (this.errorTimer !== void 0) clearTimeout(this.errorTimer);
					this.hide();
				};
			}
			/** Disable the button while a creation request is in flight. */
			setBusy(busy) {
				this.busy = busy;
				if (this.button !== null) this.button.disabled = busy;
			}
			/** Briefly repaint the button with an error message instead of the label. */
			flashError(message) {
				if (this.button === null) return;
				this.button.textContent = `⚠️ ${message}`;
				if (this.errorTimer !== void 0) clearTimeout(this.errorTimer);
				this.errorTimer = setTimeout(() => {
					this.errorTimer = void 0;
					if (this.button !== null) {
						this.button.textContent = this.label;
						this.hide();
					}
				}, 3e3);
			}
			/** Re-resolve the current selection and show/hide the button accordingly. */
			sync() {
				const selection = resolveSelection(this.doc, this.currentSession());
				const active = this.active;
				if (!(selection === void 0 || active === null || active.sessionId !== selection.sessionId || active.anchor.exact !== selection.anchor.exact)) return;
				this.active = selection ?? null;
				if (selection === void 0) {
					this.hide();
					return;
				}
				this.show(selection);
			}
			show(selection) {
				if (this.button === null) {
					this.button = this.doc.createElement("button");
					this.button.type = "button";
					this.button.className = BUTTON_CLASS;
					this.button.textContent = this.label;
					this.button.addEventListener("click", (event) => {
						event.preventDefault();
						event.stopPropagation();
						const active = this.active;
						this.hide();
						if (active !== null) this.onAsk(active);
					});
					this.doc.body.appendChild(this.button);
				}
				this.button.disabled = this.busy;
				const rect = selection.rect;
				this.button.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 64, this.doc.defaultView?.innerWidth ?? -136))}px`;
				this.button.style.top = `${Math.max(8, rect.top - 40)}px`;
				this.button.style.display = "block";
			}
			hide() {
				this.button?.remove();
				this.button = null;
			}
		};
		//#endregion
		//#region lib/types/client/highlight.js
		/**
		* Exact-text highlight over the parent conversation: restore each aside's
		* anchor Range and paint it with the CSS Custom Highlight API (no `<mark>`
		* wrapping of React-managed text). One shared highlight carries every
		* aside's Range; click identification resolves the point with
		* `caretPositionFromPoint`/`caretRangeFromPoint` and tests membership in
		* each aside's restored Range. Browsers without Custom Highlight fall back to
		* message-level styling; the caller owns that CSS class.
		* @module @ywzhang1031/dsh-client-ui-aside/highlight
		*/
		/** The single CSS highlight name shared by every aside's exact highlight. */
		const HIGHLIGHT_NAME = "aside-highlight";
		/** Short-lived stronger highlight used when the sidebar locates an anchor. */
		const ACTIVE_HIGHLIGHT_NAME = "aside-highlight-active";
		/** Whether the browser exposes the CSS Custom Highlight API. */
		function supportsCustomHighlight() {
			return typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";
		}
		/** Whether a collapsed point (node, offset) lies inside a Range. */
		function rangeContainsPoint(range, node, offset) {
			try {
				return range.isPointInRange(node, offset);
			} catch {
				return false;
			}
		}
		/**
		* Owns the live set of exact highlight Ranges for one conversation. Re-adding
		* an aside replaces its previous Range (a DOM re-render recovers the span by
		* calling {@link AsideHighlighter.add} again with a freshly restored Range).
		*/
		var AsideHighlighter = class {
			doc;
			ranges = /* @__PURE__ */ new Map();
			highlight = null;
			activeHighlight = null;
			activeTimer;
			activeSubSessionId = null;
			constructor(doc) {
				this.doc = doc;
			}
			/** The set of sub-session ids currently painted exactly. */
			get painted() {
				return new Set(this.ranges.keys());
			}
			/** Add or replace one aside's exact Range. Returns true when supported. */
			add(subSessionId, range) {
				this.ranges.set(subSessionId, range);
				this.refresh();
				return supportsCustomHighlight();
			}
			/** Remove one aside's exact Range. */
			remove(subSessionId) {
				if (!this.ranges.delete(subSessionId)) return;
				if (this.activeSubSessionId === subSessionId) this.clearFocus();
				this.refresh();
			}
			/** Remove every exact Range. */
			clear() {
				this.clearFocus();
				if (this.ranges.size === 0) return;
				this.ranges.clear();
				this.refresh();
			}
			/**
			* Scroll the exact stored span into view and briefly strengthen its paint.
			* Returns false when that span is not currently mounted, so callers can
			* fall back to the containing message row.
			*/
			focus(subSessionId) {
				const range = this.ranges.get(subSessionId);
				if (range === void 0) return false;
				if (!range.startContainer.isConnected || !range.endContainer.isConnected || range.collapsed || range.toString().trim() === "") {
					this.ranges.delete(subSessionId);
					this.refresh();
					return false;
				}
				const start = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentElement;
				if (start instanceof HTMLElement && typeof start.scrollIntoView === "function") {
					if (!this.centerRange(range, start)) start.scrollIntoView({
						behavior: "smooth",
						block: "center",
						inline: "nearest"
					});
				}
				this.clearFocus();
				this.activeSubSessionId = subSessionId;
				if (supportsCustomHighlight()) {
					this.activeHighlight = new Highlight(range);
					(this.doc.defaultView?.CSS ?? CSS).highlights.set(ACTIVE_HIGHLIGHT_NAME, this.activeHighlight);
				}
				this.activeTimer = setTimeout(() => {
					this.clearFocus();
				}, 1600);
				return true;
			}
			/** Rebuild the shared highlight from the current Range set. */
			refresh() {
				if (!supportsCustomHighlight()) return;
				if (this.highlight === null) this.highlight = new Highlight();
				this.highlight.clear();
				for (const range of this.ranges.values()) this.highlight.add(range);
				(this.doc.defaultView?.CSS ?? CSS).highlights.set(HIGHLIGHT_NAME, this.highlight);
			}
			/** Fine-center a long paragraph on the selected line after mounting it. */
			centerRange(range, start) {
				if (typeof range.getBoundingClientRect !== "function") return false;
				const rect = range.getBoundingClientRect();
				if (rect.height === 0 && rect.width === 0) return false;
				const win = this.doc.defaultView;
				if (win === null) return false;
				const conversationScroller = start.closest("[data-conversation-scroll]");
				if (conversationScroller !== null) {
					const viewport = conversationScroller.getBoundingClientRect();
					conversationScroller.scrollTop = Math.max(0, conversationScroller.scrollTop + rect.top - viewport.top - (viewport.height - rect.height) / 2);
					return true;
				}
				let scroller = start.parentElement;
				while (scroller !== null) {
					const style = win.getComputedStyle(scroller);
					if (/(auto|scroll|overlay)/u.test(style.overflowY) && scroller.scrollHeight > scroller.clientHeight) break;
					scroller = scroller.parentElement;
				}
				if (scroller !== null && typeof scroller.scrollBy === "function") {
					const viewport = scroller.getBoundingClientRect();
					scroller.scrollBy({
						top: rect.top - viewport.top - (viewport.height - rect.height) / 2,
						behavior: "smooth"
					});
					return true;
				}
				const pageScroller = this.doc.scrollingElement;
				if (pageScroller !== null && pageScroller.scrollHeight > pageScroller.clientHeight && typeof win.scrollBy === "function") {
					win.scrollBy({
						top: rect.top - (win.innerHeight - rect.height) / 2,
						behavior: "smooth"
					});
					return true;
				}
				return false;
			}
			clearFocus() {
				if (this.activeTimer !== void 0) clearTimeout(this.activeTimer);
				this.activeTimer = void 0;
				this.activeSubSessionId = null;
				if (supportsCustomHighlight()) (this.doc.defaultView?.CSS ?? CSS).highlights.delete(ACTIVE_HIGHLIGHT_NAME);
				this.activeHighlight = null;
			}
			/**
			* Resolve a viewport point to the aside whose exact Range contains it, via
			* caret position resolution. Returns null when the point is outside every
			* highlighted span (or when the browser cannot resolve a caret point).
			*/
			hitTest(x, y) {
				const point = this.caretPoint(x, y);
				if (point === null) return null;
				for (const [subSessionId, range] of this.ranges) if (rangeContainsPoint(range, point.node, point.offset)) return subSessionId;
				return null;
			}
			caretPoint(x, y) {
				const doc = this.doc;
				if (typeof doc.caretPositionFromPoint === "function") {
					const position = doc.caretPositionFromPoint(x, y);
					if (position !== null) return {
						node: position.offsetNode,
						offset: position.offset
					};
				}
				if (typeof doc.caretRangeFromPoint === "function") {
					const range = doc.caretRangeFromPoint(x, y);
					if (range !== null) return {
						node: range.startContainer,
						offset: range.startOffset
					};
				}
				return null;
			}
		};
		/** Restore one aside's anchor Range inside the given message row, or null. */
		function restoreAnchorRange(row, anchor) {
			return restoreRange(row, anchor);
		}
		//#endregion
		//#region \0dsh-css:/Users/evan/Desktop/dsh-aside/packages/client-ui-aside/src/client/AsideDrawer.module.css.mjs
		const css$2 = ".seqwXG_drawer{z-index:60;border:1px solid var(--dsw-alias-line-weak,#7f7f7f40);background:var(--dsw-alias-bg-container,#fff);border-radius:12px;flex-direction:column;width:min(420px,100vw - 24px);animation:.2s ease-out seqwXG_aside-drawer-in;display:flex;position:fixed;top:12px;bottom:12px;right:12px;overflow:hidden;box-shadow:0 12px 40px #0000002e}@keyframes seqwXG_aside-drawer-in{0%{opacity:0;transform:translate(12px)}to{opacity:1;transform:translate(0)}}.seqwXG_drawer.seqwXG_closing{pointer-events:none;animation:.16s ease-in forwards seqwXG_aside-drawer-out}@keyframes seqwXG_aside-drawer-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(12px)}}@media (prefers-reduced-motion:reduce){.seqwXG_drawer,.seqwXG_drawer.seqwXG_closing{animation:none}}.seqwXG_header{border-bottom:1px solid var(--dsw-alias-line-weak,#7f7f7f40);padding:12px 44px 10px 14px;position:relative}.seqwXG_titleRow{align-items:center;gap:8px;min-width:0;display:flex}.seqwXG_kindLabel{color:var(--dsw-alias-state-business-primary,#1a6bff);flex:none;font-size:12px;font-weight:600}.seqwXG_title{text-overflow:ellipsis;white-space:nowrap;margin:0;font-size:15px;font-weight:600;overflow:hidden}.seqwXG_readonlyBadge{border:1px solid var(--dsw-alias-state-warning,#b26a00);color:var(--dsw-alias-state-warning,#b26a00);border-radius:999px;flex:none;padding:1px 8px;font-size:11px}.seqwXG_select{border:1px solid var(--dsw-alias-line-weak,#7f7f7f59);background:var(--dsw-alias-bg-base,#fafafa);max-width:150px;font:inherit;color:var(--dsw-alias-text-primary,#1a1a1a);border-radius:6px;padding:2px 4px;font-size:12px}.seqwXG_generating{color:var(--dsw-alias-text-secondary,#666);align-items:center;gap:5px;font-size:11px;display:inline-flex}.seqwXG_activityDot{background:var(--dsw-alias-state-business-primary,#1a6bff);border-radius:50%;width:6px;height:6px;animation:1.1s ease-in-out infinite seqwXG_aside-activity-pulse}@keyframes seqwXG_aside-activity-pulse{0%,to{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}@media (prefers-reduced-motion:reduce){.seqwXG_activityDot{animation:none}}.seqwXG_hint{color:var(--dsw-alias-text-secondary,#666);margin:6px 0 0;font-size:12px}.seqwXG_close{width:28px;height:28px;color:var(--dsw-alias-text-secondary,#666);cursor:pointer;background:0 0;border:none;border-radius:6px;font-size:20px;line-height:1;position:absolute;top:8px;right:10px}.seqwXG_close:hover{background:var(--dsw-alias-bg-hover,#0000000d)}.seqwXG_error,.seqwXG_notice{border-radius:8px;margin:8px 14px 0;padding:8px 10px;font-size:12px}.seqwXG_error{background:color-mix(in srgb, var(--dsw-alias-state-danger,#c00) 10%, transparent);color:var(--dsw-alias-state-danger,#c00)}.seqwXG_notice{background:var(--dsw-alias-bg-hover,#0000000d);color:var(--dsw-alias-text-secondary,#666)}.seqwXG_messages{flex-direction:column;flex:1;gap:12px;padding:12px 14px;display:flex;overflow-y:auto}.seqwXG_status{color:var(--dsw-alias-text-secondary,#666);margin:0;font-size:13px}.seqwXG_draftCard{border:1px solid var(--dsw-alias-line-weak,#7f7f7f40);background:var(--dsw-alias-bg-base,#fafafa);border-radius:10px;padding:12px}.seqwXG_draftLabel{color:var(--dsw-alias-text-secondary,#666);margin-bottom:6px;font-size:11px;font-weight:600;display:block}.seqwXG_draftQuote{border-left:2px solid var(--dsw-alias-state-business-primary,#1a6bff);color:var(--dsw-alias-text-primary,#1a1a1a);white-space:pre-wrap;margin:0 0 8px;padding-left:10px;font-size:13px;line-height:1.5}.seqwXG_row{flex-direction:column;gap:4px;animation:.16s ease-out seqwXG_aside-row-in;display:flex}@keyframes seqwXG_aside-row-in{0%{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.seqwXG_row{animation:none}}.seqwXG_role{color:var(--dsw-alias-text-secondary,#888);font-size:11px;font-weight:600}.seqwXG_userText{white-space:pre-wrap;word-break:break-word;margin:0;font-size:13px}.seqwXG_toolRow{background:var(--dsw-alias-bg-hover,#0000000d);color:var(--dsw-alias-text-secondary,#666);border-radius:999px;align-self:flex-start;padding:3px 10px;font-size:12px}.seqwXG_backToBottom{border:1px solid var(--dsw-alias-line-weak,#7f7f7f59);background:var(--dsw-alias-bg-container,#fff);font:inherit;color:var(--dsw-alias-text-primary,#1a1a1a);cursor:pointer;border-radius:999px;padding:4px 12px;font-size:12px;position:absolute;bottom:92px;right:24px;box-shadow:0 2px 8px #00000024}.seqwXG_composer{border-top:1px solid var(--dsw-alias-line-weak,#7f7f7f40);background:var(--dsw-alias-bg-container,#fff);flex-direction:column;gap:8px;padding:10px 14px 14px;display:flex}.seqwXG_commandMenu{border:1px solid var(--dsw-alias-line-weak,#7f7f7f40);background:var(--dsw-alias-bg-container,#fff);border-radius:8px;flex-direction:column;gap:2px;padding:4px;display:flex;box-shadow:0 4px 14px #0000001a}.seqwXG_commandItem{color:var(--dsw-alias-text-primary,#1a1a1a);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:6px;padding:6px 8px;font:12px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}.seqwXG_commandItem:hover,.seqwXG_commandItem:focus-visible{background:var(--dsw-alias-bg-hover,#0000000d);outline:none}.seqwXG_input{border:1px solid var(--dsw-alias-line-weak,#7f7f7f59);background:var(--dsw-alias-bg-base,#fafafa);width:100%;min-height:84px;max-height:200px;font:inherit;resize:vertical;border-radius:8px;padding:8px 10px;font-size:13px}.seqwXG_composerToolbar,.seqwXG_toolbarStart,.seqwXG_toolbarEnd,.seqwXG_compactControl{align-items:center;display:flex}.seqwXG_composerToolbar{justify-content:space-between;gap:8px}.seqwXG_toolbarStart,.seqwXG_toolbarEnd{gap:6px;min-width:0}.seqwXG_compactControl{gap:4px;min-width:0}.seqwXG_commandTrigger{width:28px;height:28px;color:var(--dsw-alias-text-secondary,#666);font:inherit;cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;font-size:18px;display:inline-flex}.seqwXG_commandTrigger:hover,.seqwXG_commandTrigger:focus-visible{background:var(--dsw-alias-bg-hover,#0000000d);outline:none}.seqwXG_toolbarEnd .seqwXG_select{max-width:150px}.seqwXG_send{background:var(--dsw-alias-state-business-primary,#1a6bff);color:#fff;width:32px;height:32px;font:inherit;cursor:pointer;border:none;border-radius:50%;flex:none;padding:0;font-size:19px;line-height:1}.seqwXG_send:disabled{opacity:.5;cursor:not-allowed}@media (width<=520px){.seqwXG_composerToolbar{flex-direction:column;align-items:flex-start}.seqwXG_toolbarEnd{justify-content:flex-end;width:100%}}";
		const tagId$2 = "@ywzhang1031/dsh-client-ui-aside/AsideDrawer.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@ywzhang1031/dsh-client-ui-aside";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var AsideDrawer_module_css_default = {
			"activityDot": "seqwXG_activityDot",
			"aside-activity-pulse": "seqwXG_aside-activity-pulse",
			"aside-drawer-in": "seqwXG_aside-drawer-in",
			"aside-drawer-out": "seqwXG_aside-drawer-out",
			"aside-row-in": "seqwXG_aside-row-in",
			"backToBottom": "seqwXG_backToBottom",
			"close": "seqwXG_close",
			"closing": "seqwXG_closing",
			"commandItem": "seqwXG_commandItem",
			"commandMenu": "seqwXG_commandMenu",
			"commandTrigger": "seqwXG_commandTrigger",
			"compactControl": "seqwXG_compactControl",
			"composer": "seqwXG_composer",
			"composerToolbar": "seqwXG_composerToolbar",
			"draftCard": "seqwXG_draftCard",
			"draftLabel": "seqwXG_draftLabel",
			"draftQuote": "seqwXG_draftQuote",
			"drawer": "seqwXG_drawer",
			"error": "seqwXG_error",
			"generating": "seqwXG_generating",
			"header": "seqwXG_header",
			"hint": "seqwXG_hint",
			"input": "seqwXG_input",
			"kindLabel": "seqwXG_kindLabel",
			"messages": "seqwXG_messages",
			"notice": "seqwXG_notice",
			"readonlyBadge": "seqwXG_readonlyBadge",
			"role": "seqwXG_role",
			"row": "seqwXG_row",
			"select": "seqwXG_select",
			"send": "seqwXG_send",
			"status": "seqwXG_status",
			"title": "seqwXG_title",
			"titleRow": "seqwXG_titleRow",
			"toolbarEnd": "seqwXG_toolbarEnd",
			"toolbarStart": "seqwXG_toolbarStart",
			"toolRow": "seqwXG_toolRow",
			"userText": "seqwXG_userText"
		};
		//#endregion
		//#region lib/types/client/AsideDrawer.js
		/**
		* Side-conversation drawer over the frame-wide overlay slot: a compact
		* read-only chat panel. It opens as a DRAFT bound to one prose selection
		* (empty composer); the first send creates the forked aside, asks the
		* anchored source durably first, sends the question, and only then does the
		* selection become a highlightable anchor. One stable composer shows the
		* model/reasoning selection, fixed read-only posture, and command entry in
		* both draft and durable states; draft choices apply to the child before its
		* first prompt instead of mutating the parent.
		* History streams via adaptive polling (fast while generating, backing off
		* when idle, stopping when hidden/closed) with autoscroll.
		* @module @ywzhang1031/dsh-client-ui-aside/AsideDrawer
		*/
		/** The command whitelist allowed inside an aside (first version). */
		const ASIDE_COMMANDS = /* @__PURE__ */ new Set([
			"model",
			"compact",
			"export",
			"feedback"
		]);
		/** Commands deliberately blocked in an aside, reported with a clear error. */
		const BLOCKED_COMMANDS = /* @__PURE__ */ new Set([
			"permission",
			"plan",
			"goal"
		]);
		/** Strip the durable anchor marker line from a first user message for display. */
		function cleanUserText(text) {
			return text.replace(/\[aside:[^\]]+\]/g, "").replace(/\n*---\n引用原文：\n[\s\S]*$/u, "").trim();
		}
		/** Extract the plain text of a content-block array. */
		function textOf$1(blocks) {
			return (Array.isArray(blocks) ? blocks : []).filter((block) => typeof block === "object" && block !== null && block.type === "text").map((block) => block.text ?? "").join("\n").trim();
		}
		/**
		* Project raw history events into display rows: discard the inherited parent
		* seed through this aside's own (last) durable anchor marker, then surface
		* user/assistant messages and tool-call heads. The last marker matters for a
		* nested aside because its inherited seed may contain an ancestor's marker.
		*/
		function projectHistory(entries) {
			let ownAnchorIndex = -1;
			for (let index = entries.length - 1; index >= 0; index -= 1) {
				const event = entries[index]?.event;
				if (event?.type !== "user/message") continue;
				const data = event.data;
				if (parseAnchor(textOf$1(data?.content)) !== void 0) {
					ownAnchorIndex = index;
					break;
				}
			}
			const rows = [];
			for (const entry of entries.slice(ownAnchorIndex + 1)) {
				const event = entry.event;
				if (event.type === "user/message") {
					const data = event.data;
					const text = cleanUserText(textOf$1(data?.content));
					if (text === "") continue;
					rows.push({
						kind: "user",
						text
					});
				} else if (event.type === "assistant/message") {
					const data = event.data;
					const text = textOf$1(data?.message?.content);
					if (text === "") continue;
					rows.push({
						kind: "assistant",
						text
					});
				} else if (event.type === "tool/call") {
					const data = event.data;
					if (data?.name !== void 0) rows.push({
						kind: "tool",
						name: data.name
					});
				}
			}
			return rows;
		}
		/** Whether the history tail looks like a turn is still generating. */
		function isGenerating(entries) {
			const last = entries[entries.length - 1];
			if (last === void 0) return false;
			switch (last.event.type) {
				case "turn/start":
				case "step/start":
				case "assistant/chunk":
				case "tool/call": return true;
				default: return false;
			}
		}
		const FAST_MS = 700;
		const SLOW_MS = 2500;
		function AsideDrawer({ store, api, onFirstSend, t }) {
			const state = (0, react.useSyncExternalStore)((listener) => store.subscribe(listener), () => store.get());
			const subSessionId = state.subSessionId;
			const [rows, setRows] = (0, react.useState)([]);
			const [value, setValue] = (0, react.useState)("");
			const [sending, setSending] = (0, react.useState)(false);
			const [generating, setGenerating] = (0, react.useState)(false);
			const [closing, setClosing] = (0, react.useState)(false);
			const [loaded, setLoaded] = (0, react.useState)(false);
			const [directory, setDirectory] = (0, react.useState)(null);
			const [directorySessionId, setDirectorySessionId] = (0, react.useState)(null);
			const [notice, setNotice] = (0, react.useState)(null);
			const inputRef = (0, react.useRef)(null);
			const modelRef = (0, react.useRef)(null);
			const messagesRef = (0, react.useRef)(null);
			const closeTimerRef = (0, react.useRef)(void 0);
			const atBottomRef = (0, react.useRef)(true);
			const composingRef = (0, react.useRef)(false);
			const [atBottom, setAtBottom] = (0, react.useState)(true);
			const onCompositionStart = () => {
				composingRef.current = true;
			};
			const onCompositionEnd = () => {
				setTimeout(() => {
					composingRef.current = false;
				}, 10);
			};
			(0, react.useEffect)(() => {
				if (subSessionId === null && !state.draft) return;
				if (closeTimerRef.current !== void 0) clearTimeout(closeTimerRef.current);
				closeTimerRef.current = void 0;
				setClosing(false);
				setValue("");
				setNotice(null);
				inputRef.current?.focus();
			}, [subSessionId, state.draft]);
			(0, react.useEffect)(() => {
				if (subSessionId === null) {
					setRows([]);
					setLoaded(false);
					setGenerating(false);
					return;
				}
				let disposed = false;
				let timer;
				let inflight = false;
				const controller = new AbortController();
				const schedule = (ms) => {
					if (disposed) return;
					if (timer !== void 0) clearTimeout(timer);
					if (typeof document !== "undefined" && document.hidden) return;
					timer = setTimeout(() => {
						refresh();
					}, ms);
				};
				const refresh = async () => {
					if (disposed || inflight) return;
					inflight = true;
					try {
						const response = await api.sessions.history({
							sessionId: subSessionId,
							maxMessages: 100
						}, controller.signal);
						if (disposed) return;
						if (response.result.ok) {
							const generatingNow = isGenerating(response.result.value.events);
							setRows(projectHistory(response.result.value.events));
							setLoaded(true);
							setGenerating(generatingNow);
							schedule(generatingNow ? FAST_MS : SLOW_MS);
						} else schedule(SLOW_MS);
					} catch {
						if (!disposed) schedule(SLOW_MS);
					} finally {
						inflight = false;
					}
				};
				const onVisibilityChange = () => {
					if (disposed || document.hidden) return;
					if (timer !== void 0) clearTimeout(timer);
					timer = void 0;
					refresh();
				};
				document.addEventListener("visibilitychange", onVisibilityChange);
				refresh();
				return () => {
					disposed = true;
					if (timer !== void 0) clearTimeout(timer);
					document.removeEventListener("visibilitychange", onVisibilityChange);
					controller.abort();
				};
			}, [subSessionId, api]);
			const modelSessionId = subSessionId ?? (state.draft ? state.parentSessionId : null);
			const loadDirectory = (0, react.useCallback)(async (signal) => {
				if (modelSessionId === null) return;
				try {
					const response = await api.sessions.models({ sessionId: modelSessionId }, signal);
					if (response.result.ok) {
						setDirectory(response.result.value);
						setDirectorySessionId(modelSessionId);
					}
				} catch {}
			}, [modelSessionId, api]);
			(0, react.useEffect)(() => {
				if (modelSessionId === null) {
					setDirectory(null);
					setDirectorySessionId(null);
					return;
				}
				setDirectorySessionId(null);
				const controller = new AbortController();
				loadDirectory(controller.signal);
				return () => {
					controller.abort();
				};
			}, [modelSessionId, loadDirectory]);
			const onScroll = (0, react.useCallback)(() => {
				const el = messagesRef.current;
				if (el === null) return;
				const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
				atBottomRef.current = nearBottom;
				setAtBottom(nearBottom);
			}, []);
			(0, react.useEffect)(() => {
				const el = messagesRef.current;
				if (el === null || !atBottomRef.current) return;
				el.scrollTop = el.scrollHeight;
			}, [rows, subSessionId]);
			const scrollToBottom = (0, react.useCallback)(() => {
				const el = messagesRef.current;
				if (el !== null) el.scrollTop = el.scrollHeight;
				atBottomRef.current = true;
				setAtBottom(true);
			}, []);
			const selectModel = async (providerModel) => {
				if (directory === null) return;
				const separator = providerModel.indexOf("\0");
				const provider = separator === -1 ? providerModel : providerModel.slice(0, separator);
				const model = separator === -1 ? "" : providerModel.slice(separator + 1);
				if (state.draft || subSessionId === null) {
					const definition = directory.groups.find((group) => group.id === provider)?.models.find((item) => item.id === model);
					setDirectory({
						...directory,
						current: {
							provider,
							model,
							...definition?.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: definition.reasoning.defaultEffort }
						}
					});
					return;
				}
				try {
					const response = await api.sessions.selectModel({
						sessionId: subSessionId,
						provider,
						model
					});
					if (!response.result.ok) {
						setNotice(t("commandError", { message: response.result.error.message }));
						return;
					}
					loadDirectory();
				} catch (error) {
					setNotice(t("commandError", { message: error instanceof Error ? error.message : String(error) }));
				}
			};
			const selectReasoning = async (effort) => {
				if (directory === null) return;
				const { provider, model } = directory.current;
				if (state.draft || subSessionId === null) {
					setDirectory({
						...directory,
						current: {
							provider,
							model,
							...effort === "" ? {} : { reasoningEffort: effort }
						}
					});
					return;
				}
				try {
					const response = await api.sessions.selectModel({
						sessionId: subSessionId,
						provider,
						model,
						...effort === "" ? {} : { reasoningEffort: effort }
					});
					if (!response.result.ok) {
						setNotice(t("commandError", { message: response.result.error.message }));
						return;
					}
					loadDirectory();
				} catch (error) {
					setNotice(t("commandError", { message: error instanceof Error ? error.message : String(error) }));
				}
			};
			const send = async () => {
				if (sending || value.trim() === "") return;
				const trimmed = value.trim();
				const isDraft = state.draft || subSessionId === null;
				if (trimmed.startsWith("/")) {
					const name = trimmed.slice(1).split(/\s+/)[0] ?? "";
					if (BLOCKED_COMMANDS.has(name)) {
						setNotice(t("commandNotAllowed", { command: `/${name}` }));
						return;
					}
					if (!ASIDE_COMMANDS.has(name)) {
						setNotice(t("unknownCommand", { command: `/${name}` }));
						return;
					}
					if (isDraft) {
						setNotice(t("draftNoCommand"));
						return;
					}
				}
				setSending(true);
				try {
					if (isDraft) {
						if (await onFirstSend(trimmed, directory === null || directorySessionId !== modelSessionId ? void 0 : {
							provider: directory.current.provider,
							model: directory.current.model,
							...directory.current.reasoningEffort === void 0 ? {} : { reasoningEffort: directory.current.reasoningEffort }
						})) setValue("");
						return;
					}
					const response = await api.sessions.prompt({
						sessionId: subSessionId,
						mode: "queue",
						content: [{
							type: "text",
							text: trimmed
						}]
					});
					if (!response.result.ok) {
						setNotice(response.result.error.code === "unknown-command" ? t("unknownCommand", { command: trimmed }) : t("commandError", { message: response.result.error.message }));
						return;
					}
					setValue("");
				} catch (error) {
					setNotice(t("commandError", { message: error instanceof Error ? error.message : String(error) }));
				} finally {
					setSending(false);
				}
			};
			const title = (0, react.useMemo)(() => {
				return state.anchor === null ? "" : anchorSummary(state.anchor.exact, 40);
			}, [state.anchor]);
			const currentEffort = directory?.current.reasoningEffort;
			const currentModelKey = directory === null ? "" : `${directory.current.provider}\u0000${directory.current.model}`;
			const currentModelDefinition = directory === null ? void 0 : directory.groups.find((group) => group.id === directory.current.provider)?.models.find((model) => model.id === directory.current.model);
			const reasoningEfforts = currentModelDefinition?.reasoning?.efforts ?? [];
			const drawerIsDraft = state.draft || subSessionId === null;
			const commandMatch = /^\/([^\s]*)$/.exec(value.trimStart());
			const commandOptions = commandMatch === null ? [] : [...ASIDE_COMMANDS].filter((command) => command.startsWith(commandMatch[1] ?? ""));
			const chooseCommand = (command) => {
				if (drawerIsDraft) {
					setValue("");
					if (command === "model") {
						setNotice(t("draftModelCommand"));
						modelRef.current?.focus();
					} else setNotice(t("draftNoCommand"));
					return;
				}
				setValue(`/${command} `);
				inputRef.current?.focus();
			};
			const closeDrawer = () => {
				if (closing) return;
				if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					store.close();
					return;
				}
				setClosing(true);
				closeTimerRef.current = setTimeout(() => {
					closeTimerRef.current = void 0;
					store.close();
					setClosing(false);
				}, 160);
			};
			(0, react.useEffect)(() => () => {
				if (closeTimerRef.current !== void 0) clearTimeout(closeTimerRef.current);
			}, []);
			if (subSessionId === null && !state.draft) return null;
			return (0, react_jsx_runtime.jsxs)("aside", {
				className: `${AsideDrawer_module_css_default.drawer}${closing ? ` ${AsideDrawer_module_css_default.closing}` : ""}`,
				role: "dialog",
				"aria-label": t("title"),
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: AsideDrawer_module_css_default.header,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: AsideDrawer_module_css_default.titleRow,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: AsideDrawer_module_css_default.kindLabel,
									children: t("title")
								}), (0, react_jsx_runtime.jsx)("h2", {
									className: AsideDrawer_module_css_default.title,
									title: state.anchor?.exact,
									children: title
								})]
							}),
							(0, react_jsx_runtime.jsx)("p", {
								className: AsideDrawer_module_css_default.hint,
								children: t("readonlyHint")
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AsideDrawer_module_css_default.close,
								"aria-label": t("close"),
								onClick: closeDrawer,
								children: "×"
							})
						]
					}),
					state.error !== null && (0, react_jsx_runtime.jsx)("p", {
						className: AsideDrawer_module_css_default.error,
						role: "alert",
						children: t("error", { message: state.error })
					}),
					notice !== null && (0, react_jsx_runtime.jsx)("p", {
						className: AsideDrawer_module_css_default.notice,
						role: "status",
						children: notice
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						ref: messagesRef,
						className: AsideDrawer_module_css_default.messages,
						onScroll,
						children: [
							state.draft && (0, react_jsx_runtime.jsxs)("div", {
								className: AsideDrawer_module_css_default.draftCard,
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: AsideDrawer_module_css_default.draftLabel,
										children: t("sourceLabel")
									}),
									(0, react_jsx_runtime.jsx)("blockquote", {
										className: AsideDrawer_module_css_default.draftQuote,
										children: state.anchor?.exact
									}),
									(0, react_jsx_runtime.jsx)("p", {
										className: AsideDrawer_module_css_default.status,
										children: t("draftHint")
									})
								]
							}),
							!state.draft && !loaded && rows.length === 0 && (0, react_jsx_runtime.jsx)("p", {
								className: AsideDrawer_module_css_default.status,
								children: t("loading")
							}),
							!state.draft && loaded && rows.length === 0 && (0, react_jsx_runtime.jsx)("p", {
								className: AsideDrawer_module_css_default.status,
								children: t("empty")
							}),
							rows.map((row, index) => (0, react_jsx_runtime.jsx)("div", {
								className: AsideDrawer_module_css_default.row,
								"data-row-kind": row.kind,
								children: row.kind === "tool" ? (0, react_jsx_runtime.jsxs)("span", {
									className: AsideDrawer_module_css_default.toolRow,
									children: ["🔍 ", row.name]
								}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("span", {
									className: AsideDrawer_module_css_default.role,
									children: row.kind === "user" ? t("userRole") : t("assistantRole")
								}), row.kind === "assistant" ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: row.text }) : (0, react_jsx_runtime.jsx)("p", {
									className: AsideDrawer_module_css_default.userText,
									children: row.text
								})] })
							}, index))
						]
					}),
					!atBottom && rows.length > 0 && (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: AsideDrawer_module_css_default.backToBottom,
						onClick: scrollToBottom,
						children: t("backToBottom")
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: AsideDrawer_module_css_default.composer,
						children: [
							commandOptions.length > 0 && (0, react_jsx_runtime.jsx)("div", {
								className: AsideDrawer_module_css_default.commandMenu,
								role: "listbox",
								"aria-label": t("commandHint"),
								children: commandOptions.map((command) => (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: AsideDrawer_module_css_default.commandItem,
									role: "option",
									"aria-selected": "false",
									onClick: () => {
										chooseCommand(command);
									},
									children: ["/", command]
								}, command))
							}),
							(0, react_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								className: AsideDrawer_module_css_default.input,
								value,
								placeholder: t("commandPlaceholder"),
								onChange: (event) => {
									setValue(event.currentTarget.value);
								},
								onKeyDown: (event) => {
									if (event.key === "Enter" && event.shiftKey) return;
									const composing = composingRef.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
									if (event.key === "Escape") {
										if (composing) return;
										event.preventDefault();
										closeDrawer();
										return;
									}
									if (event.key !== "Enter" || composing) return;
									event.preventDefault();
									if (event.repeat) return;
									send();
								},
								onCompositionStart,
								onCompositionEnd
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: AsideDrawer_module_css_default.composerToolbar,
								children: [(0, react_jsx_runtime.jsxs)("div", {
									className: AsideDrawer_module_css_default.toolbarStart,
									children: [
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: AsideDrawer_module_css_default.commandTrigger,
											"aria-label": t("commandHint"),
											title: t("commandHint"),
											onClick: () => {
												setValue("/");
												inputRef.current?.focus();
											},
											children: (0, react_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: "＋"
											})
										}),
										(0, react_jsx_runtime.jsxs)("span", {
											className: AsideDrawer_module_css_default.readonlyBadge,
											title: t("readonlyHint"),
											children: ["🔒 ", t("readOnlyLabel")]
										}),
										generating && (0, react_jsx_runtime.jsxs)("span", {
											className: AsideDrawer_module_css_default.generating,
											role: "status",
											children: [(0, react_jsx_runtime.jsx)("span", { className: AsideDrawer_module_css_default.activityDot }), t("generating")]
										})
									]
								}), (0, react_jsx_runtime.jsxs)("div", {
									className: AsideDrawer_module_css_default.toolbarEnd,
									children: [
										(0, react_jsx_runtime.jsx)("label", {
											className: AsideDrawer_module_css_default.compactControl,
											title: t("modelLabel"),
											children: (0, react_jsx_runtime.jsxs)("select", {
												ref: modelRef,
												className: AsideDrawer_module_css_default.select,
												value: currentModelKey,
												"aria-label": t("modelLabel"),
												disabled: directory === null || directorySessionId !== modelSessionId || sending || generating,
												onChange: (event) => {
													selectModel(event.currentTarget.value);
												},
												children: [currentModelKey !== "" && (0, react_jsx_runtime.jsx)("option", {
													value: currentModelKey,
													children: currentModelDefinition?.name ?? directory?.current.model ?? currentModelKey
												}), directory?.groups.flatMap((group) => group.models.map((model) => ({
													key: `${group.id}\u0000${model.id}`,
													label: `${group.name} · ${model.name}`
												}))).filter((option) => option.key !== currentModelKey).map((option) => (0, react_jsx_runtime.jsx)("option", {
													value: option.key,
													children: option.label
												}, option.key))]
											})
										}),
										(0, react_jsx_runtime.jsx)("label", {
											className: AsideDrawer_module_css_default.compactControl,
											title: t("reasoningLabel"),
											children: (0, react_jsx_runtime.jsxs)("select", {
												className: AsideDrawer_module_css_default.select,
												value: currentEffort ?? "",
												"aria-label": t("reasoningLabel"),
												disabled: directory === null || directorySessionId !== modelSessionId || sending || generating,
												onChange: (event) => {
													selectReasoning(event.currentTarget.value);
												},
												children: [(0, react_jsx_runtime.jsx)("option", {
													value: "",
													children: t("defaultReasoning")
												}), reasoningEfforts.map((effort) => (0, react_jsx_runtime.jsx)("option", {
													value: effort.id,
													children: effort.name
												}, effort.id))]
											})
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: AsideDrawer_module_css_default.send,
											"aria-label": sending ? t("sending") : t("send"),
											title: sending ? t("sending") : t("send"),
											disabled: sending || value.trim() === "",
											onClick: () => {
												send();
											},
											children: sending ? "…" : "↑"
										})
									]
								})]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/evan/Desktop/dsh-aside/packages/client-ui-aside/src/client/AsideSidebar.module.css.mjs
		const css$1 = ".P7Ci5G_sidebar{z-index:40;pointer-events:auto;flex-direction:column;gap:8px;width:268px;max-height:calc(100vh - 24px);display:flex;position:fixed;top:12px;right:12px}.P7Ci5G_section{border:1px solid var(--dsw-alias-line-weak,#7f7f7f40);background:var(--dsw-alias-bg-container,#fff);border-radius:10px;overflow:hidden;box-shadow:0 4px 18px #00000014}.P7Ci5G_sectionHead{width:100%;font:inherit;color:var(--dsw-alias-text-primary,#1a1a1a);cursor:pointer;text-align:left;background:0 0;border:none;justify-content:space-between;align-items:center;padding:8px 12px;font-size:12px;font-weight:600;display:flex}.P7Ci5G_sectionHead:hover{background:var(--dsw-alias-bg-hover,#0000000a)}.P7Ci5G_count{background:var(--dsw-alias-bg-hover,#0000000f);color:var(--dsw-alias-text-secondary,#666);border-radius:999px;padding:0 8px;font-size:11px;font-weight:500}.P7Ci5G_list{flex-direction:column;gap:2px;max-height:320px;margin:0;padding:0 6px 8px;list-style:none;display:flex;overflow-y:auto}.P7Ci5G_empty{color:var(--dsw-alias-text-secondary,#888);padding:4px 8px;font-size:12px}.P7Ci5G_asideEntry{width:100%;font:inherit;color:var(--dsw-alias-state-business-primary,#1a6bff);text-align:left;cursor:pointer;text-overflow:ellipsis;white-space:normal;background:0 0;border:none;border-radius:6px;flex-direction:column;gap:2px;padding:5px 8px;font-size:12px;display:flex;overflow:hidden}.P7Ci5G_asideEntry:hover{background:var(--dsw-alias-bg-hover,#0000000d);text-underline-offset:2px;text-decoration:underline}.P7Ci5G_asideEntry.P7Ci5G_active{background:color-mix(in srgb, var(--dsw-alias-state-business-primary,#1a6bff) 10%, transparent);box-shadow:inset 2px 0 0 var(--dsw-alias-state-business-primary,#1a6bff)}.P7Ci5G_asideText{text-overflow:ellipsis;white-space:nowrap;display:block;overflow:hidden}.P7Ci5G_asideTime{color:var(--dsw-alias-text-secondary,#888);text-overflow:ellipsis;white-space:nowrap;font-size:10px;text-decoration:none;display:block;overflow:hidden}";
		const tagId$1 = "@ywzhang1031/dsh-client-ui-aside/AsideSidebar.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@ywzhang1031/dsh-client-ui-aside";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var AsideSidebar_module_css_default = {
			"active": "P7Ci5G_active",
			"asideEntry": "P7Ci5G_asideEntry",
			"asideText": "P7Ci5G_asideText",
			"asideTime": "P7Ci5G_asideTime",
			"count": "P7Ci5G_count",
			"empty": "P7Ci5G_empty",
			"list": "P7Ci5G_list",
			"section": "P7Ci5G_section",
			"sectionHead": "P7Ci5G_sectionHead",
			"sidebar": "P7Ci5G_sidebar"
		};
		//#endregion
		//#region lib/types/client/AsideSidebar.js
		/**
		* Frame sidebar: a standing right rail listing the aside chats anchored into
		* the current main conversation. Each entry opens its side conversation in
		* the drawer and locates the parent message. The list comes from the Host
		* repository cache (no localStorage, no history polling); switching the
		* parent session triggers one `aside.list` refresh.
		* @module @ywzhang1031/dsh-client-ui-aside/AsideSidebar
		*/
		/** Compact locale-aware timestamp for one sidebar row. */
		function formatAsideTime(timestamp) {
			return new Intl.DateTimeFormat(void 0, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).format(new Date(timestamp));
		}
		function AsideSidebar({ repository, drawer, sessions, onOpenAside, t }) {
			const sessionId = (0, react.useSyncExternalStore)((listener) => sessions.subscribe(listener), () => sessions.getCurrent());
			const version = (0, react.useSyncExternalStore)((listener) => repository.subscribe(listener), () => repository.getVersion());
			(0, react.useSyncExternalStore)((listener) => drawer.subscribe(listener), () => drawer.getVersion());
			const [open, setOpen] = (0, react.useState)(true);
			const [loading, setLoading] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (sessionId === null) {
					repository.clear();
					setLoading(false);
					return;
				}
				let disposed = false;
				setLoading(true);
				repository.refresh(sessionId).finally(() => {
					if (!disposed) setLoading(false);
				});
				return () => {
					disposed = true;
				};
			}, [sessionId, repository]);
			const entries = (0, react.useMemo)(() => {
				return [...repository.list()].sort((left, right) => right.updatedAt - left.updatedAt);
			}, [repository, version]);
			const activeSubSessionId = drawer.get().subSessionId;
			return (0, react_jsx_runtime.jsx)("nav", {
				className: AsideSidebar_module_css_default.sidebar,
				"aria-label": t("sidebarLabel"),
				children: (0, react_jsx_runtime.jsxs)("section", {
					className: AsideSidebar_module_css_default.section,
					children: [(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: AsideSidebar_module_css_default.sectionHead,
						"aria-expanded": open,
						onClick: () => {
							setOpen((current) => !current);
						},
						children: [(0, react_jsx_runtime.jsx)("span", { children: t("asidesTitle") }), (0, react_jsx_runtime.jsx)("span", {
							className: AsideSidebar_module_css_default.count,
							children: entries.length
						})]
					}), open && (0, react_jsx_runtime.jsxs)("ul", {
						className: AsideSidebar_module_css_default.list,
						children: [
							loading && entries.length === 0 && (0, react_jsx_runtime.jsx)("li", {
								className: AsideSidebar_module_css_default.empty,
								children: t("asidesLoading")
							}),
							!loading && entries.length === 0 && (0, react_jsx_runtime.jsx)("li", {
								className: AsideSidebar_module_css_default.empty,
								children: t("asidesEmpty")
							}),
							entries.map((record) => (0, react_jsx_runtime.jsx)("li", { children: (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `${AsideSidebar_module_css_default.asideEntry}${record.subSessionId === activeSubSessionId ? ` ${AsideSidebar_module_css_default.active}` : ""}`,
								title: record.anchor.exact,
								"aria-label": `${t("openAside")}: ${asideText(record)}`,
								"aria-current": record.subSessionId === activeSubSessionId ? "true" : void 0,
								onClick: () => {
									onOpenAside(record);
								},
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: AsideSidebar_module_css_default.asideText,
									children: asideText(record)
								}), (0, react_jsx_runtime.jsx)("time", {
									className: AsideSidebar_module_css_default.asideTime,
									dateTime: new Date(record.updatedAt).toISOString(),
									title: new Date(record.updatedAt).toLocaleString(),
									children: t("updatedAt", { time: formatAsideTime(record.updatedAt) })
								})]
							}) }, record.subSessionId))
						]
					})]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/evan/Desktop/dsh-aside/packages/client-ui-aside/src/client/AsideAskAction.module.css.mjs
		const css = ".znUWta_action{font:inherit;cursor:pointer;color:inherit;background:0 0;border:none;border-radius:4px;justify-content:center;align-items:center;padding:4px;line-height:1;display:inline-flex}.znUWta_action:hover,.znUWta_action:focus{background:var(--dsw-alias-state-business-weak,#7f7f7f1f);outline:none}.znUWta_action:disabled{opacity:.6;cursor:wait}";
		const tagId = "@ywzhang1031/dsh-client-ui-aside/AsideAskAction.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@ywzhang1031/dsh-client-ui-aside";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var AsideAskAction_module_css_default = { "action": "znUWta_action" };
		//#endregion
		//#region lib/types/client/AsideAskAction.js
		/**
		* The per-message aside entry on the stock `conversation.chat.assistant-actions`
		* strip: one click opens a draft drawer anchored to that assistant message.
		* The action also registers its DOM (turn-tail row + sentinel) with the
		* {@link MessageDomRegistry} so the sidebar can scroll back to this message.
		* The message text is resolved from history; clicking an already-asked
		* message reopens its aside.
		* @module @ywzhang1031/dsh-client-ui-aside/AsideAskAction
		*/
		/** Extract the plain text of a content-block array. */
		function textOf(blocks) {
			return (Array.isArray(blocks) ? blocks : []).filter((block) => typeof block === "object" && block !== null && block.type === "text").map((block) => block.text ?? "").join("\n").trim();
		}
		/**
		* Build a whole-message anchor against rendered text. The closing answer is
		* normally the last occurrence because Think may quote it first.
		*/
		function messageAnchor(messageId, exact, rendered = "") {
			const startOffset = rendered.lastIndexOf(exact);
			if (startOffset === -1) return {
				messageId,
				exact,
				prefix: "",
				suffix: "",
				occurrence: null,
				startOffset: null
			};
			let occurrence = 0;
			let offset = rendered.indexOf(exact);
			while (offset !== -1 && offset <= startOffset) {
				occurrence += 1;
				offset = rendered.indexOf(exact, offset + exact.length);
			}
			return {
				messageId,
				exact,
				prefix: rendered.slice(Math.max(0, startOffset - 60), startOffset),
				suffix: rendered.slice(startOffset + exact.length, startOffset + exact.length + 60),
				occurrence,
				startOffset
			};
		}
		/**
		* One click: resolve the current session, find the message's text in history,
		* then open a draft (or reopen the existing aside for an already-asked span).
		*/
		function AsideAskAction({ messageId, api, sessions, repository, drawer, registry, t }) {
			const [busy, setBusy] = (0, react.useState)(false);
			const alive = (0, react.useRef)(true);
			const buttonRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const sentinel = buttonRef.current;
				if (sentinel === null) return;
				const turnTail = chatAnchorRow(sentinel) ?? sentinel;
				return registry.register(String(messageId), {
					sentinel,
					turnTail
				});
			}, [messageId, registry]);
			(0, react.useEffect)(() => () => {
				alive.current = false;
			}, []);
			const resolve = (0, react.useCallback)(async () => {
				const sessionId = sessions.list.getSnapshot().current;
				if (sessionId === void 0 || sessionId === null || busy) return;
				setBusy(true);
				try {
					const history = await api.sessions.history({
						sessionId,
						maxMessages: 100
					});
					if (!alive.current) return;
					if (!history.result.ok) throw new Error(history.result.error.message);
					let text = "";
					for (const entry of history.result.value.events) {
						const event = entry.event;
						if (event.type !== "assistant/message") continue;
						const data = event.data;
						if (data?.message?.id !== messageId) continue;
						text = textOf(data.message.content);
						break;
					}
					if (text === "") throw new Error("message not found in history");
					const entry = registry.get(String(messageId));
					const row = entry === void 0 ? null : findMessageRowBefore(entry.turnTail, text);
					const anchor = messageAnchor(String(messageId), text, row?.textContent ?? "");
					const existing = repository.find(sessionId, anchor);
					if (existing !== void 0) {
						drawer.openSub(existing);
						return;
					}
					drawer.openDraft({
						parentSessionId: sessionId,
						anchor
					});
				} catch (error) {
					console.error("[aside] ask action failed:", error);
				} finally {
					if (alive.current) setBusy(false);
				}
			}, [
				alive,
				api,
				busy,
				drawer,
				messageId,
				repository,
				sessions
			]);
			const label = t("askMessageLabel");
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label,
				side: "bottom",
				children: (0, react_jsx_runtime.jsx)("button", {
					ref: buttonRef,
					type: "button",
					className: AsideAskAction_module_css_default.action,
					"aria-label": label,
					disabled: busy,
					onClick: () => {
						resolve();
					},
					children: "💬"
				})
			});
		}
		//#endregion
		//#region lib/types/client/visibility.js
		/** Plugin-owned projection that keeps durable aside sessions out of DSH navigation. */
		/**
		* Hide confirmed aside records through DSH's public archive projection.
		* Archiving preserves logs and Workspace accounting; it only removes the
		* child from grouping, flat-list, and search surfaces.
		*/
		var AsideVisibility = class {
			workspaces;
			report;
			hiding = /* @__PURE__ */ new Map();
			constructor(workspaces, report = (message, error) => {
				console.warn(message, error);
			}) {
				this.workspaces = workspaces;
				this.report = report;
			}
			/** Hide one record idempotently; failures stay retryable on the next reconciliation. */
			hide(record) {
				const id = record.subSessionId;
				if (this.workspaces.list.getSnapshot().archivedSessionIds.includes(id)) return Promise.resolve(true);
				const active = this.hiding.get(record.subSessionId);
				if (active !== void 0) return active;
				const pending = this.workspaces.archiveSession(id).then(() => true).catch((error) => {
					this.report(`[aside] failed to hide child session "${record.subSessionId}" from Workspace navigation:`, error);
					return false;
				}).finally(() => {
					if (this.hiding.get(record.subSessionId) === pending) this.hiding.delete(record.subSessionId);
				});
				this.hiding.set(record.subSessionId, pending);
				return pending;
			}
			/** Reconcile Host-confirmed records; never infer aside identity from parentSession alone. */
			reconcile(records) {
				for (const record of records) this.hide(record);
			}
		};
		//#endregion
		//#region lib/types/client/locales.js
		/** Copy dictionaries for the aside drawer, sidebar, and floating action. */
		/** Simplified Chinese dictionary and key source of truth. */
		const zh = {
			title: "旁注",
			readonlyHint: "继承主对话上下文；仅聊天、Shell 分析、文件读取、网页搜索与抓取 — 无法修改任何文件",
			askLabel: "💬 就此提问",
			askMessageLabel: "就此消息提问旁注",
			draftHint: "输入你的问题并发送，才会创建旁注。",
			sourceLabel: "引用原文",
			loading: "正在读取对话…",
			empty: "还没有消息。发送第一条提问开始。",
			placeholder: "追问这个知识点…",
			commandPlaceholder: "输入消息，或 / 查看命令",
			send: "发送",
			sending: "发送中…",
			close: "关闭",
			error: "旁注创建失败：{{message}}",
			userRole: "你",
			assistantRole: "助手",
			sidebarLabel: "旁注侧栏",
			asidesTitle: "旁注聊天",
			asidesEmpty: "选中文字提问后，旁注会出现在这里。",
			asidesLoading: "正在读取旁注…",
			modelLabel: "模型",
			reasoningLabel: "推理",
			readOnlyLabel: "只读",
			generating: "生成中",
			commandHint: "命令",
			unknownCommand: "未知命令：{{command}}",
			commandNotAllowed: "该命令在旁注中不可用：{{command}}",
			commandError: "命令执行失败：{{message}}",
			draftNoCommand: "请先发送问题创建旁注，再使用命令。",
			draftModelCommand: "草稿模型可直接在输入框下方选择。",
			backToBottom: "回到底部",
			openAside: "打开旁注",
			updatedAt: "更新于 {{time}}",
			defaultReasoning: "默认"
		};
		/** English dictionary checked against the Chinese key set. */
		const en = {
			title: "Side conversation",
			readonlyHint: "Forked from the main conversation; chat, shell analysis, file reads, and web search/fetch only — files cannot be modified",
			askLabel: "💬 Ask about this",
			askMessageLabel: "Ask about this message in an aside",
			draftHint: "Type a question and send it — only then is the aside created.",
			sourceLabel: "Quoted text",
			loading: "Reading the conversation…",
			empty: "No messages yet. Send the first question to start.",
			placeholder: "Ask about this topic…",
			commandPlaceholder: "Type a message, or / for commands",
			send: "Send",
			sending: "Sending…",
			close: "Close",
			error: "Failed to create the side conversation: {{message}}",
			userRole: "You",
			assistantRole: "Assistant",
			sidebarLabel: "Aside sidebar",
			asidesTitle: "Aside chats",
			asidesEmpty: "Asides appear here after you ask about selected text.",
			asidesLoading: "Reading asides…",
			modelLabel: "Model",
			reasoningLabel: "Reasoning",
			readOnlyLabel: "Read-only",
			generating: "Generating",
			commandHint: "Commands",
			unknownCommand: "Unknown command: {{command}}",
			commandNotAllowed: "This command is not available in an aside: {{command}}",
			commandError: "Command failed: {{message}}",
			draftNoCommand: "Send a question first to create the aside, then use commands.",
			draftModelCommand: "Choose the draft model directly below the composer.",
			backToBottom: "Back to bottom",
			openAside: "Open aside",
			updatedAt: "Updated {{time}}",
			defaultReasoning: "Default"
		};
		//#endregion
		//#region lib/types/client/index.js
		/**
		* Aside UI plugin, browser half: the frame-wide side-conversation drawer, the
		* standing aside sidebar, the prose-selection watcher with its floating ask
		* button, the per-message aside action on the stock
		* `conversation.chat.assistant-actions` strip, and the exact-text highlight
		* layer. A selection is a DRAFT: nothing durable exists until the first
		* question is actually sent — the durable authority (the aside session, its
		* fork lineage, its read-only posture, and the anchor relationship) lives in
		* the Host. The browser only mirrors the Host's `aside.list`/`aside.create`
		* results; there is no `localStorage`.
		*
		* Stock-only wiring: the plugin self-mounts its generated Typert Remote stub
		* through `ctx.remote.$mount` (the same API `dsh-api-remotes` uses for the
		* shipped remotes), so no host composition change is needed; session
		* attribution comes from the runtime sessions service plus history matching
		* (stock renders the assistant-actions strip in a sibling node of the message
		* text, so the selection cannot be attributed by sentinel containment).
		* @module @ywzhang1031/dsh-client-ui-aside/client
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "aside";
		/** Required services (cordis fiber inject). `remote.aside` is NOT injected: this plugin mounts the stub itself. */
		const inject = [
			"slots",
			"sessions",
			"workspaces",
			"connection",
			"remote",
			"locale",
			"conversation"
		];
		/** Stylesheet for the DOM-created floating ask button and highlight layer. */
		const PLUGIN_CSS = `
.aside-ask-button {
  position: fixed;
  z-index: 70;
  display: none;
  padding: 5px 12px;
  border: 1px solid var(--dsw-alias-state-business-primary, rgba(127, 127, 127, 0.4));
  border-radius: 999px;
  background: var(--dsw-alias-surface-background, #ffffff);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
  font: 12px/1.4 system-ui, -apple-system, sans-serif;
  color: var(--dsw-alias-text-primary, #1a1a1a);
  cursor: pointer;
  white-space: nowrap;
}
.aside-ask-button:hover { background: var(--dsw-alias-state-business-weak, #f2f6ff); }
.aside-ask-button:disabled { opacity: 0.85; cursor: wait; }
::highlight(${HIGHLIGHT_NAME}) {
  background-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 16%, transparent);
}
::highlight(${ACTIVE_HIGHLIGHT_NAME}) {
  background-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 38%, transparent);
  text-decoration: underline 2px var(--dsw-alias-state-business-primary, #1a6bff);
}
.aside-message-anchored {
  box-shadow: inset 2px 0 0 0 var(--dsw-alias-state-business-primary, #1a6bff);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 5%, transparent);
}
.aside-message-flash {
  animation: aside-message-flash 1.6s ease-out;
}
@keyframes aside-message-flash {
  0% { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 24%, transparent); }
  100% { background: transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .aside-message-flash { animation: none; }
}
`;
		/** The rendering session id, from the runtime service (stock DOM carries no attribute). */
		function currentSession(sessions) {
			return sessions.list.getSnapshot().current ?? null;
		}
		const FLASH_CLASS = "aside-message-flash";
		const ANCHORED_CLASS = "aside-message-anchored";
		/** Bound old-history pulls for one click; unchanged history stops earlier. */
		const MAX_LOCATE_PAGES = 20;
		/**
		* Client plugin body: one shared repository, drawer store, message DOM
		* registry, and highlight layer, the self-mounted Remote stub, the
		* per-message aside action, the overlay drawer and sidebar, and the selection
		* watcher. Selections open a draft; the first send turns it into a real aside
		* (create → prompt) through {@link sendFirst}.
		* @param ctx - the browser root context.
		*/
		async function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-aside: dictionaries");
			const { api } = ctx.get("connection");
			const sessions = ctx.sessions;
			const asideDisposer = await ctx.remote.$mount(TYPERT_REMOTE);
			ctx.effect(() => asideDisposer, "ui-aside: remote stub unmount");
			const aside = ctx.get("remote.aside");
			if (aside === void 0) throw new Error("ui-aside: mounted Remote namespace \"aside\" is unavailable");
			const repository = new AsideRepository(aside);
			const drawer = new DrawerStore();
			const visibility = new AsideVisibility(ctx.workspaces);
			const registry = new MessageDomRegistry();
			const highlighter = new AsideHighlighter(document);
			const rafFn = typeof requestAnimationFrame === "function" ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(cb, 16);
			const cancelRaf = typeof cancelAnimationFrame === "function" ? (id) => {
				cancelAnimationFrame(id);
			} : (id) => {
				clearTimeout(id);
			};
			let locateGeneration = 0;
			/** Let the drawer and a newly prepended history page commit before locating. */
			const settleLayout = () => new Promise((resolve) => {
				rafFn(() => {
					rafFn(() => {
						resolve();
					});
				});
			});
			/** The first mounted chat row, used to detect that loadOlder made no progress. */
			const historyHeadKey = () => document.querySelector("[data-conversation-scroll] [data-chat-anchor-key]")?.dataset.chatAnchorKey ?? null;
			/** Briefly emphasize one message row (then let the persistent highlight return). */
			const flashMessage = (el) => {
				el.classList.add(FLASH_CLASS);
				setTimeout(() => {
					el.classList.remove(FLASH_CLASS);
				}, 1600);
			};
			/** Scroll to one exact anchored span, degrading to its parent message. */
			const locateMessage = (record) => {
				if (highlighter.focus(record.subSessionId)) return true;
				const messageId = record.anchor.messageId;
				let turnTail = null;
				if (messageId !== null) {
					const entry = registry.get(messageId);
					if (entry !== void 0) {
						turnTail = entry.turnTail;
						const messageRow = findMessageRowBefore(entry.turnTail, record.anchor.exact);
						const range = messageRow === null ? null : restoreAnchorRange(messageRow, record.anchor);
						if (range !== null) {
							highlighter.add(record.subSessionId, range);
							if (highlighter.focus(record.subSessionId)) return true;
						}
					}
				}
				const row = findRowContaining(document, record.anchor.exact);
				if (row !== null) {
					const range = restoreAnchorRange(row, record.anchor);
					if (range !== null) {
						highlighter.add(record.subSessionId, range);
						if (highlighter.focus(record.subSessionId)) return true;
					}
					row.scrollIntoView({ block: "center" });
					flashMessage(row);
					return true;
				}
				if (turnTail !== null) {
					turnTail.scrollIntoView({ block: "center" });
					flashMessage(turnTail);
					return true;
				}
				return false;
			};
			/** Reopen one existing aside from the sidebar or an anchor click. */
			const openExisting = (record) => {
				const generation = ++locateGeneration;
				drawer.openSub(record);
				(async () => {
					await settleLayout();
					if (generation !== locateGeneration || currentSession(sessions) !== record.parentSessionId) return;
					if (locateMessage(record)) return;
					const conversation = ctx.sessions.scope(record.parentSessionId)?.get("conversation");
					if (conversation === void 0) return;
					let head = historyHeadKey();
					for (let page = 0; page < MAX_LOCATE_PAGES; page += 1) {
						try {
							await conversation.loadOlder();
						} catch {
							return;
						}
						await settleLayout();
						if (generation !== locateGeneration || currentSession(sessions) !== record.parentSessionId) return;
						if (locateMessage(record)) return;
						const nextHead = historyHeadKey();
						if (nextHead === head) return;
						head = nextHead;
					}
				})();
			};
			let selectedSessionId = currentSession(sessions);
			const offSessionChange = sessions.list.subscribe(() => {
				const nextSessionId = currentSession(sessions);
				if (nextSessionId === selectedSessionId) return;
				selectedSessionId = nextSessionId;
				locateGeneration += 1;
				drawer.close();
			});
			ctx.effect(() => offSessionChange, "ui-aside: close drawer on session change");
			/**
			* The draft's first send: create the forked aside (the Host persists the
			* anchor into the child's first message), hide its navigation row, prompt
			* it with the question, and
			* bind the drawer. A failure keeps the draft open with the error surfaced;
			* no local anchor is fabricated. If the drawer was closed/reopened mid-flight
			* the created aside still exists (correctly anchored), but it is never bound
			* to the now-different draft.
			*/
			const sendFirst = async (input, model) => {
				const draft = drawer.get();
				if (draft.subSessionId !== null || !draft.draft || draft.anchor === null || draft.parentSessionId === null) return false;
				const parentSessionId = draft.parentSessionId;
				const anchor = draft.anchor;
				const version = drawer.getVersion();
				try {
					const created = await aside.create({
						parentSessionId,
						anchor
					});
					if (!created.ok) throw new Error(created.error.message);
					const record = created.value.record;
					await visibility.hide(record);
					if (model !== void 0) {
						const selected = await api.sessions.selectModel({
							sessionId: record.subSessionId,
							...model
						});
						if (!selected.result.ok) throw new Error(selected.result.error.message);
					}
					const sent = await api.sessions.prompt({
						sessionId: record.subSessionId,
						mode: "queue",
						content: [{
							type: "text",
							text: input.trim()
						}]
					});
					if (!sent.result.ok) throw new Error(sent.result.error.message);
					repository.add(record);
					drawer.attach(record, version);
					return true;
				} catch (error) {
					console.error("[aside] first send failed:", error);
					if (drawer.getVersion() === version) drawer.setError(error instanceof Error ? error.message : String(error));
					return false;
				}
			};
			const sidebarSessions = {
				subscribe: (listener) => sessions.list.subscribe(listener),
				getCurrent: () => sessions.list.getSnapshot().current ?? null
			};
			ctx.slots.inject("shell.overlay", function* () {
				yield ctx.slots.register({
					name: "shell.overlay",
					id: "aside-sidebar",
					order: 10,
					inject: () => ({
						repository,
						drawer,
						sessions: sidebarSessions,
						onOpenAside: openExisting,
						t
					})
				}, AsideSidebar);
				yield ctx.slots.register({
					name: "shell.overlay",
					id: "aside-drawer",
					order: 20,
					inject: () => ({
						store: drawer,
						api,
						onFirstSend: sendFirst,
						t
					})
				}, AsideDrawer);
			});
			ctx.slots.inject("conversation.chat.assistant-actions", function* () {
				yield ctx.slots.register({
					name: "conversation.chat.assistant-actions",
					id: "aside-ask",
					order: 20,
					inject: () => ({
						api,
						sessions,
						repository,
						drawer,
						registry,
						t
					})
				}, AsideAskAction);
			});
			const style = document.createElement("style");
			style.textContent = PLUGIN_CSS;
			document.head.appendChild(style);
			ctx.effect(() => () => {
				style.remove();
			}, "ui-aside: plugin stylesheet");
			/** Rebuild the exact highlights from the current session's records. */
			const syncHighlights = () => {
				highlighter.clear();
				for (const el of [...document.querySelectorAll(`.${ANCHORED_CLASS}`)]) el.classList.remove(ANCHORED_CLASS);
				for (const record of repository.list()) {
					const entry = record.anchor.messageId === null ? void 0 : registry.get(record.anchor.messageId);
					const row = (entry === void 0 ? null : findMessageRowBefore(entry.turnTail, record.anchor.exact)) ?? findRowContaining(document, record.anchor.exact) ?? entry?.turnTail;
					if (row === null || row === void 0) continue;
					const range = restoreAnchorRange(row, record.anchor);
					if (!(range !== null && highlighter.add(record.subSessionId, range))) row.classList.add(ANCHORED_CLASS);
				}
			};
			let raf = 0;
			const scheduleSync = () => {
				if (raf !== 0) return;
				raf = rafFn(() => {
					raf = 0;
					syncHighlights();
				});
			};
			const reconcileVisibility = () => {
				visibility.reconcile(repository.list());
			};
			const offRepo = repository.subscribe(() => {
				scheduleSync();
				reconcileVisibility();
			});
			const offWorkspaces = ctx.workspaces.list.subscribe(reconcileVisibility);
			const observer = new MutationObserver(scheduleSync);
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
			ctx.effect(() => () => {
				offRepo();
				offWorkspaces();
				observer.disconnect();
				if (raf !== 0) cancelRaf(raf);
			}, "ui-aside: highlight sync");
			const onClick = (event) => {
				const selection = document.getSelection();
				if (selection !== null && !selection.isCollapsed) return;
				const subSessionId = highlighter.hitTest(event.clientX, event.clientY);
				if (subSessionId === null) return;
				const record = repository.findSub(subSessionId);
				if (record === void 0) return;
				event.preventDefault();
				event.stopPropagation();
				openExisting(record);
			};
			document.addEventListener("click", onClick, true);
			ctx.effect(() => () => {
				document.removeEventListener("click", onClick, true);
			}, "ui-aside: highlight click");
			/** A selection opens a draft drawer; nothing is created until asked. */
			const ask = async (selection) => {
				let messageId = null;
				try {
					const history = await api.sessions.history({
						sessionId: selection.sessionId,
						maxMessages: 100
					});
					if (history.result.ok) messageId = resolveMessageId(history.result.value.events, selection.anchor.exact);
				} catch {}
				const anchor = {
					...selection.anchor,
					messageId
				};
				const existing = repository.find(selection.sessionId, anchor);
				if (existing !== void 0) {
					openExisting(existing);
					return;
				}
				drawer.openDraft({
					parentSessionId: selection.sessionId,
					anchor
				});
			};
			const watcher = new SelectionWatcher(document, ask, t("askLabel"), () => currentSession(sessions));
			ctx.effect(() => watcher.start(), "ui-aside: selection watcher");
			scheduleSync();
		}
		//#endregion
		exports.ACTIVE_HIGHLIGHT_NAME = ACTIVE_HIGHLIGHT_NAME;
		exports.ASIDE_COMMANDS = ASIDE_COMMANDS;
		exports.AsideAskAction = AsideAskAction;
		exports.AsideDrawer = AsideDrawer;
		exports.AsideHighlighter = AsideHighlighter;
		exports.AsideRepository = AsideRepository;
		exports.AsideSidebar = AsideSidebar;
		exports.AsideVisibility = AsideVisibility;
		exports.DrawerStore = DrawerStore;
		exports.HIGHLIGHT_NAME = HIGHLIGHT_NAME;
		exports.MAX_SELECTION_CHARS = MAX_SELECTION_CHARS;
		exports.MIN_SELECTION_CHARS = MIN_SELECTION_CHARS;
		exports.MessageDomRegistry = MessageDomRegistry;
		exports.NS = NS;
		exports.SelectionWatcher = SelectionWatcher;
		exports.apply = apply;
		exports.asideText = asideText;
		exports.buildQuote = buildQuote;
		exports.chatAnchorRow = chatAnchorRow;
		exports.findMessageRowBefore = findMessageRowBefore;
		exports.findRowContaining = findRowContaining;
		exports.inject = inject;
		exports.normalizeText = normalizeText;
		exports.projectHistory = projectHistory;
		exports.resolveMessageId = resolveMessageId;
		exports.resolveSelection = resolveSelection;
		exports.restoreAnchorRange = restoreAnchorRange;
		exports.restoreRange = restoreRange;
		exports.supportsCustomHighlight = supportsCustomHighlight;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map