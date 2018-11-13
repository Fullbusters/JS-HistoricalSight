import './scss/index.scss';


const url = 'https://webhospitaldb.herokuapp.com/api/region';
const xmlhttp = new XMLHttpRequest();

const $regionList = document.getElementById('regions-list');
const $content = document.getElementById('content');

const getAllRegions = function () {
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      createListRegions(JSON.parse(this.responseText));
    }
  };
  
  function createListRegions (arr) {
    for ( let i = 0; i < arr.length; i++) {
      const li = document.createElement('li');
      li.id = arr[i].id;
      li.innerHTML = '<span class="menu-region"  id="' + arr[i].id 
      + '">' + arr[i].title + '</span>';
      $regionList.appendChild(li);
    } 
  }

  $regionList.addEventListener('click', event => {
    if (event.target.classList.contains('menu-region')) {
      clearContent();
      getOneRegion(event.target.id);  
    }
  });
};


const clearContent = function () {
  $content.removeChild($content.firstChild);
};

const getOneRegion = function (id) {
  xmlhttp.open('GET', url + '/' + id, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      createInfo(JSON.parse(this.responseText));
    }
  };

  function createInfo (region) {
    const div = document.createElement('div');
    div.innerHTML = '<h2 class="title">' + region.title + '</h2>';
    div.innerHTML += '<ul class="city-list" id="cityList"></ul>';
    $content.appendChild(div);
    

    xmlhttp.open('GET', url + '/' + id + '/city', true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        createCityList(data);
      }
    };

    const cityList = document.getElementById('cityList');

    function createCityList (cityArr) {
     
      for (let i = 0; i < cityArr.length ; i++) {
        const li = document.createElement('li');
        li.className = 'primary-btn text-uppercase click-area';
        li.id = cityArr[i].id;
        li.innerHTML =  cityArr[i].title  ;
        cityList.appendChild(li);
      }
      
    }

    cityList.addEventListener('click', event => {
      if (event.target.classList.contains('click-area')) {
        clearCity();
        createCityInfo(event.target.id);
      }
    });
  }
  const cityInfo = document.getElementById('city-info');

  const clearCity =  function () {
    cityInfo.removeChild(cityInfo.firstChild);
  };
  
  
  const createCityInfo = function (id) {
    const urlCity = 'https://webhospitaldb.herokuapp.com/api/city'; 
    xmlhttp.open('GET', urlCity + '/' + id, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        createCityInfoTitle(data);
      }
    };

    const createCityInfoTitle = function (data) {
      const div = document.createElement('div');
      div.className = 'city-info ';
      div.innerHTML = '<h1> ' + data.title + '</h1>';
      div.innerHTML += '<ul class="list-HS"  id="HSlist"></ul>';
      cityInfo.appendChild(div);

      const historicaSightList = document.getElementById('HSlist');

      const createHistoricaSightList = function (data) {
        for (let i = 0 ; i < data.length; i++) {
          const div = document.createElement('div');
          div.className = 'list';
          div.innerHTML = '<div class="title-HS">' + data[i].title + '</div><ul><li>' +
           data[i].info + '</li><img class="image" src="' + data[i].image + '"/></ul>';
          historicaSightList.appendChild(div);
        }

        historicaSightList.addEventListener('click',function (){
          event.target.parentNode.lastChild.classList.toggle('open');
        });
        
      };
      createHistoricaSightList(data.historicalSights);
    
    };

  };
};

const showMainPage = function () {
  clearContent();
  const div = document.createElement('div');
  div.className = 'banner';
  div.innerHTML = '<h2 class="title"><strong>Historical Sight:' +
  '</strong> Site with information about all historical places of Ukraine.</h2>';
  $content.appendChild(div);
  
};

const busgerMenuInit = function () {
  const menuBtn = document.getElementById('menu-btn');
  const body = document.getElementById('body');
  menuBtn.addEventListener('click',function (){
    body.classList.toggle('sidebar_closed');
  });
};

window.onload = function () {
  busgerMenuInit();

  getAllRegions();
  showMainPage();



};

