/**
 * Converts a given number  n > 0 into base 2 (binary), 8 (octal) , 16 (hexadecimal)
 * @param n given number in base 10
 * @param b base to convert to 2,8 or 16
 */
export const toBase = (n: number, b: number): String => {
	switch (b) {
		case 2:
			return (n >>> 0).toString(2);
		case 16:
			return (n >>> 0).toString(16);
		default:
			return n.toString(10);
	}
};
