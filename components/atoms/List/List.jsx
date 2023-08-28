import clsx from 'clsx';
import styles from './List.module.scss';
import React from 'react';
import Link from 'next/link';

//React.createElement(요소명, {className, style, href}, React.createElement():map으로 반복처리 가능)

function List({ data, tag = 'ul', style, className, url }) {
	return React.createElement(
		//ul, ol
		tag,
		{ className: clsx(styles.list, className), style: style },
		//li 반복 출력
		data.map((el, idx) => {
			const child = tag === 'ol' ? `${idx + 1} : ${el}` : el;
			return React.createElement(
				'li', //요소명
				{ key: idx }, //props
				//li의 자식 요소 (url있으면 Link컴포넌트 추가, 없으면 그냥 글자만)
				url ? React.createElement(Link, { href: `${url[idx]}` }, child) : child
			);
		})
	);
}
//tag === 'ol' ? `${idx + 1} : ${el}` : el)
export default List;
