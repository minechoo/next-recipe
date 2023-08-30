import { Text } from '@/components/atoms/text/Text';
import styles from './Breadcrumbs.module.scss';
import clsx from 'clsx';
import React from 'react';

function Breadcrumbs({ data }) {
	return (
		<nav className={clsx(styles.breadcrumbs)}>
			{data.map((name, idx) => {
				const result = name.includes('-')
					? name
							.split('-')
							.map((txt) => txt.charAt(0).toUpperCase() + txt.slice(1))
							.join(' ')
					: name;
				//현재 반복되는 메뉴 순번이 마지막이 아닐떄
				//뒤에 슬러시 붙이고 링크 추가
				if (idx !== data.length - 1) {
					return (
						<React.Fragment key={idx}>
							<Text tag={'em'} url={`/${name}`}>
								{!name ? 'Home' : result}
							</Text>
							<span> / </span>
						</React.Fragment>
					);
					//마지막 순번이면 글자만 생성
					//마지막데이터에서 쿼리스트링값이 있으면(=이 있으면) 뒤에 레시피 아이디가 아닌 레시피명을 출력
					//빈칸처리되는 정규표현식을 빈칸으로 대체(%20 -> ' ')해서 문자열 출력
				} else {
					return (
						<Text key={idx} tag={'strong'}>
							{result.includes('=') ? result.split('=')[1].replaceAll('%20', ' ') : result}
						</Text>
					);
				}
			})}
		</nav>
	);
}

export default Breadcrumbs;
