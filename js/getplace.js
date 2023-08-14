 function getPlace(date_value){
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value; 
    let getMonth = document.getElementById("calMonth").classList;
    var url = `http://localhost:3000/place?select_part=${selectPart}&select_place=${selectPlace}&valueToFind=${date_value}&Calendar=${getMonth}`;
        
    fetch( url, {
        method: 'GET',
        })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
            return response.json();
            })
    .then(function(data) {
        console.log(data)
        document.getElementById('place').innerHTML = data.time
        // 서버에서 보낸 데이터를 처리
        console.log(data);
        // 웹 페이지에 데이터를 추가하거나 필요한 작업 수행
        })
        .catch(function(error) {
         // 에러 처리
            console.error(error);
        });
};

function fn_resveInfoFee(date, className){
    const date_value = date.slice(8, 10);
    // return date_value;
}
function btnActive(e) {
    date_value = parseInt(e.innerText);
    console.log(date_value);
    getPlace(date_value);
}
