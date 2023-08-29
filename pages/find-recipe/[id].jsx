import { Pic } from '@/components/atoms/pic/Pic';
import { Title } from '@/components/atoms/text/Title';
import { useRecipeById } from '@/hooks/useRecipe';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { BounceLoader } from 'react-spinners';
import { Table } from '@/components/atoms/Table/Table';
import { useState, useEffect } from 'react';
import List from '@/components/atoms/List/List';

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
		<section className='detail'>
			<BounceLoader
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

					<div className='picFrame'>
						<Pic imgSrc={data.strMealThumb} />
					</div>
					<Table data={TableData} title={data.strMeal} />
					<List data={ListData} url={Array(14).fill('a')} tag={'ol'} />
				</>
			)}
		</section>
	);
}

export default Detail;
