document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. 외부 DB / 사이트에서 받아온 데이터 (예시)
    //    실제 서비스 연동 시 백엔드 API나 전역 변수에서 받아옵니다.
    // ==========================================
    const dbData = {
        total_views: 2, // 총 관람 횟수
        actor_counts: {
            // 배우별 HTML 엘리먼트 ID : 관람 횟수
            'c_phantom_cho': 2,   // 조승우
            'c_phantom_choi': 0,  // 최재림
            'c_phantom_kim': 0,   // 김주택
            'c_chris_son': 2,     // 손지수
            'c_chris_song': 0,    // 송은혜
            'c_raoul_song': 2,    // 송원근
            'c_raoul_hwang': 0,   // 황건하
            'c_carlotta_lee': 2,  // 이지영
            'c_carlotta_han': 0,  // 한보라
            'c_andre_yoon': 2,    // 윤영석
            'c_firmin_lee': 2,    // 이상준
            'c_giry_kim': 2,      // 김아선
            'c_piangi_park': 2,   // 박회림
            'c_meg_cho': 2        // 조하린
        },
        // 관람한 좌석의 인덱스 번호 목록 (예시)
        viewed_seats: [42, 115] 
    };

    // ==========================================
    // 2. 캐스트 데이터 화면 매핑
    // ==========================================
    function renderCastCounts() {
        for (const [elementId, count] of Object.entries(dbData.actor_counts)) {
            const el = document.getElementById(elementId);
            if (el) {
                // 1회 이상 본 경우만 숫자를 노출 (0회는 빈 문자열)
                el.innerText = count > 0 ? count : '';
            }
        }
        
        // 전체 관람 횟수 적용
        const totalEl = document.getElementById('total_views');
        if (totalEl) {
            totalEl.innerText = dbData.total_views;
        }
    }

    // ==========================================
    // 3. 좌석배치도 자동 생성 & 관람 좌석 표시
    // ==========================================
    function createSeatGrid(containerId, rows, colsPerRow, startIdx) {
        const container = document.getElementById(containerId);
        if (!container) return startIdx;

        let currentIdx = startIdx;

        for (let r = 0; r < rows; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';

            for (let c = 0; c < colsPerRow; c++) {
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';

                // 관람한 좌석 배열에 현재 인덱스가 포함되어 있으면 점등
                if (dbData.viewed_seats.includes(currentIdx)) {
                    seatDiv.classList.add('viewed');
                }

                rowDiv.appendChild(seatDiv);
                currentIdx++;
            }
            container.appendChild(rowDiv);
        }
        return currentIdx;
    }

    // 1층, 2층, 3층 좌석 그리드 생성 (인덱스 연속 부여)
    function initSeatMap() {
        let seatIndex = 0;
        seatIndex = createSeatGrid('seatMap1F', 14, 28, seatIndex); // 1층
        seatIndex = createSeatGrid('seatMap2F', 7, 28, seatIndex);  // 2층
        seatIndex = createSeatGrid('seatMap3F', 5, 28, seatIndex);  // 3층
    }

    // ==========================================
    // 4. 앙상블 / 댄서 / 스윙 더미 프레임 생성
    // ==========================================
    function createEnsembleFrames(containerId, count, imgPrefix) {
        const container = document.getElementById(containerId);
        if (!container) return;

        for (let i = 1; i <= count; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'ens-img-wrap';

            const img = document.createElement('img');
            img.className = 'ens-img';
            img.src = `assets/${imgPrefix}_${i}.jpg`;
            // 이미지 없을 시 엑박 없이 빈 박스로 유지
            img.onerror = function() {
                this.style.display = 'none';
            };

            wrap.appendChild(img);
            container.appendChild(wrap);
        }
    }

    function initEnsembles() {
        createEnsembleFrames('ensembleGrid', 14, 'ens');   // ENSEMBLE 14명
        createEnsembleFrames('dancerGrid', 8, 'dancer');    // DANCER 8명
        createEnsembleFrames('swingGrid', 5, 'swing');      // SWING 5명
    }

    // ==========================================
    // 5. 이미지 저장 (html2canvas 활용)
    // ==========================================
    function initCaptureButton() {
        const captureBtn = document.querySelector('.btn-capture');
        if (!captureBtn) return;

        captureBtn.addEventListener('click', () => {
            const board = document.getElementById('capture-area');
            if (!board) return;

            // 버튼 상태 변경
            const originalText = captureBtn.innerText;
            captureBtn.innerText = '이미지 생성 중...';
            captureBtn.disabled = true;

            html2canvas(board, {
                scale: 2,               // 고해상도 (Retina 대응)
                backgroundColor: "#080a11", // 배경색 강제 지정 (투명 방지)
                useCORS: true,          // 외부 이미지 로드 허용
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'Phantom_of_the_Opera_ 정산판.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                // 버튼 원상 복구
                captureBtn.innerText = originalText;
                captureBtn.disabled = false;
            }).catch(err => {
                console.error('이미지 저장 중 오류가 발생했습니다:', err);
                alert('이미지 저장에 실패했습니다.');
                captureBtn.innerText = originalText;
                captureBtn.disabled = false;
            });
        });
    }

    // ==========================================
    // 초기화 함수 실행
    // ==========================================
    renderCastCounts();
    initSeatMap();
    initEnsembles();
    initCaptureButton();
});
