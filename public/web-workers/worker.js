self.onmessage = (e) => {
  console.log('开始预加载')
  const { data } = e
  let urls = []
  let nums = [] // 统计数据
  let apis = ["/api/tj/login/count", "/api/tj/today/added", "/api/tj/today/amount"]
  let responses = new Map()
  // 根据urls去请求对应的接口，然后将结果全部缓存下来
  if (data.action === 'preloadData') {
    urls = data.data.map((item) => 'http://' + item.ip)
    console.log(urls)
    urls.forEach((ip, index) => {
      const nums = {} // 存放单个服务器的数据统计
      let charts = {} // 存放单个服务器的图表统计数据
      Promise.all(
        [...apis.map((api, index) => {
          return new Promise((r, j) => {
            fetch(ip + api).then(res => {
              res.json().then(d => {
                r({ index, ...d })
              })
            })
          })
        }),
        new Promise((reslove, reject) => {
          fetch(ip + "/api/tj/plat", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ kssj: data.params.start, jssj: data.params.end })
          }).then(res => res.json()).then(d => reslove({ index: 3, data: { ...d } }))
        })
        ]
      ).then(res => {
        res.forEach(res => {
          const { index, data = {} } = res
          if (index == 0) {
            nums['d1'] = data.login || 0;
            nums['d2'] = data.all || 0;
          }
          if (index == 1) {
            nums['d3'] = data || 0;
          }
          if (index == 2) {
            nums['d4'] = data.today || 0;
            nums['d5'] = data.all || 0;
          }
          if (index == 3) {
            charts = data
          }
        })
        responses.set(ip, { nums, charts })
        console.log('responses', responses)
        index == urls.length - 1 && postMessage({ data: responses })

      })


    })

  }
}


// .then((d) => {
//   const { data } = d
//   if (index == 0) {
//     nums['d1'] = data.login || 0;
//     nums['d2'] = data.all || 0;
//   }
//   if (index == 1) {
//     nums['d3'] = data || 0;
//   }
//   if (index == 2) {
//     nums['d4'] = data.today || 0;
//     nums['d5'] = data.all || 0;
//   }
// });
