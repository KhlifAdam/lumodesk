import { CURRENCY, type PaymentStatus } from "./options";

/** TND has three decimals (millimes); rounding keeps float noise out. */
const round = (value: number) => Math.round(value * 1000) / 1000;

/** What is still owed; null while no price is set. */
export function amountRemaining(price: number | null, advance: number | null) {
	return price === null ? null : Math.max(0, round(price - (advance ?? 0)));
}

/** The status the amounts imply; null while no price is set. */
export function suggestPaymentStatus(
	price: number | null,
	advance: number | null,
): PaymentStatus | null {
	if (price === null || price <= 0) return null;
	const paid = advance ?? 0;
	if (paid >= price) return "PAID";
	return paid > 0 ? "PARTIAL" : "UNPAID";
}

export function formatMoney(value: number, locale: string) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: CURRENCY,
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	}).format(value);
}
