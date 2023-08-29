import { Pic } from '@/components/atoms/pic/Pic';
import { Title } from '@/components/atoms/text/Title';
import { useRecipeById } from '@/hooks/useRecipe';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { BounceLoader } from 'react-spinners';
import { Table } from '@/components/atoms/Table/Table';
import { useState, useEffect } from 'react';
import List from '@/components/atoms/List/List';
import Btn from '@/components/atoms/Button/Btn';
import { color } from 'framer-motion';
import styles from './detail.module.scss';

function Detail() {
	// const arr = ['red', 'green', 'blue']; //이 배열은 실상 객체
	// console.log(arr?.[0]); //arr객체에 0번째 변수에 참조값을 가져옴
	//정규표현식에서 해단조건이 포함이 아닌 딱 그 조건에 부합될때만 처리 ^조건$
	//표현식 뒤에 + 는 해당조건의 값이 반복되는 경우에도 true로 인지
	// const result = /^\d+[.][' ']$/.test('23. ');
	// console.log(result);
	const router = useRouter();
	const { id } = router.query;
	const { data } = useRecipeById(id);
	const [TableData, setTableData] = useState([]);
	const [ListData, setListData] = useState([]);
	const [Saved, setSaved] = useState(false);

	//버튼을 클릭할때마다 해당 recipe를 저장, 삭제해주는 토글함수
	const handleSave = () => {
		const savedRecipe = JSON.parse(localStorage.getItem('savedRecipe'));

		if (!Saved) {
			savedRecipe.push(data.idMeal);
			localStorage.setItem('savedRecipe', JSON.stringify(savedRecipe));
			setSaved(true);
		} else {
			//배열.splice('자를요소의 순번', '갯수')
			//해당페이지의 레시피 아이디값의 배열의 순번을 구한다음 해당 순번의 배열값 하나만 제거
			savedRecipe.splice(savedRecipe.indexOf(data.idMeal), 1);
			localStorage.setItem('savedRecipe', JSON.stringify(savedRecipe));
			setSaved(false);
		}
	};

	//라우터로 들어오는 id값이 변경될때마다 실행되는 useEffect
	useEffect(() => {
		//로컬저장소에 저장된 recipeId값이 있으면
		if (localStorage.getItem('savedRecipe')) {
			//해당데이터를 배열로 파싱해서 가져옴
			const savedRecipe = JSON.parse(localStorage.getItem('savedRecipe'));
			//가져온 배열값에서 router들어온 id값이 있는지 확인
			if (savedRecipe.includes(id)) {
				setSaved(true);
				//로털저장소에 값은 있지만 현재 라우터로 받은 레시피 정보값은 없는 경우
			} else {
				setSaved(false);
			}
			//아예 로컬저장소 자체가 없으면 그냥 빈배열값으로 저장소 생성
		} else {
			localStorage.setItem('savedRecipe', JSON.stringify([]));
		}
	}, [id]);
	//무한루프에 빠지지 않게 하기위해서 해당 해당 컴포넌트에서 data가 받아졌을떄 한번한 호출해서 State에 옮겨담기
	useEffect(() => {
		if (data) {
			const keys = Object.keys(data);
			//레시피 정보 객체에서 strIngredient문자로 시작하는 키값만 배열로 뽑음
			const filterKeys1 = keys.filter((key) => key.startsWith('strIngredient'));
			//위에서 뽑은 키값에서 value값이 빈문자거나 null인 것은 제외
			const filterKeys2 = filterKeys1.filter((key) => data[key] !== '' && data[key] !== null);
			//위에서 뽑은 키값으로 재료순서, 재료명, 재료량을 객체로 변환해서 다시 배열로 반환
			const ingredients = filterKeys2.map((key, idx) => ({
				index: idx + 1,
				ingredient: data[key],
				measuer: data[`strMeasure${idx + 1}`],
			}));
			setTableData(ingredients);

			let instructions = data.strInstructions
				//\r\n이 강제 줄바꿈하는 정규표현식이므로 해당 정규표현식을 구분점으로 문장을 나누는게 효율적
				.split('\r\n')
				//분리된 문장중에서 .\t라는 탭띄우기 정규표현식을 제거하기위해서 일단은 공통화할 수 있는 숫자를 제외한 특수기호만 +로 치환
				//이후 치환된 +기준으로 뒤에값만 map으로 리턴
				//특정 레시피에는 .\t가 없는 문장도 있기 때문에 해당 구분점이 없을떄는 기존 text를 리턴 그렇지 않으면 치환해서 리턴
				.map((text) => (text.includes('.\t') ? text.replace('.\t', '+').split('+')[1] : text))
				//원본 문자열에 줄바꿈 정규표현식이 여러번 들어가 있는 문장의 경우는 빈문장을 배열로 반환하기 때문에 해당 해당 배열값을 제거
				.filter((text) => text !== '');
			setListData(instructions);
			//console.log(instructions);
		}
	}, [data]);

	return (
		<section className={clsx(styles.detail)}>
			<BounceLoader
				//기본적으로 next는 라우터명이 변경될때마다 언마운트되는 페이지의 컴포넌트의 csr방식ㅇ으로 가져온 데이터와 스타일 노드를 제거
				//page transition이 적용되어 있기 때문에 상세페이지에서 다른 페이지로 넘어갈때 데이터는 이미 사라졌음에도 불구하고 데이터를 활용하는 컴포넌트가 계속 있으면 prop오류 발생
				//해결방법 : csr방식으로 가져오는 데이터 자체를 컴포넌트 랜더링의 조건설정
				//데이터 없으면 로딩바 출력, 데이터가 있으면 그 데이터를 활용하는 컴포넌트 출력
				loading={!data}
				cssOverride={{ position: 'absolute', top: 300, left: '50%', transform: 'translateX(-50%)' }}
				color={'orange'}
				size={100}
			/>
			{data && (
				//다이나믹 라우터에서 스타일이 날라가는것이 아닌 csr방식에서 컴포넌트 언마운트시 데이터가 사라져서
				//컨텐츠가 출력이 안되던 문제
				//해결방법 data가 없을때는 로딩바를 대신 출력
				//isSuccess는 처음 fetching이후 계속 true값이므로 활용불가
				<>
					<Title type={'slogan'}>{data.strMeal}</Title>

					<div className={clsx(styles.picFrame)}>
						<Pic imgSrc={data.strMealThumb} />
					</div>
					{/* 버튼 클릭시 Saved값이 true일떄만 모듈sass로 del 클래스명을 붙이고 해당 고유 클래스명은 atom컴포넌트로 상속됨 : 결과적으로 해당 클래스명의 스타일이 atom컴포넌트의 기본 style을 덮어쓰기 */}
					<Btn onClick={handleSave} className={clsx(Saved && styles.del)}>
						{!Saved ? 'Add to My Favorait' : 'Remove to My Favorait'}
					</Btn>
					<Table data={TableData} title={data.strMeal} />
					<List data={ListData} url={Array(14).fill('a')} tag={'ol'} />
				</>
			)}
		</section>
	);
}

export default Detail;
