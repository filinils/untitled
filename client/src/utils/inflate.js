/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */ export default (function() {
	"use strict";
	var m = window;
	function q(c, d) {
		var a = c.split("."),
			b = m;
		!(a[0] in b) && b.execScript && b.execScript("var " + a[0]);
		for (var e; a.length && (e = a.shift()); )
			!a.length && void 0 !== d
				? (b[e] = d)
				: (b = b[e] ? b[e] : (b[e] = {}));
	}
	var s =
		"undefined" !== typeof Uint8Array &&
		"undefined" !== typeof Uint16Array &&
		"undefined" !== typeof Uint32Array &&
		"undefined" !== typeof DataView;
	function t(c) {
		var d = c.length,
			a = 0,
			b = Number.POSITIVE_INFINITY,
			e,
			f,
			g,
			h,
			k,
			l,
			p,
			n,
			r,
			K;
		for (n = 0; n < d; ++n) c[n] > a && (a = c[n]), c[n] < b && (b = c[n]);
		e = 1 << a;
		f = new (s ? Uint32Array : Array)(e);
		g = 1;
		h = 0;
		for (k = 2; g <= a; ) {
			for (n = 0; n < d; ++n)
				if (c[n] === g) {
					l = 0;
					p = h;
					for (r = 0; r < g; ++r) (l = (l << 1) | (p & 1)), (p >>= 1);
					K = (g << 16) | n;
					for (r = l; r < e; r += k) f[r] = K;
					++h;
				}
			++g;
			h <<= 1;
			k <<= 1;
		}
		return [f, a, b];
	}
	function u(c, d) {
		this.g = [];
		this.h = 32768;
		this.d = this.f = this.a = this.l = 0;
		this.input = s ? new Uint8Array(c) : c;
		this.m = !1;
		this.i = v;
		this.s = !1;
		if (d || !(d = {}))
			d.index && (this.a = d.index),
				d.bufferSize && (this.h = d.bufferSize),
				d.bufferType && (this.i = d.bufferType),
				d.resize && (this.s = d.resize);
		switch (this.i) {
			case w:
				this.b = 32768;
				this.c = new (s ? Uint8Array : Array)(32768 + this.h + 258);
				break;
			case v:
				this.b = 0;
				this.c = new (s ? Uint8Array : Array)(this.h);
				this.e = this.A;
				this.n = this.w;
				this.j = this.z;
				break;
			default:
				throw Error("invalid inflate mode");
		}
	}
	var w = 0,
		v = 1,
		x = { u: w, t: v };
	u.prototype.k = function() {
		for (; !this.m; ) {
			var c = y(this, 3);
			c & 1 && (this.m = !0);
			c >>>= 1;
			switch (c) {
				case 0:
					var d = this.input,
						a = this.a,
						b = this.c,
						e = this.b,
						f = d.length,
						g = void 0,
						h = void 0,
						k = b.length,
						l = void 0;
					this.d = this.f = 0;
					if (a + 1 >= f)
						throw Error("invalid uncompressed block header: LEN");
					g = d[a++] | (d[a++] << 8);
					if (a + 1 >= f)
						throw Error("invalid uncompressed block header: NLEN");
					h = d[a++] | (d[a++] << 8);
					if (g === ~h)
						throw Error(
							"invalid uncompressed block header: length verify"
						);
					if (a + g > d.length) throw Error("input buffer is broken");
					switch (this.i) {
						case w:
							for (; e + g > b.length; ) {
								l = k - e;
								g -= l;
								if (s)
									b.set(d.subarray(a, a + l), e),
										(e += l),
										(a += l);
								else for (; l--; ) b[e++] = d[a++];
								this.b = e;
								b = this.e();
								e = this.b;
							}
							break;
						case v:
							for (; e + g > b.length; ) b = this.e({ p: 2 });
							break;
						default:
							throw Error("invalid inflate mode");
					}
					if (s) b.set(d.subarray(a, a + g), e), (e += g), (a += g);
					else for (; g--; ) b[e++] = d[a++];
					this.a = a;
					this.b = e;
					this.c = b;
					break;
				case 1:
					this.j(z, A);
					break;
				case 2:
					B(this);
					break;
				default:
					throw Error("unknown BTYPE: " + c);
			}
		}
		return this.n();
	};
	var C = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
		D = s ? new Uint16Array(C) : C,
		E = [
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			13,
			15,
			17,
			19,
			23,
			27,
			31,
			35,
			43,
			51,
			59,
			67,
			83,
			99,
			115,
			131,
			163,
			195,
			227,
			258,
			258,
			258
		],
		F = s ? new Uint16Array(E) : E,
		G = [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			2,
			2,
			2,
			2,
			3,
			3,
			3,
			3,
			4,
			4,
			4,
			4,
			5,
			5,
			5,
			5,
			0,
			0,
			0
		],
		H = s ? new Uint8Array(G) : G,
		I = [
			1,
			2,
			3,
			4,
			5,
			7,
			9,
			13,
			17,
			25,
			33,
			49,
			65,
			97,
			129,
			193,
			257,
			385,
			513,
			769,
			1025,
			1537,
			2049,
			3073,
			4097,
			6145,
			8193,
			12289,
			16385,
			24577
		],
		J = s ? new Uint16Array(I) : I,
		L = [
			0,
			0,
			0,
			0,
			1,
			1,
			2,
			2,
			3,
			3,
			4,
			4,
			5,
			5,
			6,
			6,
			7,
			7,
			8,
			8,
			9,
			9,
			10,
			10,
			11,
			11,
			12,
			12,
			13,
			13
		],
		M = s ? new Uint8Array(L) : L,
		N = new (s ? Uint8Array : Array)(288),
		O,
		P;
	O = 0;
	for (P = N.length; O < P; ++O)
		N[O] = 143 >= O ? 8 : 255 >= O ? 9 : 279 >= O ? 7 : 8;
	var z = t(N),
		Q = new (s ? Uint8Array : Array)(30),
		R,
		S;
	R = 0;
	for (S = Q.length; R < S; ++R) Q[R] = 5;
	var A = t(Q);
	function y(c, d) {
		for (
			var a = c.f, b = c.d, e = c.input, f = c.a, g = e.length, h;
			b < d;

		) {
			if (f >= g) throw Error("input buffer is broken");
			a |= e[f++] << b;
			b += 8;
		}
		h = a & ((1 << d) - 1);
		c.f = a >>> d;
		c.d = b - d;
		c.a = f;
		return h;
	}
	function T(c, d) {
		for (
			var a = c.f,
				b = c.d,
				e = c.input,
				f = c.a,
				g = e.length,
				h = d[0],
				k = d[1],
				l,
				p;
			b < k && !(f >= g);

		)
			(a |= e[f++] << b), (b += 8);
		l = h[a & ((1 << k) - 1)];
		p = l >>> 16;
		c.f = a >> p;
		c.d = b - p;
		c.a = f;
		return l & 65535;
	}
	function B(c) {
		function d(a, c, b) {
			var d,
				e = this.q,
				f,
				g;
			for (g = 0; g < a; )
				switch (((d = T(this, c)), d)) {
					case 16:
						for (f = 3 + y(this, 2); f--; ) b[g++] = e;
						break;
					case 17:
						for (f = 3 + y(this, 3); f--; ) b[g++] = 0;
						e = 0;
						break;
					case 18:
						for (f = 11 + y(this, 7); f--; ) b[g++] = 0;
						e = 0;
						break;
					default:
						e = b[g++] = d;
				}
			this.q = e;
			return b;
		}
		var a = y(c, 5) + 257,
			b = y(c, 5) + 1,
			e = y(c, 4) + 4,
			f = new (s ? Uint8Array : Array)(D.length),
			g,
			h,
			k,
			l;
		for (l = 0; l < e; ++l) f[D[l]] = y(c, 3);
		if (!s) {
			l = e;
			for (e = f.length; l < e; ++l) f[D[l]] = 0;
		}
		g = t(f);
		h = new (s ? Uint8Array : Array)(a);
		k = new (s ? Uint8Array : Array)(b);
		c.q = 0;
		c.j(t(d.call(c, a, g, h)), t(d.call(c, b, g, k)));
	}
	u.prototype.j = function(c, d) {
		var a = this.c,
			b = this.b;
		this.o = c;
		for (var e = a.length - 258, f, g, h, k; 256 !== (f = T(this, c)); )
			if (256 > f)
				b >= e && ((this.b = b), (a = this.e()), (b = this.b)),
					(a[b++] = f);
			else {
				g = f - 257;
				k = F[g];
				0 < H[g] && (k += y(this, H[g]));
				f = T(this, d);
				h = J[f];
				0 < M[f] && (h += y(this, M[f]));
				b >= e && ((this.b = b), (a = this.e()), (b = this.b));
				for (; k--; ) a[b] = a[b++ - h];
			}
		for (; 8 <= this.d; ) (this.d -= 8), this.a--;
		this.b = b;
	};
	u.prototype.z = function(c, d) {
		var a = this.c,
			b = this.b;
		this.o = c;
		for (var e = a.length, f, g, h, k; 256 !== (f = T(this, c)); )
			if (256 > f)
				b >= e && ((a = this.e()), (e = a.length)), (a[b++] = f);
			else {
				g = f - 257;
				k = F[g];
				0 < H[g] && (k += y(this, H[g]));
				f = T(this, d);
				h = J[f];
				0 < M[f] && (h += y(this, M[f]));
				b + k > e && ((a = this.e()), (e = a.length));
				for (; k--; ) a[b] = a[b++ - h];
			}
		for (; 8 <= this.d; ) (this.d -= 8), this.a--;
		this.b = b;
	};
	u.prototype.e = function() {
		var c = new (s ? Uint8Array : Array)(this.b - 32768),
			d = this.b - 32768,
			a,
			b,
			e = this.c;
		if (s) c.set(e.subarray(32768, c.length));
		else {
			a = 0;
			for (b = c.length; a < b; ++a) c[a] = e[a + 32768];
		}
		this.g.push(c);
		this.l += c.length;
		if (s) e.set(e.subarray(d, d + 32768));
		else for (a = 0; 32768 > a; ++a) e[a] = e[d + a];
		this.b = 32768;
		return e;
	};
	u.prototype.A = function(c) {
		var d,
			a = (this.input.length / this.a + 1) | 0,
			b,
			e,
			f,
			g = this.input,
			h = this.c;
		c &&
			("number" === typeof c.p && (a = c.p),
			"number" === typeof c.v && (a += c.v));
		2 > a
			? ((b = (g.length - this.a) / this.o[2]),
				(f = (258 * (b / 2)) | 0),
				(e = f < h.length ? h.length + f : h.length << 1))
			: (e = h.length * a);
		s ? ((d = new Uint8Array(e)), d.set(h)) : (d = h);
		return (this.c = d);
	};
	u.prototype.n = function() {
		var c = 0,
			d = this.c,
			a = this.g,
			b,
			e = new (s ? Uint8Array : Array)(this.l + (this.b - 32768)),
			f,
			g,
			h,
			k;
		if (0 === a.length)
			return s
				? this.c.subarray(32768, this.b)
				: this.c.slice(32768, this.b);
		f = 0;
		for (g = a.length; f < g; ++f) {
			b = a[f];
			h = 0;
			for (k = b.length; h < k; ++h) e[c++] = b[h];
		}
		f = 32768;
		for (g = this.b; f < g; ++f) e[c++] = d[f];
		this.g = [];
		return (this.buffer = e);
	};
	u.prototype.w = function() {
		var c,
			d = this.b;
		s
			? this.s
				? ((c = new Uint8Array(d)), c.set(this.c.subarray(0, d)))
				: (c = this.c.subarray(0, d))
			: (this.c.length > d && (this.c.length = d), (c = this.c));
		return (this.buffer = c);
	};
	function U(c, d) {
		var a, b;
		this.input = c;
		this.a = 0;
		if (d || !(d = {}))
			d.index && (this.a = d.index), d.verify && (this.B = d.verify);
		a = c[this.a++];
		b = c[this.a++];
		switch (a & 15) {
			case V:
				this.method = V;
				break;
			default:
				throw Error("unsupported compression method");
		}
		if (0 !== ((a << 8) + b) % 31)
			throw Error("invalid fcheck flag:" + ((a << 8) + b) % 31);
		if (b & 32) throw Error("fdict flag is not supported");
		this.r = new u(c, {
			index: this.a,
			bufferSize: d.bufferSize,
			bufferType: d.bufferType,
			resize: d.resize
		});
	}
	U.prototype.k = function() {
		var c = this.input,
			d,
			a;
		d = this.r.k();
		this.a = this.r.a;
		if (this.B) {
			a =
				((c[this.a++] << 24) |
					(c[this.a++] << 16) |
					(c[this.a++] << 8) |
					c[this.a++]) >>>
				0;
			var b = d;
			if ("string" === typeof b) {
				var e = b.split(""),
					f,
					g;
				f = 0;
				for (g = e.length; f < g; f++)
					e[f] = (e[f].charCodeAt(0) & 255) >>> 0;
				b = e;
			}
			for (var h = 1, k = 0, l = b.length, p, n = 0; 0 < l; ) {
				p = 1024 < l ? 1024 : l;
				l -= p;
				do (h += b[n++]), (k += h);
				while (--p);
				h %= 65521;
				k %= 65521;
			}
			if (a !== ((k << 16) | h) >>> 0)
				throw Error("invalid adler-32 checksum");
		}
		return d;
	};
	var V = 8;
	q("Zlib.Inflate", U);
	q("Zlib.Inflate.prototype.decompress", U.prototype.k);
	var W = { ADAPTIVE: x.t, BLOCK: x.u },
		X,
		Y,
		Z,
		$;
	if (Object.keys) X = Object.keys(W);
	else for (Y in ((X = []), (Z = 0), W)) X[Z++] = Y;
	Z = 0;
	for ($ = X.length; Z < $; ++Z)
		(Y = X[Z]), q("Zlib.Inflate.BufferType." + Y, W[Y]);
})();
