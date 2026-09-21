export const reveal = {
	initial: { opacity: 0, y: 36 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};
