import React from 'react';
import Link from 'next/link';
import styles from './Text.module.scss'; //css모듈
import clsx from 'clsx';
import { Nanum_Myeongjo, Orbitron } from 'next/font/google';
import { useRouter } from 'next/router';

const nanum = Nanum_Myeongjo({
	subsets: ['latin'],
	weight: ['400', '700'],
	preload: true,
	variable: '--font-nanum',
});
const orbitron = Orbitron({
	subsets: ['latin'],
	weight: ['400', '700'],
	preload: true,
	variable: '--font-orbitron',
});

function Text({ children, url, style, className, type, tag = 'p', isOn = false }) {
	const router = useRouter();
	const currentPath = router.pathname;

	return React.createElement(
		tag,
		{
			className: clsx(
				currentPath === url ? styles.on : '',
				styles.txt,
				className,
				nanum.variable,
				orbitron.variable,
				styles[`txt_${type}`],
				isOn && styles.on
			),
			style: url ? style : { ...style, transitionDuration: '0.5s' },
			onMouseEnter: (e) => (e.target.style.color = style?.hoverColor),
			onMouseLeave: (e) => (e.target.style.color = style?.color),
		},
		url ? React.createElement(Link, { href: url, style: { transitionDuration: '0.5s' } }, children) : children
	);
}

export default Text; //컴포넌트명
