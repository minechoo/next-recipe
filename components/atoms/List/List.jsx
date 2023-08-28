import clsx from 'clsx';
import styles from './List.module.scss';
import React from 'react';

//React.createElement(요소명, {className, style, href}, React.createElement():map으로 반복처리 가능)

function List({ data, tag = 'ul', style, className }) {
	return React.createElement(
		tag,
		{ className: clsx(styles.list, className), style: style },
		data.map((el, idx) => React.createElement('li', { key: idx }, tag === 'ol' ? `${idx + 1} : ${el}` : el))
	);
}

export default List;
