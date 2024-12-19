// === DOMContentLoaded 이벤트: 페이지가 로드된 후 실행되는 주요 로직 ===
document.addEventListener('DOMContentLoaded', () => {
    // === [1] 재산 유형 필드 처리 ===
    const assetType = document.getElementById('assetType');
    const fields = {
        realEstate: document.getElementById('realEstateField'),
        vehicle: document.getElementById('vehicleField'),
        other: document.getElementById('otherField'),
    };

    // 재산 유형 변경 이벤트: 선택된 유형에 따라 필드를 동적으로 표시
    assetType.addEventListener('change', () => {
        Object.values(fields).forEach(field => field.style.display = 'none');
        const selectedField = fields[assetType.value];
        if (selectedField) selectedField.style.display = 'block';
    });

    // 초기값 설정: 기본으로 "부동산" 필드 표시
    assetType.dispatchEvent(new Event('change'));

  // === [2] 매매 모달 관련 코드 ===
const saleButton = document.getElementById('saleButton');   // 매매취득 버튼
const saleModal = document.getElementById('saleModal');     // 매매취득 모달
const confirmSaleType = document.getElementById('confirmSaleType'); // 확인 버튼
const closeSaleModal = document.getElementById('closeSaleModal');   // 닫기 버튼

// 매매취득 버튼 클릭 시 모달 표시
saleButton.addEventListener('click', () => {
    saleModal.style.display = 'flex';
});

// 대분류 선택 이벤트
const saleCategory = document.getElementById('saleCategory');
const singleOrMultiOptions = document.getElementById('singleOrMultiOptions');
const vehicleOptions = document.getElementById('vehicleOptions'); // 차량 옵션 추가
const otherOptions = document.getElementById('otherOptions');

saleCategory.addEventListener('change', () => {
    singleOrMultiOptions.style.display = 'none';
    vehicleOptions.style.display = 'none';
    otherOptions.style.display = 'none';

    if (saleCategory.value === 'singleHousehold' || saleCategory.value === 'multiHousehold') {
        singleOrMultiOptions.style.display = 'block';
    } else if (saleCategory.value === 'vehicle') {
        vehicleOptions.style.display = 'block';
    } else if (saleCategory.value === 'other') {
        otherOptions.style.display = 'block';
    }
});

// 확인 버튼 클릭 이벤트
confirmSaleType.addEventListener('click', () => {
    const saleAmount = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, ''), 10);

    if (isNaN(saleAmount) || saleAmount <= 0) {
        alert('유효한 금액을 입력하세요.');
        return;
    }

    const selectedCategory = saleCategory.value;
    let taxRate = 0;

    // 대분류 및 추가 조건에 따른 세율 계산
    if (selectedCategory === 'singleHousehold') {
        const isAdjustedArea = document.getElementById('isAdjustedArea').value === 'yes';
        taxRate = isAdjustedArea ? 0.015 : 0.01; // 조정대상 지역 여부에 따른 세율 설정
    } else if (selectedCategory === 'multiHousehold') {
        const isAdjustedArea = document.getElementById('isAdjustedArea').value === 'yes';
        taxRate = isAdjustedArea ? 0.08 : 0.04; // 다주택 조정대상 여부에 따른 세율 설정
    } else if (selectedCategory === 'commercial') {
        taxRate = 0.04; // 상가: 고정 세율
    } else if (selectedCategory === 'vehicle') {
        const isBusinessVehicle = document.getElementById('isBusinessVehicle').value === 'yes';
        taxRate = isBusinessVehicle ? 0.07 : 0.05; // 사업용 차량 여부에 따라 세율 변경
    } else if (selectedCategory === 'other') {
        taxRate = 0.03; // 기타 자산: 고정 세율
    }

    const acquisitionTax = Math.floor(saleAmount * taxRate); // 취득세 계산
    let ruralTax = 0;

    // 사업용 차량인 경우 농어촌특별세 추가
    if (selectedCategory === 'vehicle' && document.getElementById('isBusinessVehicle').value === 'yes') {
        ruralTax = Math.floor(saleAmount * 0.02); // 농특세: 2%
    }

    // 결과 출력
    updateResult('매매 취득 계산 결과', `
        <p>대분류: ${selectedCategory}</p>
        <p>취득 금액: ${saleAmount.toLocaleString()} 원</p>
        <p>취득세: ${acquisitionTax.toLocaleString()} 원</p>
        ${ruralTax > 0 ? `<p>농어촌특별세: ${ruralTax.toLocaleString()} 원</p>` : ''}
        <p>세율: ${(taxRate * 100).toFixed(1)}%</p>
    `);

    saleModal.style.display = 'none';
});

// 닫기 버튼 클릭 이벤트
closeSaleModal.addEventListener('click', () => {
    saleModal.style.display = 'none';
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === saleModal) {
        saleModal.style.display = 'none';
    }
});

// 공통 결과 업데이트 함수
function updateResult(title, details) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>${title}</h3>${details}`;
}

    // 증여 모달 관련 코드
const giftButton = document.getElementById('giftButton'); // 증여취득 버튼
const giftModal = document.getElementById('giftModal');   // 증여 모달
const confirmGiftType = document.getElementById('confirmGiftType'); // 확인 버튼
const closeGiftModal = document.getElementById('closeGiftModal');   // 닫기 버튼
 
    // 증여취득 버튼 클릭 시 모달 표시
    giftButton.addEventListener('click', () => {
        giftModal.style.display = 'flex';
    });

    // 증여 모달 확인 버튼 클릭 이벤트
    confirmGiftType.addEventListener('click', () => {
        const giftType = document.getElementById('giftType').value;
        const assetValue = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);

        if (isNaN(assetValue) || assetValue <= 0) {
            alert('유효한 금액을 입력하세요.');
            return;
        }

        let taxRate = 0;

        // 증여 종류에 따른 세율 설정
        if (giftType === 'general') {
            taxRate = 0.035; // 일반 증여 세율
        } else if (giftType === 'corporate') {
            taxRate = 0.04; // 법인 증여 세율
        }

        const acquisitionTax = Math.floor(assetValue * taxRate); // 취득세 계산

        // 결과 출력
        updateResult('증여 취득 계산 결과', `
            <p>증여 종류: ${giftType}</p>
            <p>증여 금액: ${assetValue.toLocaleString()} 원</p>
            <p>취득세: ${acquisitionTax.toLocaleString()} 원</p>
            <p>세율: ${(taxRate * 100).toFixed(1)}%</p>
        `);

        giftModal.style.display = 'none';
    });

    // 닫기 버튼 클릭 이벤트
closeGiftModal.addEventListener('click', () => {
    giftModal.style.display = 'none';
});
    
    // === [4] 공통 함수: 결과 업데이트 ===
    function updateResult(title, details) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<h3>${title}</h3>${details}`;
    }

    // === [5] 모달 외부 클릭 공통 처리 ===
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

// === [4] 상속 모달 관련 코드 ===
const inheritanceButton = document.getElementById('inheritanceButton'); // 상속취득 버튼
const inheritanceModal = document.getElementById('inheritanceModal');   // 상속취득 모달
const confirmInheritanceType = document.getElementById('confirmInheritanceType'); // 확인 버튼
const closeInheritanceModal = document.getElementById('closeInheritanceModal');   // 닫기 버튼

// 상속취득 버튼 클릭 시 모달 표시
inheritanceButton.addEventListener('click', () => {
    inheritanceModal.style.display = 'flex';
});

// 상속취득 모달 확인 버튼 클릭 이벤트
confirmInheritanceType.addEventListener('click', () => {
    const inheritanceType = document.getElementById('inheritanceType').value; // 상속 종류
    const isAdjustedArea = document.getElementById('isAdjustedAreaInheritance').value === 'yes'; // 조정 대상 여부
    const assetValue = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);

    if (isNaN(assetValue) || assetValue <= 0) {
        alert('유효한 금액을 입력하세요.');
        return;
    }

    let taxRate = 0;

    // 상속 종류에 따른 세율 설정
    if (inheritanceType === 'general') {
        taxRate = isAdjustedArea ? 0.028 : 0.03; // 일반 상속: 조정 대상 여부에 따라 세율 변경
    } else if (inheritanceType === 'corporate') {
        taxRate = 0.04; // 법인 상속
    }

    const acquisitionTax = Math.floor(assetValue * taxRate); // 취득세 계산

    // 결과 출력
    updateResult('상속 취득 계산 결과', `
        <p>상속 종류: ${inheritanceType}</p>
        <p>조정 대상 지역: ${isAdjustedArea ? '예' : '아니오'}</p>
        <p>상속 금액: ${assetValue.toLocaleString()} 원</p>
        <p>취득세: ${acquisitionTax.toLocaleString()} 원</p>
        <p>세율: ${(taxRate * 100).toFixed(1)}%</p>
    `);

    inheritanceModal.style.display = 'none';
});

// 닫기 버튼 클릭 이벤트
closeInheritanceModal.addEventListener('click', () => {
    inheritanceModal.style.display = 'none';
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === inheritanceModal) {
        inheritanceModal.style.display = 'none';
    }
});

    // 계산 버튼 클릭 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        let assetValue = 0; // 자산 금액 초기화
        let taxRate = 0; // 취득세율 초기화
        const educationTaxRate = 0.1; // 지방교육세율 (10%)
        const ruralTaxRate = 0.2; // 농어촌특별세율 (20%)

        // 재산 유형이 "부동산"인 경우
        if (assetType.value === 'realEstate') {
            assetValue = parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
            const realEstateType = document.getElementById('realEstateType').value;

            // 부동산 종류에 따른 취득세율 설정
            switch (realEstateType) {
                case 'residential1': // 1세대 1주택
                    taxRate = assetValue <= 100000000 ? 0.01 : assetValue <= 600000000 ? 0.015 : 0.03;
                    break;
                case 'residentialMulti': // 다주택
                    taxRate = 0.08;
                    break;
                case 'commercial': // 상업용
                case 'land': // 토지
                    taxRate = 0.04;
                    break;
            }
        }
        // 재산 유형이 "차량"인 경우
        else if (assetType.value === 'vehicle') {
            assetValue = parseInt(document.getElementById('vehiclePrice').value.replace(/,/g, '') || '0', 10);
            const vehicleType = document.getElementById('vehicleType').value;

            // 차량 종류에 따른 취득세율 설정
            taxRate = vehicleType === 'compact' ? 0.05 : 0.07; // 경차: 5%, 일반 차량: 7%
        }
        // 재산 유형이 "기타"인 경우
        else if (assetType.value === 'other') {
            assetValue = parseInt(document.getElementById('otherAssetValue').value.replace(/,/g, '') || '0', 10);
            taxRate = 0.03; // 기타 자산의 취득세율: 3%
        }

        // 세금 계산
        const acquisitionTax = Math.floor(assetValue * taxRate); // 취득세
        const educationTax = Math.floor(acquisitionTax * educationTaxRate); // 지방교육세
        const ruralTax = Math.floor(acquisitionTax * ruralTaxRate); // 농어촌특별세
        const totalTax = acquisitionTax + educationTax + ruralTax; // 총 세금

        // 결과 출력
        document.getElementById('result').innerHTML = `
            <h3>계산 결과</h3>
            <p>취득세: ${acquisitionTax.toLocaleString()} 원</p>
            <p>지방교육세: ${educationTax.toLocaleString()} 원</p>
            <p>농어촌특별세: ${ruralTax.toLocaleString()} 원</p>
            <p><strong>총 세금: ${totalTax.toLocaleString()} 원</strong></p>
        `;
    }); // 닫는 괄호 및 세미콜론 위치 확인

    
    
