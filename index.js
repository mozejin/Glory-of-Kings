(async function () {
  /**
   * 从网络获取当前的英雄数据
   * @returns Promise
   */
  async function getHeroes() {
    return fetch('https://study.duyiedu.com/api/herolist')
      .then((resp) => resp.json())
      .then((resp) => resp.data.reverse());
  }

  //获取dom元素
  const doms = {
    list: document.querySelector('.list'),
    radios: document.querySelectorAll('.radio'),
    input: document.querySelector('.input input'),
  };

  //初始化页面
  const heroes = await getHeroes();
  setHeroesHTML(heroes);

  //交互页面，给点击加上样式和事件
  for (const item of doms.radios) {
    item.addEventListener('click', function () {
      //更改radio的样式
      setChoose(this);
      //更改ul中的数据
      searchHeros(this);
    });
  }

  //给搜索框注册事件
  doms.input.addEventListener('input', function () {
    let newHeroes = heroes.filter((item) => {
      return item.cname.includes(this.value);
    });
    //把radio样式先改为全部
    setChoose(document.querySelector('.radio[data-type="all"]'));
    //重新设置ul的数据
    setHeroesHTML(newHeroes);
  });

  //更改radio的样式
  function setChoose(radio) {
    const check = document.querySelector('.checked');
    check.classList.remove('checked');
    radio.classList.add('checked');
  }

  //更改ul中的数据
  function searchHeros(radio) {
    let newHeroes;
    if (radio.dataset.type === 'all') {
      newHeroes = heroes;
    } else if (radio.dataset.type === 'pay_type') {
      newHeroes = heroes.filter((item) => {
        return item.pay_type === +radio.dataset.value;
      });
    } else {
      newHeroes = heroes.filter((item) => {
        return (
          item.hero_type === +radio.dataset.value ||
          item.hero_type2 === +radio.dataset.value
        );
      });
    }
    setHeroesHTML(newHeroes);
  }

  //根据指定的英雄数组生成对于的html放入ul中
  function setHeroesHTML(heroes) {
    /* for (const item of heroes) {
      let li = `<li>
      <a
        href="https://pvp.qq.com/web201605/herodetail/${item.ename}.shtml"
        target="_black"
      >
        <img
          src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${item.ename}/${item.ename}.jpg"
          alt=""
        />
        <span>${item.cname}</span>
      </a>
    </li>`;
      doms.list.innerHTML += li;
    } */
    doms.list.innerHTML = heroes
      .map(
        (
          h
        ) => `<li><a href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml" target="_blank">
    <img
      src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg"
      alt=""
    />
    <span>${h.cname}</span>
  </a></li>`
      )
      .join('');
  }
})();

//在根据指定的英雄数组生成对于的html放入ul中时，如果使用循环无限加
//进去，那innerTHML只会越来越多，是个错误的做法
