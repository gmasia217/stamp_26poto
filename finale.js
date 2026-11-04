document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  
  saveBtn.addEventListener('click', () => {
    const captureArea = document.getElementById('capture-area');
    
    // 버튼 텍스트 변경
    const originalText = saveBtn.innerText;
    saveBtn.innerText = '저장 중...';
    saveBtn.disabled = true;

    // html2canvas 실행
    html2canvas(captureArea, {
      backgroundColor: '#1e1e1e', // 캡처 시 배경색 지정
      scale: 2 // 고해상도 캡처
    }).then(canvas => {
      // 이미지 링크 생성 및 다운로드 트리거
      const link = document.createElement('a');
      link.download = '빌리엘리어트_정산판.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // 버튼 원상복구
      saveBtn.innerText = originalText;
      saveBtn.disabled = false;
    }).catch(err => {
      console.error('캡처 중 오류가 발생했습니다:', err);
      alert('이미지 저장에 실패했습니다.');
      saveBtn.innerText = originalText;
      saveBtn.disabled = false;
    });
  });
});
