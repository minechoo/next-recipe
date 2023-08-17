import Head from 'next/head';
import styles from './Home.module.scss';
import clsx from 'clsx';
import axios from 'axios';
import { Visual } from '@/components/pic/Visual';

//https://www.themealdb.com
export default function Home({ meals }) {
	//idMeal
	//strMeal
	//strMealThumb
	console.log(meals);
	return (
		<>
			<Head>
				<title>Next Recipe</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={clsx(styles.main)}>
				<div className={clsx(styles.box)}>
					{/* 부모요소에서 직접 아톰컴포넌트에 클래스명을 지정해서 style을 overwrite하고 싶을떄는 클래스를 등록한후 props전달 */}
					<Visual
						imgSrc={meals[0].strMealThumb}
						className={styles.customPic}
					>
						<span>Hello</span>
					</Visual>
				</div>
			</main>
		</>
	);
}

export async function getStaticProps() {
	//props로 데이터 넘길때에는 data안쪽의 값까지 뽑아낸다음에 전달
	const { data } = await axios.get('/filter.php?c=Seafood');
	console.log('data fetching on Server', data);

	return {
		props: data,
		revalidate: 60 * 60 * 24,
	};
}
